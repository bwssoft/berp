import { ColumnDef } from "@tanstack/react-table";
import { IAudit } from "@/app/lib/@backend/domain";

const fieldLabel: Record<string, string> = {
  name: "nome",
  email: "e-mail",
  profile: "perfil",
  active: "status",
  external: "usuário externo",
  locked_control_code: "permissões",
};

const PERMISSION_LABELS: Record<string, string> = {
  admin: "Administração",
  "admin:control": "Administração → Controles",
  "admin:control:view": "Administração → Controles: visualizar",
  "admin:control:update": "Administração → Controles: atualizar",
  "admin:profile": "Administração → Perfis",
  "admin:profile:view": "Administração → Perfis: visualizar",
  "admin:profile:create": "Administração → Perfis: criar",
  "admin:profile:inactive": "Administração → Perfis: inativar",
  commercial: "Comercial",
  "commercial:accounts": "Comercial → Contas",
  "commercial:accounts:access:enable": "Comercial → Contas → Acesso: habilitar",
};

const SEGMENT_MAP: Record<string, string> = {
  admin: "Administração",
  control: "Controles",
  profile: "Perfis",
  commercial: "Comercial",
  accounts: "Contas",
  account: "Conta",
  access: "Acesso",
  users: "Usuários",
};

const ACTION_MAP: Record<string, string> = {
  view: "visualizar",
  create: "criar",
  update: "atualizar",
  delete: "excluir",
  inactive: "inativar",
  enable: "habilitar",
  disable: "desabilitar",
};

function toTitle(s: string) {
  const clean = s.replace(/[_-]+/g, " ").trim();
  return clean
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function translatePermission(code: string): string {
  const direct = PERMISSION_LABELS[code];
  if (direct) return direct;

  const parts = code.split(":").filter(Boolean);
  if (parts.length === 0) return code;

  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === "access" && parts[i + 1] === "enable") {
      const head = parts
        .slice(0, i)
        .map((p) => SEGMENT_MAP[p] ?? toTitle(p))
        .join(" → ");
      return head ? `${head} → Acesso: habilitar` : "Acesso: habilitar";
    }
  }

  const last = parts[parts.length - 1];
  const action = ACTION_MAP[last];
  if (action && parts.length > 1) {
    const entity = parts
      .slice(0, -1)
      .map((p) => SEGMENT_MAP[p] ?? toTitle(p))
      .join(" → ");
    return entity ? `${entity}: ${action}` : action;
  }

  return parts.map((p) => SEGMENT_MAP[p] ?? toTitle(p)).join(" → ");
}

function normalizeList(v: unknown): string[] {
  if (Array.isArray(v))
    return v
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (v == null) return [];
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function diffLists(before: unknown, after: unknown) {
  const b = normalizeList(before);
  const a = normalizeList(after);
  const bSet = new Set(b);
  const aSet = new Set(a);
  const added = a.filter((x) => !bSet.has(x));
  const removed = b.filter((x) => !aSet.has(x));
  return { added, removed, beforeAll: a, prevAll: b };
}

function formatScalar(v: unknown, field?: string) {
  if (typeof v === "boolean") {
    if (field === "active") return v ? "ativo" : "inativo";
    return v ? "sim" : "não";
  }
  if (v instanceof Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(v);
  }
  if (Array.isArray(v)) {
    // Handle profile array specifically
    if (
      field === "profile" &&
      v.length > 0 &&
      typeof v[0] === "object" &&
      v[0] !== null
    ) {
      return v.map((p: any) => p?.name || String(p)).join(", ");
    }
    return v.join(", ");
  }
  if (v == null) return "";

  // Handle objects specifically
  if (typeof v === "object" && v !== null) {
    // Handle image object
    if (field === "image" && "key" in v) {
      return (v as any).key || "";
    }

    // Handle profile objects (single profile)
    if (field === "profile" && "name" in v) {
      return (v as any).name || "";
    }

    // For other objects, try to extract meaningful information
    if ("name" in v) {
      return (v as any).name;
    }
    if ("id" in v && "name" in v) {
      return (v as any).name;
    }

    // Fallback: return empty string instead of [object Object]
    return "";
  }

  return String(v);
}

function Chip(props: { children: React.ReactNode; title?: string }) {
  return (
    <span
      title={props.title}
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800"
    >
      {props.children}
    </span>
  );
}

function ChipsRow({ items }: { items: { code: string; label: string }[] }) {
  const max = 8;
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {shown.map((x) => (
        <Chip key={x.code} title={x.code}>
          {x.label}
        </Chip>
      ))}
      {rest > 0 && <Chip>+{rest} mais</Chip>}
    </span>
  );
}

export const columns: ColumnDef<IAudit>[] = [
  {
    header: "Data/Hora",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const d = row.original.created_at;
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(d);
    },
  },
  {
    header: "Usuário",
    accessorKey: "user",
    cell: ({ row }) => row.original.user?.name ?? "",
  },
  {
    header: "Ação",
    accessorKey: "action",
    cell: ({ row }) => {
      const { action, metadata, type } = row.original;

      if (type === "create" || !metadata || metadata.length === 0) {
        return action;
      }

      const label = action.split("'")[1] ?? "registro";

return (
  <div className="space-y-2">
    {metadata.map((m, i) => {
      const field = m.field;
      const pretty = fieldLabel[field] ?? field;

      if (field === "locked_control_code") {
        const { added, removed, beforeAll, prevAll } = diffLists(
          m.before,
          m.after
        );
        const addedMap = added.map((code) => ({
          code,
          label: translatePermission(code),
        }));
        const removedMap = removed.map((code) => ({
          code,
          label: translatePermission(code),
        }));
        const beforeMap = prevAll.map((code) =>
          translatePermission(code)
        );
        const afterMap = beforeAll.map((code) =>
          translatePermission(code)
        );

        return (
          <div key={i} className="space-y-1">
            <div>{`Permissões de '${label}' alteradas`}</div>
            {addedMap.length > 0 && (
              <div className="text-sm">
                <span className="mr-1 text-green-600 font-medium">
                  Adicionadas:
                </span>
                <ChipsRow items={addedMap} />
              </div>
            )}
            {removedMap.length > 0 && (
              <div className="text-sm">
                <span className="mr-1 text-red-600 font-medium">
                  Removidas:
                </span>
                <ChipsRow items={removedMap} />
              </div>
            )}
          </div>
        );
      }

      const before = formatScalar(m.before, field);
      const after = formatScalar(m.after, field);

      const renderValue = (value: string) => {
        if (pretty === "perfil") {
          return (
            <span className="font-medium flex flex-wrap">
              {value.split(",").map((part, idx, arr) => (
                <span key={idx}>
                  {part.trim()}
                  {idx < arr.length - 1 && `,\u00A0`} 
                </span>
              ))}
            </span>
          );
        }

        return <span className="font-medium break-words">{value}</span>;
      };

        return (
          <div key={i} className="text-sm w-[20vw]">
            <span className="mr-1 font-bold">{`Campo '${pretty}' de`}</span>
            {renderValue(before)}
            <span className="mx-1 font-bold">para</span>
            {renderValue(after)}
          </div>
          );
        })}
      </div>
      );
    },
  },
];
