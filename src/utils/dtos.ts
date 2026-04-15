export type ProductTypeItem = {
  id: number;
  type: string;
};

export type BrandApi = {
  id: string;
  name: string;
};

export type ProductTypeApi = {
  id: number;
  type: string;
};

export interface Product {
  lang?: string;

  brand?: BrandApi | null;
  types?: ProductTypeApi[];

  sellerId?: number;
  sellerName?: string | null;
  seller?: any;

  id: number;
  categoryId: number;
  subCategoryId?: number;

  name: string;
  description: string;

  mainPrice: number;
  price: number;
  discount: number;

  quantity: number;
  reviewCount: number;
  isFavourite: boolean;

  rate: number;
  averageRate: number;

  mainImage: string;
  images: string[];

  categoryName?: string;
  subCategoryName?: string;

  limitProducts?: number | null;
  limitStock?: number | null;

  hasReviewed?: boolean;
  keywords?: string[];
  additionalData?: any[];
}

/* =========================
   Category (GET /api/Category)
========================= */
export interface Category {
  id: number;
  name: string;
  image: string;
}

/* =========================
   Full Category (GET /api/Category/full)
========================= */
export interface FullCategory {
  id: number;
  name: string;
  image: string;
}

/* =========================
   Create Category DTO
   POST /api/Category
========================= */
export interface CreateCategoryDto {
  name: string;
  image: File;
}

/* =========================
   Update Category DTO
   PUT /api/Category/{id}
========================= */
export interface UpdateCategoryDto {
  id: number;
  name: string;
  image?: File; // optional because image may not be changed
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface FullSubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface CreateSubCategoryDto {
  name: string;
  categoryId: number;
}

export interface UpdateSubCategoryDto {
  id: number;
  name: string;
}
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  imageUrl: string | null;
  email: string;
  countryCode: string;
  emailConfirmed: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  roles: string[];
  extra?: {
    isDeleted: true;
  };
}

export interface Faqs {
  id: number;
  question: string;
  answer: string;
}

export type AboutHowItWorkData = {
  images: string[];
  titleTextEN: string;
  titleTextAR: string;
  titleHighlightEN: string;
  titleHighlightAR: string;
  paragraphEN: string;
  paragraphAR: string;
};
