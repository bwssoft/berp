
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

interface AuthResponse {
  success: boolean;
  error?: string;
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<AuthResponse> {
  console.log({formData})
  try {
    await signIn('credentials', {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    redirect: true,});
    return { success: true };
  } catch (error) {

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Credenciais inválidas.',
          };
        default:
          return {
            success: false,
            error: 'Erro durante o login.',
          };
      }
    }

    return {
      success: false,
      error: 'Erro inesperado.',
    };
  }
}