import { render } from "@react-email/components";
import TemplateEmail  from "../@backend/infra/template/template-email";

interface WelcomeTemplateProps {
  name: string;
  username: string;
  password: string;
}

export async function formatWelcomeEmail(props: WelcomeTemplateProps): Promise<string> {
  const template = await render(
    TemplateEmail({
      nome: props.name,
      usuario: props.username,
      senhaProvisoria: props.password
    })
  )

  return template

}
