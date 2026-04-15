import SectionHeader from "../_components/SectionHeader";
import ReviewStats from "./_components/ReviewStats";
import ReviewFilterBar from "./_components/ReviewFilterBar";
import ReviewsList from "./_components/ReviewsList";
import { useTranslations } from "next-intl";
import ProductGridWithFilters from "./_components/ProductGrid";

export default function ReviewsPage() {
  const t = useTranslations();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <SectionHeader
        title={t("reviewsTitle")}
        subtitle={t("reviewsSubtitle")}
      />

      {/* <ReviewStats /> */}
      {/* <ReviewFilterBar /> */}
      {/* <ReviewsList /> */}
      <ProductGridWithFilters />

    </div>
  );
}
