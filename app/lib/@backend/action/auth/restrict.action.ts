"use server";

import { restrictFeatureByProfileUsecase } from "../../usecase/auth/restrict-feature-by-profile.usecase";

// import { restrictFeatureByProfileUsecase } from "../../usecase";
// o import acima está causando o erro abaixo. é o erro de quando tem mais de uma função exportada com o mesmo nome
// ./app/lib/@backend/action/index.ts
// The requested module './auth' contains conflicting star exports for the name '$$ACTION_0' with the previous requested module './admin'

// Import trace for requested module:
// ./app/lib/@backend/action/index.ts
// ./app/admin/profile/page.tsx

export const restrictFeatureByProfile = async (code: string) => {
  return await restrictFeatureByProfileUsecase.execute({ code });
};
