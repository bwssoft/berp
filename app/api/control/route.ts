import { IControl } from "@/app/lib/@backend/domain";
import { controlRepository } from "@/app/lib/@backend/infra";
import { buildControlTree } from "@/app/lib/util";
import { nanoid } from "nanoid";

export async function GET() {
  // Suponha que este seja o array de controles já definido:
  const controls: IControl[] = [
    // Admin (nível superior)
    {
      id: nanoid(),
      name: "Admin",
      description: "Admin",
      code: "admin",
    },
    // Filhos de Engenharia - Usuários
    {
      id: nanoid(),
      name: "Usuário",
      description: "Usuário",
      code: "admin:user",
      parent_code: "admin",
    },
    {
      id: nanoid(),
      name: "Cadastrar",
      description: "Cadastrar",
      code: "admin:user:create",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Atualizar",
      description:
        "Permite acesso ao botão ‘Editar’ da coluna ‘Ações’ do grid de resultados e consequentemente à tela acessada através do botão, onde poderá fazer edições dos dados do usuário, além de boquear, fazer reset de senha, inativar e ativar.",
      code: "admin:user:update",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Visualizar",
      description:
        "Permite acesso à tela de consulta de usuários do sistema, podendo aplicar filtros, fazer pesquisa e visualizar o grid com dados pesquisados",
      code: "admin:user:view",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Bloquear",
      description: "Bloquear",
      code: "admin:user:lock",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Bloquear",
      description: "Bloquear",
      code: "admin:user:lock",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Inativar",
      description: "Inativar",
      code: "admin:user:inactive",
      parent_code: "admin:user",
    },
    {
      id: nanoid(),
      name: "Resetar senha",
      description: "Resetar senha",
      code: "admin:user:password-reset",
      parent_code: "admin:user",
    },
    // Filhos de Engenharia - Perfil
    {
      id: nanoid(),
      name: "Perfil",
      description: "Perfil",
      code: "admin:profile",
      parent_code: "admin",
    },
    {
      id: nanoid(),
      name: "Visualizar",
      description:
        "Permite acesso à tela de consulta de perfis do sistema, podendo aplicar filtros, fazer pesquisa e visualizar o grid com dados pesquisados",
      code: "admin:profile:view",
      parent_code: "admin:profile",
    },
    {
      id: nanoid(),
      name: "Cadastrar",
      description:
        "Permite acesso ao botão ‘Criar Perfil’ e consequentemente à modal acessada através do botão em questão, podendo realizar cadastro de novos perfis do sistema.",
      code: "admin:profile:create",
      parent_code: "admin:profile",
    },
    {
      id: nanoid(),
      name: "Ativar/Desativar",
      description:
        "Permite acesso ao botão ‘Ativar/Inativar’ da coluna ‘Ações’ do grid de resultados, permitindo ao usuário ativar ou inativar perfis do sistema.",
      code: "admin:profile:inactive",
      parent_code: "admin:profile",
    },
    // Filhos de Engenharia - Controle de acesso
    {
      id: nanoid(),
      name: "Controle de Acesso",
      description: "Controle de Acesso",
      code: "admin:control",
      parent_code: "admin",
    },
    {
      id: nanoid(),
      name: "Visualizar",
      description:
        "Permite acesso à tela de consulta de controles de acessos do sistema, podendo consultar os controles existentes e os perfis vinculados em cada controle.",
      code: "admin:control:view",
      parent_code: "admin:control",
    },
    {
      id: nanoid(),
      name: "Controle",
      description:
        "Permite acesso ao campo ‘Perfil’ e ao botão ‘Pesquisar’ da tela, podendo o usuário aplicar um perfil específico e consequentemente adicionar ou remover acessos aos perfis do sistema.",
      code: "admin:control:update",
      parent_code: "admin:control",
    },
    // Engenharia (nível superior)
    {
      id: nanoid(),
      name: "Engenharia",
      description: "Engenharia",
      code: "engineer",
    },
    // Filhos de Engenharia - Insumos
    {
      id: nanoid(),
      name: "Insumos",
      description: "Insumos",
      code: "engineer:input",
      parent_code: "engineer",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Insumos",
      code: "engineer:input:view",
      parent_code: "engineer:input",
    },
    {
      id: nanoid(),
      name: "Categorias",
      description: "Categorias de Insumos",
      code: "engineer:input:category",
      parent_code: "engineer:input",
    },
    {
      id: nanoid(),
      name: "Entradas e Saídas",
      description: "Entradas e Saídas de Insumos",
      code: "engineer:input:transaction",
      parent_code: "engineer:input",
    },
    {
      id: nanoid(),
      name: "Estoque",
      description: "Estoque de Insumos",
      code: "engineer:input:inventory",
      parent_code: "engineer:input",
    },
    {
      id: nanoid(),
      name: "Análise",
      description: "Análise de Insumos",
      code: "engineer:input:analyse",
      parent_code: "engineer:input",
    },

    // Filhos de Engenharia - Produtos
    {
      id: nanoid(),
      name: "Produtos",
      description: "Produtos",
      code: "engineer:product",
      parent_code: "engineer",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Produtos",
      code: "engineer:product:view",
      parent_code: "engineer:product",
    },
    {
      id: nanoid(),
      name: "Categorias",
      description: "Categorias de Produtos",
      code: "engineer:product:category",
      parent_code: "engineer:product",
    },
    {
      id: nanoid(),
      name: "Entradas e Saídas",
      description: "Entradas e Saídas de Produtos",
      code: "engineer:product:transaction",
      parent_code: "engineer:product",
    },
    {
      id: nanoid(),
      name: "Estoque",
      description: "Estoque de Produtos",
      code: "engineer:product:inventory",
      parent_code: "engineer:product",
    },
    {
      id: nanoid(),
      name: "Análise",
      description: "Análise de Produtos",
      code: "engineer:product:analyse",
      parent_code: "engineer:product",
    },
    {
      id: nanoid(),
      name: "Fichas técnicas",
      description: "Fichas técnicas de Produtos",
      code: "engineer:product:technical_sheets",
      parent_code: "engineer:product",
    },

    // Filhos de Engenharia - Equipamentos
    {
      id: nanoid(),
      name: "Equipamentos",
      description: "Equipamentos",
      code: "engineer:device",
      parent_code: "engineer",
    },

    // Filhos de Engenharia - Firmware
    {
      id: nanoid(),
      name: "Firmware",
      description: "Firmware",
      code: "engineer:firmware",
      parent_code: "engineer",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Firmware",
      code: "engineer:firmware:view",
      parent_code: "engineer:firmware",
    },
    {
      id: nanoid(),
      name: "Requisições para atualização",
      description: "Requisições para atualização de Firmware",
      code: "engineer:firmware:requisicoes-atualizacao",
      parent_code: "engineer:firmware",
    },

    // Filhos de Engenharia - Comandos
    {
      id: nanoid(),
      name: "Comandos",
      description: "Comandos",
      code: "engineer:command",
      parent_code: "engineer",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Comandos",
      code: "engineer:command:view",
      parent_code: "engineer:command",
    },
    {
      id: nanoid(),
      name: "Agendamento",
      description: "Agendamento de Comandos",
      code: "engineer:command:agendamento",
      parent_code: "engineer:command",
    },

    // Filhos de Engenharia - Perfil de configuração
    {
      id: nanoid(),
      name: "Perfil de configuração",
      description: "Perfil de configuração",
      code: "engineer:configuration-profile",
      parent_code: "engineer",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Perfil de configuração",
      code: "engineer:configuration-profile:view",
      parent_code: "engineer:configuration-profile",
    },

    // Produção (nível superior)
    {
      id: nanoid(),
      name: "Produção",
      description: "Produção",
      code: "production",
    },
    // Filhos de Produção - Ordens de produção
    {
      id: nanoid(),
      name: "Ordens de produção",
      description: "Ordens de produção",
      code: "production:order",
      parent_code: "production",
    },
    {
      id: nanoid(),
      name: "Dashboard",
      description: "Dashboard de Ordens de produção",
      code: "production:order:dashboard",
      parent_code: "production:order",
    },
    {
      id: nanoid(),
      name: "Gestão",
      description: "Gestão de Ordens de produção",
      code: "production:order:view",
      parent_code: "production:order",
    },
    {
      id: nanoid(),
      name: "Kanban",
      description: "Kanban de Ordens de produção",
      code: "production:order:kanban",
      parent_code: "production:order",
    },
    {
      id: nanoid(),
      name: "Processos",
      description: "Processos de Ordens de produção",
      code: "production:order:process",
      parent_code: "production:order",
    },
    // Filhos de Produção - Ferramentas
    {
      id: nanoid(),
      name: "Ferramentas",
      description: "Ferramentas",
      code: "production:tool",
      parent_code: "production",
    },
    {
      id: nanoid(),
      name: "Configurador",
      description: "Configurador",
      code: "production:tool:configurator",
      parent_code: "production:tool",
    },
    {
      id: nanoid(),
      name: "Auto test",
      description: "Auto test",
      code: "production:tool:auto-test",
      parent_code: "production:tool",
    },
    {
      id: nanoid(),
      name: "Identificador",
      description: "Identificador",
      code: "production:tool:identifier",
      parent_code: "production:tool",
    },
    // Filhos de Produção - Logs
    {
      id: nanoid(),
      name: "Logs",
      description: "Logs",
      code: "production:logs",
      parent_code: "production",
    },
    {
      id: nanoid(),
      name: "Configurador",
      description: "Logs do Configurador",
      code: "production:logs:configurator",
      parent_code: "production:logs",
    },
    {
      id: nanoid(),
      name: "Auto test",
      description: "Logs do Auto test",
      code: "production:logs:auto-test",
      parent_code: "production:logs",
    },
    {
      id: nanoid(),
      name: "Identificador",
      description: "Logs do Identificador",
      code: "production:logs:identifier",
      parent_code: "production:logs",
    },

    // Comercial (nível superior)
    {
      id: nanoid(),
      name: "Comercial",
      description: "Comercial",
      code: "comercial",
    },
    // Filhos de Comercial
    {
      id: nanoid(),
      name: "Clientes",
      description: "Clientes",
      code: "comercial:client",
      parent_code: "comercial",
    },
    {
      id: nanoid(),
      name: "Propostas",
      description: "Propostas",
      code: "comercial:proposal",
      parent_code: "comercial",
    },
  ];

  await controlRepository.createMany(controls);

  // Monta a árvore de controles do módulo admin
  const controlTree = buildControlTree(controls);
  return Response.json(controlTree);
}
