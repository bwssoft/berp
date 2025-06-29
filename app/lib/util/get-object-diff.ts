type DiffEntry = {
  /** caminho até a propriedade, ex: "general.ip_primary.address" */
  path: string;
  /** valor desejado (o que veio em desired_profile.config) */
  desired?: any;
  /** valor aplicado (o que veio em applied_profile) */
  applied?: any;
};

type KeySelection = "desired" | "applied" | "all";

type Props = {
  desired: Record<string, any>;
  applied: Record<string, any>;
  parentPath?: string;
  keySelection?: KeySelection;
};

export function diffObjects({
  desired,
  applied,
  parentPath = "",
  keySelection = "all",
}: Props): DiffEntry[] {
  const diffs: DiffEntry[] = [];
  const desiredKeys = Object.keys(desired);
  const appliedKeys = Object.keys(applied);
  let allKeys: string[] | Set<string>;

  switch (keySelection) {
    case "desired":
      allKeys = desiredKeys;
      break;
    case "applied":
      allKeys = appliedKeys;
      break;
    case "all":
    default:
      allKeys = new Set([...desiredKeys, ...appliedKeys]);
      break;
  }

  for (const key of Array.from(allKeys)) {
    const path = parentPath ? `${parentPath}.${key}` : key;
    const vDesired = desired?.[key];
    const vApplied = applied?.[key];

    const bothObjects =
      vDesired != null &&
      vApplied != null &&
      typeof vDesired === "object" &&
      !Array.isArray(vDesired) &&
      typeof vApplied === "object" &&
      !Array.isArray(vApplied);

    if (bothObjects) {
      // mergem as diferenças internas
      diffs.push(
        ...diffObjects({
          desired: vDesired,
          applied: vApplied,
          parentPath: path,
          keySelection,
        })
      );
    } else if (vDesired !== vApplied) {
      // mudança simples ou chave faltando de um lado
      diffs.push({ path, desired: vDesired, applied: vApplied });
    }
  }

  return diffs;
}
