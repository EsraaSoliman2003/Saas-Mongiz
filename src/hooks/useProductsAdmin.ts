import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/rtk/hooks";
import { useSearchParams } from "next/navigation";
import { fetchProductsByCategory } from "@/rtk/slices/products/productsPaginationSliceAdmin";

export function useProducts() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");
  const pageParam = searchParams.get("page");
  const brandParam = searchParams.get("brand");
  const priceParam = searchParams.get("price");
  const ratingParam = searchParams.get("rating");
  const queryParam = searchParams.get("query");

  const currentPageNum = pageParam ? Number(pageParam) : 1;

  const {
    byCategoryItems,
    byCategoryCurrentPage,
    byCategoryPageCount,
    byCategoryLoading,
  } = useAppSelector((s) => s.productsCrudAdmin);

  const { data: categories } = useAppSelector((s) => s.categories);

  const products = byCategoryItems;

  const { category, subCategory } = useMemo(() => {
    let categoryName = null;
    let subCategoryName = null;

    if (categoryParam && categories) {
      const cat = categories.find((c: any) => c.id === +categoryParam);
      categoryName = cat?.name ?? null;
    }

    return { category: categoryName, subCategory: subCategoryName };
  }, [categoryParam, categories]);

  const filterValues = useMemo(() => {
    let minPrice = 0;
    let maxPrice = 1000000;
    let minRate = 0;
    let maxRate = 5;

    if (priceParam) {
      const priceRanges: Record<string, { min: number; max: number }> = {
        "0 - 500": { min: 0, max: 500 },
        "500 - 1000": { min: 500, max: 1000 },
        "1000+": { min: 1000, max: 1000000 },
      };
      const range = priceRanges[priceParam];
      if (range) {
        minPrice = range.min;
        maxPrice = range.max;
      }
    }

    if (ratingParam) {
      const ratingRanges: Record<string, { min: number; max: number }> = {
        "0-1": { min: 0, max: 1 },
        "1-2": { min: 1, max: 2 },
        "2-3": { min: 2, max: 3 },
        "3-4": { min: 3, max: 4 },
        "4-5": { min: 4, max: 5 },
      };
      const range = ratingRanges[ratingParam];
      if (range) {
        minRate = range.min;
        maxRate = range.max;
      }
    }

    return {
      minPrice,
      maxPrice,
      minRate,
      maxRate,
      brandId: brandParam ? Number(brandParam) : undefined,
      subCategoryId: subCategoryParam ? Number(subCategoryParam) : undefined,
    };
  }, [priceParam, ratingParam, brandParam, subCategoryParam]);

  useEffect(() => {
    const categoryId = categoryParam ? Number(categoryParam) : 0;

    dispatch(
      fetchProductsByCategory({
        categoryId: categoryId,
        subCategoryId: filterValues.subCategoryId,
        brandId: filterValues.brandId,
        minPrice: filterValues.minPrice,
        maxPrice: filterValues.maxPrice,
        minRate: filterValues.minRate,
        maxRate: filterValues.maxRate,
        page: currentPageNum,
        pageSize: 8,
        query: queryParam || undefined,
      }),
    );
  }, [
    categoryParam,
    subCategoryParam,
    currentPageNum,
    filterValues,
    queryParam,
    dispatch,
  ]);

  return {
    category,
    subCategory,
    products,
    byCategoryCurrentPage,
    byCategoryPageCount,
    currentPageNum,
    byCategoryLoading,
  };
}
