import { render } from "@react-email/components";
import WelcomeTemplate from "../@backend/infra/template/welcometemplate";

interface WelcomeTemplateProps {
  name: string;
  username: string;
  password: string;
}

export async function formatWelcomeEmail(props: WelcomeTemplateProps): Promise<string> {
  const template = await render(
    WelcomeTemplate({
      nome: props.name,
      usuario: props.username,
      senhaProvisoria: props.password
    })
  )

  return template

}
