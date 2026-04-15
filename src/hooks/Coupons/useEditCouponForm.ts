"use client";
import {
  editCoupon,
  EditCouponPayload,
  fetchCouponData,
} from "@/rtk/slices/coupon/couponSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export const useEditCouponForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, currentCoupon } = useAppSelector((state) => state.coupon);

  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    dispatch(fetchCouponData(Number(id)));
  }, [dispatch, id]);

  // Zod schema for form validation
  const schema = z.object({
    code: z.string().min(1, t("This field is required")),
    discount: z
      .number()
      .min(1, t("Discount must be at least 1"))
      .max(100, t("Discount must be at most 100")),
  });

  // Initialize react-hook-form with Zod resolver
  type EditCouponForm = Pick<EditCouponPayload, "code" | "discount">;
  const form = useForm<EditCouponForm>({
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
    reset,
  } = form;

  useEffect(() => {
    if (currentCoupon) {
      reset({
        code: currentCoupon.code,
        discount: currentCoupon.discount,
      });
    }
  }, [currentCoupon, reset]);

  // Bind inputs to the form
  const fields = {
    code: register("code"),
    discount: register("discount", { valueAsNumber: true }),
  };

  // Submit handler
  const submit = handleSubmit(async (data) => {
    if (!currentCoupon) return;
    const payload: EditCouponPayload = {
      id: currentCoupon.id,
      ...data,
    };
    try {
      await dispatch(editCoupon(payload));
      toast.success(t("Coupon updated successfully"));
      router.push("/admin/coupon");
    } catch (error) {
      toast.error(t("Failed to update coupon"));
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
