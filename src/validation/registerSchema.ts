// validation/registerSchema.ts

import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const getRegisterSchema = (
  t: (key: string) => string,
  isSeller: boolean,
) => {
  return z
    .object({
      fullName: z.string().min(5, { message: t("full_name_v") }),
      email: z.string().email({ message: t("email_v") }),
      phone: z
        .string()
        .min(1, { message: t("phone_required_v") })
        .refine((val) => isValidPhoneNumber(val), {
          message: t("phone_v"),
        }),
      password: z
        .string()
        .min(8, { message: t("password_v") })
        .regex(/[a-z]/, { message: t("password_lower_v") })
        .regex(/[A-Z]/, { message: t("password_upper_v") })
        .regex(/[^a-zA-Z0-9]/, { message: t("password_non_alnum_v") }),
      confirmPassword: z.string().min(1, { message: t("confirm_password_v") }),

      // Seller optional fields
      imageUrl: z.any().optional(),
      address: z.string().optional(),
      commercialRegisterText: z.string().optional(),
      taxCardText: z.string().optional(),
      commercialRegisterImage: z.any().optional(),
      taxCardImage: z.any().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("PasswordsMustMatch"),
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      if (!isSeller) return;

      // Profile Image
      if (!data.imageUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("ProfileImageRequired"),
          path: ["imageUrl"],
        });
      } else {
        if (
          data.imageUrl.size > MAX_FILE_SIZE ||
          !ACCEPTED_IMAGE_TYPES.includes(data.imageUrl.type)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("InvalidImage"),
            path: ["imageUrl"],
          });
        }
      }

      // Address
      if (!data.address || data.address.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("AddressRequired"),
          path: ["address"],
        });
      }

      // Commercial Text
      if (!data.commercialRegisterText) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("CommercialTextRequired"),
          path: ["commercialRegisterText"],
        });
      }

      // Tax Text
      if (!data.taxCardText) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("TaxTextRequired"),
          path: ["taxCardText"],
        });
      }

      // Commercial Image
      if (!data.commercialRegisterImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("CommercialImageRequired"),
          path: ["commercialRegisterImage"],
        });
      } else {
        if (
          data.commercialRegisterImage.size > MAX_FILE_SIZE ||
          !ACCEPTED_IMAGE_TYPES.includes(data.commercialRegisterImage.type)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("InvalidImage"),
            path: ["commercialRegisterImage"],
          });
        }
      }

      // Tax Image
      if (!data.taxCardImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("TaxImageRequired"),
          path: ["taxCardImage"],
        });
      } else {
        if (
          data.taxCardImage.size > MAX_FILE_SIZE ||
          !ACCEPTED_IMAGE_TYPES.includes(data.taxCardImage.type)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("InvalidImage"),
            path: ["taxCardImage"],
          });
        }
      }
    });
};

export type RegisterSchemaType = z.infer<ReturnType<typeof getRegisterSchema>>;
