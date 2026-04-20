import CategoriesFilter from "./CategoriesFilter";
import BrandsFilter from "./BrandsFilter";
import ColorsFilter from "./ColorsFilter";
import PriceFilter from "./PriceFilter";

export default function FiltersDesktop() {
  return (
    <div className="hidden md:block flex-1 space-y-10">
      <div className="space-y-1">
        <CategoriesFilter />
      </div>
      <div className="space-y-1">
        <BrandsFilter />
      </div>
      <div className="space-y-1">
        <PriceFilter />
      </div>
    </div>
  )
}
