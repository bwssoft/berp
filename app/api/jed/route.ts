import { userRepository } from "@/app/lib/@backend/infra";
import { hashSync } from "bcrypt";

export async function GET(request: Request) {
  let { docs: users } = await userRepository.findMany({
    username: { $regex: "sf_mp", $options: "i" },
  });
  await Promise.all(
    users.map((item) => {
      const user = {
        ...item,
        password: hashSync(capitalizeFirstLetter(item.username) + 2025, 10),
        temporary_password: false,
      };
      userRepository.updateOne({ id: item.id }, { $set: user });
    })
  );
  return Response.json(users);
}

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
