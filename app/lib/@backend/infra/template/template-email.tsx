import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface WelcomeTemplateProps {
  nome: string;
  usuario: string;
  senhaProvisoria: string;
}

export default function WelcomeTemplate({
  nome,
  usuario,
  senhaProvisoria,
}: WelcomeTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Seja bem-vindo ao sistema BCube! Aqui estão suas credenciais.</Preview>
      <Tailwind>
        <Body className="bg-[#f4f4f5] text-[#212121] font-sans mb-10">
          <Container className="bg-white shadow-md rounded-lg overflow-hidden max-w-xl mx-auto my-8">
            {/* Header com logo */}
            <Section className="bg-white py-5 flex items-center justify-center">
              <Img
                src="https://firebasestorage.googleapis.com/v0/b/hybridserver-48c11.appspot.com/o/bcube-logo.svg?alt=media&token=832f3498-a386-4d12-9f59-7b8188733593"
                width="60"
                height="60"
                alt="Logo BCube"
              />
            </Section>

            <Section className="px-10 pt-8 pb-6">
              <Heading className="text-[22px] font-bold text-[#1f2937] mb-4">
                BCube – Primeiro acesso
              </Heading>

              <Text className="text-[15px] text-[#333] leading-relaxed mb-3">
                Prezado(a) <strong>{nome}</strong>,
              </Text>

              <Text className="text-[15px] text-[#333] leading-relaxed mb-4">
                Seja bem-vindo ao sistema <strong>BCube</strong>! Sua conta foi criada com sucesso.
              </Text>

              <Text className="text-[15px] text-[#333] leading-relaxed mb-4">
                Uma senha provisória foi gerada para seu primeiro acesso. Utilize os dados abaixo:
              </Text>

              <Section className="bg-[#f9fafb] border border-gray-200 rounded-md px-6 text-center py-4 my-6">
                <Text className="text-sm text-gray-600 mb-1">Usuário:</Text>
                <Text className="text-[18px] font-semibold text-black mb-3">{usuario}</Text>

                <Text className="text-sm text-gray-600 mb-1">Senha provisória:</Text>
                <Text className="text-[18px] font-semibold text-black">{senhaProvisoria}</Text>
              </Section>

              <Text className="text-[15px] text-[#333] leading-relaxed mb-4">
                Por favor, acesse a tela de{' '}
                <Link href="https://berp-delta.vercel.app/login" target="_blank" className="text-blue-600 underline">
                  login
                </Link>{' '}
                do sistema e informe seu usuário e senha provisória. Na sequência você será direcionado para a tela de
                alteração de senha, onde poderá cadastrar uma senha definitiva.
              </Text>
            </Section>

            <Hr className="border-t border-gray-200 my-6" />

            {/* Rodapé */}
            <Text className="text-[12px] text-[#999] text-center px-6 mt-2 pb-8">
              © {new Date().getFullYear()} BCube. Todos os direitos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
