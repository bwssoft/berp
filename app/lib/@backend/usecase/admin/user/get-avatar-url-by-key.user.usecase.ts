import { singleton } from "@/app/lib/util/singleton";
import { IUserRepository } from "@/backend/domain/admin/repository/user.repository";
import { userObjectRepository, userRepository } from "@/backend/infra";

class GetAvatarUrlByKeyUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async execute(userId: string, key: string): Promise<string> {
    try {
      const user = await this.repository.findOne({ id: userId });

      if (!user || !key) {
        return "/avatar.webp";
      }

      return await userObjectRepository.generateSignedUrl(key);
    } catch (error) {
      console.error("Failed to generate avatar URL:", error);
      return "/avatar.webp";
    }
  }
}

export const getAvatarUrlByKeyUserUsecase = singleton(GetAvatarUrlByKeyUserUsecase);

