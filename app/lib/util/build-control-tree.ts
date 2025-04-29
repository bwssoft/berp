import { IControl } from "../@backend/domain";

export type ControlTree = (IControl & { children: ControlTree })[];

// Função para montar a árvore de hierarquia dos controles
function buildControlTree(controls: IControl[]): ControlTree {
  // Lookup para mapear cada controle pelo seu código e inicializa o campo "children"
  const lookup: {
    [key: string]: ControlTree[number];
  } = {};
  controls.forEach((control) => {
    lookup[control.code] = { ...control, children: [] };
  });

  const tree: ControlTree = [];

  // Monta a árvore: se o controle possui parent_code, é adicionado como filho do pai; caso contrário, é elemento de nível superior
  controls.forEach((control) => {
    if (control.parent_code) {
      const parent = lookup[control.parent_code];
      if (parent) {
        parent.children.push(lookup[control.code]);
      } else {
        // Caso o parent_code não seja encontrado, adiciona no nível superior
        tree.push(lookup[control.code]);
      }
    } else {
      tree.push(lookup[control.code]);
    }
  });

  return tree;
}

export { buildControlTree };
