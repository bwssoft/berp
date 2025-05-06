import { restrictFeatureByProfileUsecase } from "../../usecase";

export const restrictFeatureByProfile = async (code: string) => {
  return await restrictFeatureByProfileUsecase.execute({ code });
};
