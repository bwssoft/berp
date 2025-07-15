import { singleton } from "@/app/lib/util/singleton";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userObjectRepository, userRepository } from "@/app/lib/@backend/infra";

class GetAvatarUrlUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async execute(userId: string): Promise<string> {
    try {
      const user = await this.repository.findOne({ id: userId });

      if (!user || !user.image?.key) {
        return "/avatar.webp";
      }

      return await userObjectRepository.generateSignedUrl(user.image.key);
    } catch (error) {
      console.error("Failed to generate avatar URL:", error);
      return "/avatar.webp";
    }
  }
}

export const getAvatarUrlUserUsecase = singleton(GetAvatarUrlUserUsecase);
