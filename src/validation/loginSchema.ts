import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("email_login_v") }),
    password: z.string().min(1, { message: t("password_login_v") }),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof getLoginSchema>>;
