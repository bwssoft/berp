import { singleton } from "@/app/lib/util/singleton";
import { BrazilianUF, IPriceTableConditionGroup } from "../../../domain";

namespace Dto {
  export type GroupWithPriority = IPriceTableConditionGroup & { priorityEnabled?: boolean };

  export type Input = {
    groups: GroupWithPriority[];
  };

  export type Output = {
    success: boolean;
    status: "green" | "yellow" | "red";
    messages: string[];
    error?: { global?: string };
  };
}

class ValidateBillingConditionsPriceTableUsecase {
  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const totalConds = input.groups.reduce((acc, g) => acc + (g.conditions?.length ?? 0), 0);

      // 0) Nenhuma condição
      if (totalConds === 0) {
        return {
          success: true,
          status: "red",
          messages: [
            "Nenhuma condição foi configurada, favor configurar ao menos uma condição antes de realizar a validação!"
          ],
        };
      }

      const problems: string[] = [];

      // 1) Cobertura de UFs
      const cov = validateCoverage(input.groups);
      if (!cov.ok) {
        problems.push("É obrigatório que todos os estados estejam incluídos em condições.");
      }

      // 2) Específica com limite exige alguma "sem limite"
      const unl = validateNeedsUnlimited(input.groups);
      if (!unl.ok) {
        problems.push("É obrigatório cadastrar ao menos uma condição sem limite de faturamento para estados que foram especificados em condições.");
      }

      // 3) Empresa obrigatória
      const comp = validateCompanyRequired(input.groups);
      if (!comp.ok) {
        problems.push("Em cada condição é obrigatório faturar para uma empresa.");
      }

      // 4) Duplicadas (global)
      const dups = findDuplicates(input.groups);
      if (dups.length > 0) {
        problems.push("Não é possível cadastrar condições duplicadas.");
      }

      // 5) Grupo ALL não pode ser só "com limite"
      //    (quando TODAS as condições ativas do grupo são ALL)
      const onlyLim = validateGroupOnlyLimitedWhenAll(input.groups);
      if (!onlyLim.ok) {
        problems.push("Não é permitido o cadastro apenas de condições com limite de faturamento no mesmo grupo, cadastre ao menos uma condição sem limite.");
      }

      // 6) Prioridade por grupo (quando ligada):
      const prio = validatePriorityGroups(input.groups);
      if (!prio.ok) {
        problems.push("Para habilitar a prioridade de faturamento de um grupo é necessário conter limite de faturamento em todos as condições do grupo, com exceção da última que deverá estar sem limite cadastrado.");
      }

      if (problems.length > 0) {
        return {
          success: true,
          status: "yellow",
          messages: [...problems],
        };
      }

      return { success: true, status: "green", messages: ["Condições validadas com sucesso!"] };
    } catch (err) {
      console.error("Falha na validação de condições de faturamento:", err);
      return { success: false, status: "red", messages: [], error: { global: "Falha ao validar condições." } };
    }
  }
}

export const validateBillingConditionsPriceTableUsecase = singleton(ValidateBillingConditionsPriceTableUsecase);

/* ===================== Helpers ===================== */

const ALL_UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
] as const;
type UF = typeof ALL_UFS[number];

function parseNumberPTBR(value?: string): number | null {
  if (!value) return null;
  const s = value.trim().replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function isUnlimited(limit?: string): boolean {
  const n = parseNumberPTBR(limit);
  return !n || n <= 0;
}
function isALL(salesFor?: BrazilianUF[]): boolean {
  return !salesFor || salesFor.length === 0;
}
function limitKey(limit?: string) {
  const n = parseNumberPTBR(limit);
  if (!n || n <= 0) return "UNL"; // sem limite
  return String(n);
}
function statesKey(salesFor?: BrazilianUF[]): string {
  if (isALL(salesFor)) return "ALL";
  const arr = Array.from(new Set((salesFor ?? []) as UF[]));
  arr.sort();
  return arr.join("|");
}
function billKey(toBillFor?: string): string {
  return (toBillFor ?? "").trim().toUpperCase();
}

/* ---- 1) Cobertura dos 27 UFs ---- */
function validateCoverage(groups: Dto.GroupWithPriority[]) {
  const conditions = groups.flatMap(g => g.conditions ?? []);

  // ALL cobre todo o país
  if (conditions.some(c => isALL(c.salesFor))) {
    return { ok: true, missing: [] as UF[] };
  }

  const covered = new Set<UF>();
  for (const c of conditions) {
    (c.salesFor ?? []).forEach(uf => covered.add(uf as UF));
  }
  const missing = ALL_UFS.filter(uf => !covered.has(uf));
  return { ok: missing.length === 0, missing };
}

/* ---- 2) Específica com limite exige alguma "sem limite" ---- */
function validateNeedsUnlimited(groups: Dto.GroupWithPriority[]) {
  const conditions = groups.flatMap(g => g.conditions ?? []);
  const hasSpecificWithLimit = conditions.some(c => !isALL(c.salesFor) && !isUnlimited(c.billingLimit));
  if (!hasSpecificWithLimit) return { ok: true };
  const hasAnyUnlimited = conditions.some(c => isUnlimited(c.billingLimit));
  return { ok: hasAnyUnlimited };
}

/* ---- 3) Empresa obrigatória em cada condição ---- */
function validateCompanyRequired(groups: Dto.GroupWithPriority[]) {
  // considera TODAS as condições; qualquer ausência de empresa reprova
  const missingSomewhere = groups.some(g =>
    (g.conditions ?? []).some(c => !(c?.toBillFor && c.toBillFor.trim()))
  );
  return { ok: !missingSomewhere };
}

/* ---- 4) Duplicadas (global) — ignora linhas incompletas e usa VALOR do limite ---- */
function findDuplicates(groups: Dto.GroupWithPriority[]) {
  const isActive = (c: any) => !!(c?.toBillFor && c.toBillFor.trim());

  const map = new Map<string, { groupIndex: number; condIndex: number }[]>();

  groups.forEach((g, gi) => {
    (g.conditions ?? []).forEach((c, ci) => {
      if (!isActive(c)) return;
      const key = `${statesKey(c.salesFor)}::${billKey(c.toBillFor)}::${limitKey(c.billingLimit)}`;
      const arr = map.get(key) ?? [];
      arr.push({ groupIndex: gi, condIndex: ci });
      map.set(key, arr);
    });
  });

  const duplicates: string[] = [];
  map.forEach((hits, key) => {
    if (hits.length > 1) duplicates.push(key);
  });
  return duplicates;
}

/* ---- 5) Grupo ALL não pode ser só "com limite"
   Aplica quando TODAS as condições ATIVAS do grupo são ALL.
   (Condição "ativa" = possui 'toBillFor' preenchido) */
function validateGroupOnlyLimitedWhenAll(groups: Dto.GroupWithPriority[]) {
  const invalidGroupIdx: number[] = [];

  const isActive = (c: any) => !!(c?.toBillFor && c.toBillFor.trim());

  groups.forEach((g, gi) => {
    const active = (g.conditions ?? []).filter(isActive);
    if (active.length === 0) return;

    const allAreALL = active.every(c => isALL(c.salesFor));
    if (!allAreALL) return;

    const hasUnlimited = active.some(c => isUnlimited(c.billingLimit));
    if (!hasUnlimited) invalidGroupIdx.push(gi);
  });

  return { ok: invalidGroupIdx.length === 0, invalidGroupIdx };
}

/* ---- 6) Prioridade por grupo (quando ligada):
   Todas com limite > 0, EXCETO a última que deve estar SEM limite ---- */
function validatePriorityGroups(groups: Dto.GroupWithPriority[]) {
  const invalid: number[] = [];

  groups.forEach((g, gi) => {
    const priorityEnabled = (g as any).priority === true || (g as any).priorityEnabled === true;
    if (!priorityEnabled) return;

    const list = g.conditions ?? [];
    if (list.length < 2) { invalid.push(gi); return; }

    const allButLastHaveLimit = list.slice(0, -1).every(c => !isUnlimited(c.billingLimit));
    const lastIsUnlimited = isUnlimited(list[list.length - 1].billingLimit);

    if (!(allButLastHaveLimit && lastIsUnlimited)) invalid.push(gi);
  });
  return { ok: invalid.length === 0, invalid };
}