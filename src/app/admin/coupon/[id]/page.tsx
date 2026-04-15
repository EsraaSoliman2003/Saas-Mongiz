"use client"
import { useEditCouponForm } from "@/hooks/Coupons/useEditCouponForm";
import FormInput from "../../_components/FormInput";
import FormSubmitButton from "../../_components/FormSubmitButton";
import LoadingSpinner from "../../_components/LoadingSpinner";
export default function page() {
  const { fields, errors, submit, loading, t } = useEditCouponForm();

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="p-2">
      <div className="w-full">
        <div className="rounded-xl p-5 lg:p-8 w-full">
          <form onSubmit={submit}>
            <FormInput
              label={t("Code")}
              required
              {...fields.code}
              error={errors.code?.message}
            />
            <FormInput
              label={t("Discount")}
              required
              {...fields.discount}
              error={errors.discount?.message}
            />
            <div className="flex justify-end">
              <FormSubmitButton
                text={t("Send")}
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>

    </section>
  )
}
