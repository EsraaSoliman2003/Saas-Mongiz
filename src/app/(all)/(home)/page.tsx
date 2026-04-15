import CategoriesSection from "@/components/categoriesSection/CategoriesSection";
import PromoBannersSection from "@/components/promoBannersSection/PromoBannersSection";
import WidePromoSection from "@/components/widePromoSection/WidePromoSection";
import FeaturesSection from "@/components/featuresSection/FeaturesSection";
import HomeHeroSection from "./_components/HomeHeroSection";
import FilterTabsHome1 from "@/components/filterTabs/FilterTabsHome1";
import FilterTabsHome2 from "@/components/filterTabs/FilterTabsHome2";
import FloatingHelpButton from "@/components/floatingHelpButton/FloatingHelpButton";

const HomePage = () => {
  return (
    <section>
      <HomeHeroSection />
      <CategoriesSection />
      <PromoBannersSection />
      <FilterTabsHome1 />
      <WidePromoSection />
      <FilterTabsHome2 />
      <FeaturesSection />
      <FloatingHelpButton />
    </section>
  );
};

export default HomePage;
