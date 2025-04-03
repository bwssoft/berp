import { render } from "@react-email/components";
import ResetPasswordTemplate from "../@backend/infra/template/resetpasswordtemplete";


interface ResetPasswordTemplateProps {
  name: string;
  username: string;
  password: string;
}

export async function formatResetPasswordEmail(props: ResetPasswordTemplateProps): Promise<string> {
  const html = await render(
    ResetPasswordTemplate({
      nome: props.name,
      usuario: props.username,
      senhaProvisoria: props.password,
    })
  );

  return html;
}
