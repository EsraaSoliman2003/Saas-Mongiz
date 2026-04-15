"use client";

import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { registerUser } from "@/rtk/slices/auth/authSlice";
import { registerSeller } from "@/rtk/slices/seller/sellerSlice";
import {
  getRegisterSchema,
  RegisterSchemaType,
} from "@/validation/registerSchema";
import { useAuth } from "@/context/AuthContext";
import { setCookie } from "cookies-next";
import { setPhoneData } from "@/rtk/slices/ui/phoneSlice";
import { useState } from "react";

interface UseRegisterFormReturn extends Pick<
  UseFormReturn<RegisterSchemaType>,
  "register" | "handleSubmit" | "control" | "formState" | "setValue" | "trigger" // ← added trigger
> {
  onSubmit: SubmitHandler<RegisterSchemaType>;
  loading: boolean;
  t: (key: string) => string;
  openRecoveryModal: boolean;
  setOpenRecoveryModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useRegisterForm = (
  isSeller: boolean = false,
  setEmailForRecovery?: (email: string) => void,
): UseRegisterFormReturn => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setToken } = useAuth();
  const [openRecoveryModal, setOpenRecoveryModal] = useState(false);

  const authLoading = useAppSelector((state) => state.auth.loading);
  const sellerLoading = useAppSelector((state) => state.seller.loading);

  const loading = authLoading || sellerLoading;

  const registerSchema = getRegisterSchema(t, isSeller);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    const parsedPhone = parsePhoneNumberFromString(data.phone);
    if (!parsedPhone) {
      toast.error(t("InvalidPhone"));
      return;
    }

    dispatch(
      setPhoneData({
        phoneNumber: parsedPhone.nationalNumber,
        countryCode: parsedPhone.countryCallingCode,
      }),
    );

    const formData = new FormData();
    formData.append("FullName", data.fullName);
    formData.append("Email", data.email);
    formData.append("Password", data.password);
    formData.append("PhoneNumber", parsedPhone.nationalNumber);
    formData.append("CountryCode", `+${parsedPhone.countryCallingCode}`);

    if (isSeller) {
      formData.delete("PhoneNumber");
      formData.append("Phone", parsedPhone.nationalNumber);
      formData.append("ImageUrl", data.imageUrl);

      formData.append("Address", data.address!);
      formData.append("CommercialRegisterText", data.commercialRegisterText!);
      formData.append("TaxCardText", data.taxCardText!);

      formData.append("CommercialRegisterImage", data.commercialRegisterImage);
      formData.append("TaxCardImage", data.taxCardImage);
    }

    try {
      const resultAction = isSeller
        ? await dispatch(registerSeller(formData))
        : await dispatch(registerUser(formData));
      console.log(resultAction?.payload);

      // 👇 THIS is the correct safe extraction
      const data: any =
        (resultAction as any)?.payload || (resultAction as any)?.error?.payload;

      // 👇 NOW check deleted correctly
      const isDeleted = data?.extra?.isDeleted;

      if (isDeleted) {
        setEmailForRecovery?.(data?.email ?? (formData.get("Email") as string));

        setOpenRecoveryModal(true);
        return;
      }

      // reject handling
      if (resultAction.type.endsWith("rejected")) {
        toast.error(data?.title || t("UnexpectedError"));
        return;
      }

      // Only auto-login for normal user
      if (!isSeller && registerUser.fulfilled.match(resultAction)) {
        const { user, token, roles } = resultAction.payload;

        setCookie("token", token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setCookie("user", JSON.stringify(user), {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setCookie("roles", JSON.stringify(roles), {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setToken(token);

        toast.success(t("AccountCreated"));

        if (roles.includes("ADMIN")) {
          router.replace("/admin");
        } else if (roles.includes("SELLER")) {
          router.replace("/seller");
        } else {
          router.replace("/");
        }
      } else {
        toast.success(t("SellerRegisteredWaitingApproval"));
        router.replace("/");
      }
    } catch {
      toast.error(t("UnexpectedError"));
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    control: form.control,
    formState: form.formState,
    setValue: form.setValue,
    trigger: form.trigger,
    onSubmit,
    loading,
    t,
    openRecoveryModal,
    setOpenRecoveryModal,
  };
};
