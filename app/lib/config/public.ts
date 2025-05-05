import { z } from "zod";

const EnviromentPublicSchema = z.object({
    BCUBE_VERSION: z.string().optional(),
});

export const publicConfig = EnviromentPublicSchema.parse({
    BCUBE_VERSION:
        process.env.NEXT_PUBLIC_BCUBE_VERSION || "versão não definida",
});
