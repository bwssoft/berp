import { findOneProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { useAuth } from "@/app/lib/@frontend/context";

export function useViewOneUserForm() {
  const { changeProfile, profile } = useAuth();

  const handleChangeProfile = async (id: string) => {
    const profile = await findOneProfile({ id });
    profile && changeProfile(profile);
  };

  return { handleChangeProfile, profile };
}
