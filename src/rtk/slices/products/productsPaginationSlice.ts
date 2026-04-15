import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";
import { getCookie } from "cookies-next";

/* ===========================
   Types
=========================== */

export type additionalDataItem = {
  id: number;
  type: number;
  key: string;
  values: string[];
};

export type ProductApi = {
  brand: { id: string; name: string };
  types: { id: number; type: string }[];
  id: number;
  categoryId: number;
  name: string;
  description: string;
  mainPrice: number;
  price: number;
  discount: number;
  quantity: number;
  reviewCount: number;
  rate: number;
  images: string[];
  mainImage?: string;
  subCategoryId: number;
  limitProducts: number;
  limitStock: number;
  categoryName: string;
  subCategoryName: string;
  keywords: string[];
  additionalData: additionalDataItem[];
  variants?: Variant[];
};

export interface ProductsPaginationResponse {
  items: ProductApi[];
  currentPage: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type AdditionalDataItem = {
  type: number;
  key: string;
  values: string[];
};

export type Variant = {
  attributes: Record<string, string>; // key: color, size, etc.
  quantity: number;
};

export type CreateProductPayload = {
  name: string;
  description: string;
  mainPrice: number;
  discount?: number;
  quantity?: number;
  categoryId: number;
  subCategoryId?: number | null;
  brandId?: number | null;

  limitProducts?: number;
  limitStock?: number;

  mainImage: File;
  images?: File[];
  types?: { typeEN: string; typeAR: string }[];
  keywords?: string[];
  additionalData?: AdditionalDataItem[];
  variants?: Variant[];
};

export type UpdateProductPayload = {
  id: number;

  name: string;
  description: string;

  mainPrice: number;
  discount?: number;
  quantity?: number;

  categoryId: number;
  subCategoryId?: number;
  brandId: number;

  limitProducts?: number;
  limitStock?: number;

  mainImage?: File | null;
  images?: File[];

  // 👇 الجديد
  additionalData?: AdditionalDataItem[];
  existsAdditionalData?: additionalDataItem[];

  existsImages?: string[];
  existsTypes?: number[];

  variants?: Variant[];
  keywords?: string[];

  types?: { typeEN: string; typeAR: string }[];
};

interface ProductsPaginationState {
  loading: boolean;
  items: ProductApi[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  createLoading: boolean;
  createError: string | null;

  error: string | null;

  selectedProduct?: ProductApi | null;
  selectedLoading: boolean;

  // ===== ByCategory =====
  byCategoryLoading: boolean;
  byCategoryError: string | null;

  byCategoryItems: ProductApi[];
  byCategoryCurrentPage: number;
  byCategoryPageSize: number;
  byCategoryTotalItems: number;
  byCategoryPageCount: number;
  byCategoryHasNextPage: boolean;
  byCategoryHasPreviousPage: boolean;

  byCategoryCategoryId: number | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

export type ProductsByCategoryParams = {
  categoryId: number;
  subCategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brandId?: number;
  minRate?: number;
  maxRate?: number;
  page?: number;
  pageSize?: number;
  query?: string;
};

export interface ProductsByCategoryResponse {
  items: ProductApi[];
  currentPage: number;
  nextPage: number;
  previousPage: number;

  firstPageLink?: string;
  lastPageLink?: string;
  nextPageLink?: string;
  previousPageLink?: string;

  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
}

/* ===========================
   Initial State
=========================== */

const initialState: ProductsPaginationState = {
  loading: false,
  items: [],

  selectedProduct: null, // ⭐
  selectedLoading: false, // ⭐

  currentPage: 1,
  pageSize: 8,
  totalItems: 0,
  pageCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,

  createLoading: false,
  createError: null,

  error: null,

  byCategoryLoading: false,
  byCategoryError: null,

  byCategoryItems: [],
  byCategoryCurrentPage: 1,
  byCategoryPageSize: 8,
  byCategoryTotalItems: 0,
  byCategoryPageCount: 0,
  byCategoryHasNextPage: false,
  byCategoryHasPreviousPage: false,

  byCategoryCategoryId: null,

  deleteLoading: false,
  deleteError: null,
};
export type FullProductApi = {
  id: number;
  categoryId: number;
  subCategoryId?: number;

  nameEN: string;
  descriptionEN: string;
  nameAR: string;
  descriptionAR: string;

  mainPrice: number;
  price: number;
  discount: number;
  quantity: number;

  soldCount: number;
  reviewCount: number;
  rate: number;
  averageRate: number;

  isFavourite: boolean;
  mainImage: string;
  images: string[];

  types: { id: number; typeEN: string; typeAR: string }[];

  brand: { id: string; nameAr: string; nameEn: string };
  categoryName?: string;
  subCategoryName?: string;
};

/* ===========================
   Thunks
=========================== */

export const fetchProductsPaginated = createAsyncThunk<
  ProductsPaginationResponse,
  { page?: number; pageSize?: number; query?: string },
  { rejectValue: string }
>(
  "products/fetchPaginated",
  async ({ page = 1, pageSize = 8, query }, thunkAPI) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (query) params.append("query", query);

      const res = await axios.get<ProductsPaginationResponse>(
        `/Product?${params.toString()}`,
      );

      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل تحميل المنتجات",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

export const createProduct = createAsyncThunk<
  ProductApi,
  CreateProductPayload,
  { rejectValue: string }
>("products/create", async (data, thunkAPI) => {
  try {
    const formData = new FormData();

    // ===== required =====
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("MainPrice", String(data.mainPrice));
    formData.append("CategoryId", String(data.categoryId));
    formData.append("MainImage", data.mainImage);

    // ===== optional =====
    if (data.brandId !== undefined && data.brandId != 0 && data.brandId !== null)
      formData.append("BrandId", String(data.brandId));

    if (data.subCategoryId !== undefined && data.subCategoryId != 0 && data.subCategoryId !== null)
      formData.append("SubCategoryId", String(data.subCategoryId));

    if (data.discount !== undefined)
      formData.append("Discount", String(data.discount));

    if (data.quantity !== undefined)
      formData.append("Quantity", String(data.quantity));

    if (data.limitProducts !== undefined)
      formData.append("LimitProducts", String(data.limitProducts));

    if (data.limitStock !== undefined)
      formData.append("LimitStock", String(data.limitStock));

    // ===== images =====
    data.images?.forEach((img) => {
      formData.append("Images", img);
    });

    // ===== types =====
    data.types?.forEach((type) => {
      formData.append("Types", JSON.stringify(type));
    });

    // ===== keywords =====
    data.keywords?.forEach((keyword) => {
      formData.append("Keywords", keyword);
    });

    // ===== additionalData =====
    data.additionalData?.forEach((item, index) => {
      formData.append(`AdditionalData[${index}].type`, String(item.type));
      formData.append(`AdditionalData[${index}].key`, item.key);
      item.values.forEach((val, vIndex) => {
        formData.append(`AdditionalData[${index}].values[${vIndex}]`, val);
      });
    });

    // ===== variants =====
    data.variants?.forEach((variant, vIndex) => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        formData.append(
          `Variants[${vIndex}].attributes[${key}]`,
          String(value),
        );
      });
      formData.append(`Variants[${vIndex}].quantity`, String(variant.quantity));
    });

    const res = await axios.post<ProductApi>("/Product/WithRole", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل إنشاء المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const updateProduct = createAsyncThunk<
  ProductApi,
  UpdateProductPayload,
  { rejectValue: string }
>("products/update", async (data, thunkAPI) => {
  try {
    const formData = new FormData();

    // ===== required =====
    formData.append("Id", String(data.id));
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("MainPrice", String(data.mainPrice));
    formData.append("CategoryId", String(data.categoryId));

    if (data.brandId !== undefined && data.brandId != 0 && data.brandId !== null)
      formData.append("BrandId", String(data.brandId));

    if (data.subCategoryId !== undefined && data.subCategoryId != 0 && data.subCategoryId !== null) {
      formData.append("SubCategoryId", String(data.subCategoryId));
    }

    // ===== optional =====
    if (data.discount !== undefined) {
      formData.append("Discount", String(data.discount));
    }

    if (data.quantity !== undefined) {
      formData.append("Quantity", String(data.quantity));
    }

    if (data.limitProducts !== undefined) {
      formData.append("LimitProducts", String(data.limitProducts));
    }

    if (data.limitStock !== undefined) {
      formData.append("LimitStock", String(data.limitStock));
    }

    if (data.mainImage) {
      formData.append("MainImage", data.mainImage);
    }

    // ===== keywords =====
    data.keywords?.forEach((keyword) => {
      formData.append("Keywords", keyword);
    });

    // ===== existing images =====
    data.existsImages?.forEach((img) => {
      formData.append("ExistsImages", img);
    });

    // ===== existing types =====
    data.existsTypes?.forEach((id) => {
      formData.append("ExistsTypes", String(id));
    });

    // ===== new images =====
    data.images?.forEach((img) => {
      formData.append("Images", img);
    });

    // ===== new types =====
    data.types?.forEach((type, index) => {
      formData.append(`Types[${index}].typeEN`, type.typeEN);
      formData.append(`Types[${index}].typeAR`, type.typeAR);
    });

    // ===== existing additional data =====
    data.existsAdditionalData?.forEach((item) => {
      formData.append("ExistsAdditionalDataIds", String(item.id));
    });

    // ===== new additional data =====
    data.additionalData?.forEach((item, index) => {
      formData.append(`AdditionalData[${index}].type`, String(item.type));
      formData.append(`AdditionalData[${index}].key`, item.key);

      item.values.forEach((val, vIndex) => {
        formData.append(`AdditionalData[${index}].values[${vIndex}]`, val);
      });
    });

    // ===== variants =====
    data.variants?.forEach((variant, vIndex) => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        formData.append(
          `Variants[${vIndex}].attributes[${key}]`,
          String(value),
        );
      });
      formData.append(`Variants[${vIndex}].quantity`, String(variant.quantity));
    });

    const res = await axios.put<ProductApi>(
      `/Product/WithRole/${data.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تعديل المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const fetchProductById = createAsyncThunk<
  ProductApi,
  number,
  { rejectValue: string }
>("products/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<ProductApi>(`/Product/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  ProductsByCategoryResponse,
  ProductsByCategoryParams,
  { rejectValue: string }
>("products/fetchByCategory", async (args, thunkAPI) => {
  const user = JSON.parse(getCookie("user") as string | undefined as string);
  try {
    const {
      categoryId = 0,
      subCategoryId = 0,
      minPrice = 0,
      maxPrice = 1000000,
      brandId = 0,
      minRate = 0,
      maxRate = 5,
      page = 1,
      pageSize = 8,
      query,
    } = args;

    const params = new URLSearchParams({
      subCategoryId: String(subCategoryId),
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      brandId: String(brandId),
      minRate: String(minRate),
      maxRate: String(maxRate),
      page: String(page),
      pageSize: String(pageSize),
    });

    if (query) params.append("query", query);

    const res = await axios.get<ProductsByCategoryResponse>(
      `/Product/ByCategory/${categoryId}?${params.toString()}`,
    );

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل منتجات التصنيف",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Product/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل حذف المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const fetchProductFullById = createAsyncThunk<
  FullProductApi,
  { id: number; userId?: number },
  { rejectValue: string }
>("products/fetchFullById", async ({ id, userId }, thunkAPI) => {
  try {
    const params = new URLSearchParams();
    if (userId !== undefined) params.append("userId", String(userId));

    const res = await axios.get<FullProductApi>(
      `/Product/${id}/full${params.toString() ? `?${params.toString()}` : ""}`,
    );

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل تفاصيل المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const productsPaginationSlice = createSlice({
  name: "productsPagination",
  initialState,
  reducers: {
    clearProductsPagination: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.totalItems = 0;
      state.pageCount = 0;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedLoading = false;
      state.error = null;
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.pageCount = action.payload.pageCount;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
      })
      .addCase(fetchProductsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })
      .addCase(updateProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.createLoading = false;

        const index = state.items.findIndex((p) => p.id === action.payload.id);

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })
      // // ================= get product by id =================
      .addCase(fetchProductById.pending, (state) => {
        state.selectedLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.error = action.payload || "حدث خطأ";
      })
      // ================= products by category =================
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        state.byCategoryLoading = true;
        state.byCategoryError = null;

        const newCategoryId = action.meta.arg.categoryId;
        if (state.byCategoryCategoryId !== newCategoryId) {
          state.byCategoryCategoryId = newCategoryId;
          state.byCategoryItems = [];
          state.byCategoryCurrentPage = 1;
          state.byCategoryTotalItems = 0;
          state.byCategoryPageCount = 0;
          state.byCategoryHasNextPage = false;
          state.byCategoryHasPreviousPage = false;
        }
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.byCategoryLoading = false;

        state.byCategoryItems = action.payload.items ?? [];
        state.byCategoryCurrentPage = action.payload.currentPage ?? 1;
        state.byCategoryTotalItems = action.payload.totalItems ?? 0;
        state.byCategoryPageCount = action.payload.pageCount ?? 0;
        state.byCategoryHasNextPage = action.payload.hasNextPage ?? false;
        state.byCategoryHasPreviousPage =
          action.payload.hasPreviousPage ?? false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.byCategoryLoading = false;
        state.byCategoryError = action.payload || "حدث خطأ";
      })
      // ================= delete product =================
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.items = state.items.filter((p) => p.id !== deletedId);
        state.byCategoryItems = state.byCategoryItems.filter(
          (p) => p.id !== deletedId,
        );

        if (state.selectedProduct?.id === deletedId) {
          state.selectedProduct = null;
          state.selectedLoading = false;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      })
      .addCase(toggleUserFavourite.fulfilled, (state, action) => {
        const { productId, isFavourite } = action.payload;

        const p = state.byCategoryItems.find((x) => x.id === productId);
        if (p) (p as any).isFavourite = isFavourite;

        const p2 = state.items.find((x) => x.id === productId);
        if (p2) (p2 as any).isFavourite = isFavourite;

        if (state.selectedProduct?.id === productId) {
          (state.selectedProduct as any).isFavourite = isFavourite;
        }
      });
  },
});

export const {
  clearProductsPagination,
  clearSelectedProduct,
  setSelectedProduct,
} = productsPaginationSlice.actions;

export default productsPaginationSlice.reducer;
