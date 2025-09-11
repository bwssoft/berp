import { singleton } from "@/app/lib/util/singleton";
import { BrazilianUF, IPriceTableCondition, IPriceTableConditionGroup } from "../../../domain";

namespace Dto {
  export type GroupWithPriority = IPriceTableConditionGroup & { priorityEnabled?: boolean };

  export type Input = {
    groups: GroupWithPriority[];
  };

  export type Output = {
    success: boolean;
    status: "green" | "yellow" | "red";
    messages: string[];
    details?: {
      missingStates?: UF[];
      duplicateKeys?: string[];
      invalidPriorityGroups?: number[];
      groupsOnlyLimitedNoUnlimited?: number[];
      groupsWithMissingCompany?: number[];
    };
    error?: { global?: string };
  };
}

class ValidateBillingConditionsPriceTableUsecase {
  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const totalConds = input.groups.reduce((acc, g) => acc + g.conditions.length, 0);
      if (totalConds === 0) {
        return {
          success: true,
          status: "red",
          messages: [
            "Nenhuma condição foi configurada, favor configurar ao menos uma condição antes de realizar a validação!"
          ],
        };
      }

      let status: Dto.Output["status"] = "green";
      const messages: string[] = [];
      const details: Dto.Output["details"] = {};

      // 1) Cobertura de UFs
      const cov = validateCoverage(input.groups);
      if (!cov.ok) {
        status = "yellow";
        messages.push("É obrigatório que todos os estados estejam incluídos em condições.");
        details.missingStates = cov.missing;
      }

      // 2) Específica com limite exige alguma "sem limite"
      const unl = validateNeedsUnlimited(input.groups);
      if (!unl.ok) {
        status = "yellow";
        messages.push("É obrigatório cadastrar ao menos uma condição sem limite de faturamento para estados que foram especificados em condições.");
      }

      // 3) Empresa obrigatória
      const comp = validateCompanyRequired(input.groups);
      if (!comp.ok) {
        status = "yellow";
        messages.push("Em cada condição é obrigatório faturar para uma empresa.");
        details.groupsWithMissingCompany = comp.groupsIdx;
      }

      // 4) Duplicadas (respeitando exceção por grupo)
      const dups = findDuplicates(input.groups);
      if (dups.length > 0) {
        status = "yellow";
        messages.push("Não é possível cadastrar condições duplicadas.");
        details.duplicateKeys = dups;
      }

      // 5) Grupo ALL não pode ser só "com limite"
      const onlyLim = validateGroupOnlyLimitedWhenAll(input.groups);
      if (!onlyLim.ok) {
        status = "yellow";
        messages.push("Não é permitido o cadastro apenas de condições com limite de faturamento no mesmo grupo, cadastre ao menos uma condição sem limite.");
        details.groupsOnlyLimitedNoUnlimited = onlyLim.invalidGroupIdx;
      }

      // 6) Prioridade por grupo (quando ligada)
      const prio = validatePriorityGroups(input.groups);
      if (!prio.ok) {
        status = "yellow";
        messages.push("Para habilitar a prioridade de faturamento de um grupo é necessário conter limite de faturamento em todos as condições do grupo, com exceção da última que deverá estar sem limite cadastrado.");
        details.invalidPriorityGroups = prio.invalid;
      }

      messages.push("Condições validadas com sucesso!");
      return { success: true, status, messages, details };
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
function limitKind(limit?: string) {
  return isUnlimited(limit) ? "SEM_LIM" : "LIM"; // binário
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
  const conditions = groups.flatMap(g => g.conditions);

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
  const conditions = groups.flatMap(g => g.conditions);
  const hasSpecificWithLimit = conditions.some(c => !isALL(c.salesFor) && !isUnlimited(c.billingLimit));
  if (!hasSpecificWithLimit) return { ok: true };
  const hasAnyUnlimited = conditions.some(c => isUnlimited(c.billingLimit));
  return { ok: hasAnyUnlimited };
}

/* ---- 3) Empresa obrigatória em cada condição ---- */
function validateCompanyRequired(groups: Dto.GroupWithPriority[]) {
  const groupsIdx: number[] = [];
  groups.forEach((g, gi) => {
    const hasMissing = g.conditions.some(c => !c.toBillFor || !c.toBillFor.trim());
    if (hasMissing) groupsIdx.push(gi);
  });
  return { ok: groupsIdx.length === 0, groupsIdx };
}

/* ---- 4) Duplicadas (com exceção: específico + sem limite dentro do mesmo grupo) ---- */
function findDuplicates(groups: Dto.GroupWithPriority[]) {
  const counts = new Map<string, Map<number, number>>();

  groups.forEach((g, gi) => {
    g.conditions.forEach(c => {
      const key = `${statesKey(c.salesFor)}::${billKey(c.toBillFor)}::${limitKind(c.billingLimit)}`;
      const perGroup = counts.get(key) ?? new Map<number, number>();
      perGroup.set(gi, (perGroup.get(gi) ?? 0) + 1);
      counts.set(key, perGroup);
    });
  });

  const duplicates: string[] = [];
  counts.forEach((perGroup) => {
    if (perGroup.size > 1) { duplicates.push("x"); return; } // aparece em grupos diferentes
    const [, qty] = Array.from(perGroup.entries())[0];
    if (qty > 1) duplicates.push("x"); // repete no mesmo grupo
  });
  return duplicates;
}

/* ---- 5) Grupo com todas condições ALL não pode ser só "com limite" ---- */
function validateGroupOnlyLimitedWhenAll(groups: Dto.GroupWithPriority[]) {
  const invalidGroupIdx: number[] = [];
  groups.forEach((g, gi) => {
    const allAreALL = g.conditions.length > 0 && g.conditions.every(c => isALL(c.salesFor));
    if (!allAreALL) return;
    const hasUnlimited = g.conditions.some(c => isUnlimited(c.billingLimit));
    if (!hasUnlimited) invalidGroupIdx.push(gi);
  });
  return { ok: invalidGroupIdx.length === 0, invalidGroupIdx };
}

/* ---- 6) Prioridade por grupo (quando ligada) ---- */
function validatePriorityGroups(groups: Dto.GroupWithPriority[]) {
  const invalid: number[] = [];
  groups.forEach((g, gi) => {
    // priorityEnabled é opcional; trate como false quando ausente
    const priorityEnabled = !!(g as any).priorityEnabled;
    if (!priorityEnabled) return;

    const list = g.conditions;
    if (list.length < 2) { invalid.push(gi); return; }

    const allButLastHaveLimit = list.slice(0, -1).every(c => !isUnlimited(c.billingLimit));
    const lastIsUnlimited = isUnlimited(list[list.length - 1].billingLimit);

    if (!(allButLastHaveLimit && lastIsUnlimited)) invalid.push(gi);
  });
  return { ok: invalid.length === 0, invalid };
}