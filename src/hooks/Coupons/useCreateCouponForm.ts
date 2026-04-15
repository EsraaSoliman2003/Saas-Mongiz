"use client";
import { createCoupon, CreateCouponPayload } from "@/rtk/slices/coupon/couponSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useCreateCouponForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.coupon);

  // Zod schema for form validation
  const schema = z.object({
    code: z.string().min(1, t("This field is required")),
    discount: z
      .number()
      .min(1, t("Discount must be at least 1"))
      .max(100, t("Discount must be at most 100")),
  });

  // Initialize react-hook-form with Zod resolver
  const form = useForm<CreateCouponPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      discount: 0,
    },
  });

  // Extract form helpers
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // Bind inputs to the form
  const fields = {
    code: register("code"),
    discount: register("discount", { valueAsNumber: true }),
  };

  // Submit handler
  const submit = handleSubmit(async (data) => {
    try {
      await dispatch(createCoupon(data));
      toast.success(t("Coupon created successfully"));
      router.push("/admin/coupon");
    } catch (error) {
      toast.error(t("Failed to create coupon"));
    }
  });

  return {
    fields,
    errors,
    submit,
    loading,
    t,
  };
};
