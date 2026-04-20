// store.ts
import { configureStore } from "@reduxjs/toolkit";
import subCategoriesReducer from "./slices/subCategories/subCategoriesSlice";
import subCategoriesHome1Reducer from "./slices/subCategories/subCategoriesSliceHome1";
import productsReducer from "./slices/products/productsSliceSimple";
import productsCrudReducer from "./slices/products/productsPaginationSlice";
import productsCrudAdminReducer from "./slices/products/productsPaginationSliceAdmin";
import categoriesReducer from "./slices/category/categoriesSlice";
import bannerReducer from "./slices/banner/bannerSlice";
import sliderReducer from "./slices/slider/sliderSlice";
import menuReducer from "./slices/openMenu";
import authReducer from "./slices/auth/authSlice";
import phoneReducer from "./slices/ui/phoneSlice";
import productDraftReducer from "./slices/ui/ProductSlice";
import profileReducer from "./slices/profile/profileSlice";
import orderReducer from "./slices/orders/ordersSlice";
import addressReducer from "./slices/address/addressSlice";
import favouriteReducer from "./slices/favourite/favouriteSlice";
import productDetailsReducer from "./slices/productDetails/productDetailsSlice";
import cartReducer from "./slices/ui/cartSlice";
import faqReducer from "./slices/faq/faqSlice";
import contactUsReducer from "./slices/contactUs/contactUsSlice";
import contactInfoReducer from "./slices/contactInfo/contactInfoSlice";
import brandsReducer from "@/rtk/slices/brands/brandsSlice";
import SocialReducer from "@/rtk/slices/social/socialSlice";
import NotificationReducer from "@/rtk/slices/notifications/userNotificationSlice";
import CouponReducer from "@/rtk/slices/coupon/couponSlice";
import statisticalReducer from "@/rtk/slices/statistical/statisticalSlice";
import usersReducer from "./slices/user/userSlice";
import mobileNotificationReducer from "./slices/notification-mobile/mobileNotificationSlice";
import ContactUsReducer from "./slices/contactUs/contactUsSlice";
import sellerReducer from "./slices/seller/sellerSlice";
import categoriesMenuReducer from "./slices/categoriesMenu/categoriesMenuSlice";
import userProductReviewReducer from "./slices/userProductReviewSlice/userProductReviewSlice";
import searchReducer from "./slices/search/searchSlice";
import home1Reducer from "./slices/home/homeSlice1";
import home2Reducer from "./slices/home/homeSlice2";
import currencyReducer from "./slices/currency/currency";
import currencyValueReducer from "./slices/ui/Currency";
import inventoryReducer from "./slices/inventory/inventory";
import logoReducer from "./slices/logo/logoSlice";
import howItWorkReducer from "./slices/howItWork/howItWork";
import settingsReducer from "./slices/setting/settingSlice";
import tenantReducer from "./slices/ui/tenantSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    subCategories: subCategoriesReducer,
    subCategoriesHome1: subCategoriesHome1Reducer,
    productsCrud: productsCrudReducer,
    products: productsReducer,
    banner: bannerReducer,
    slider: sliderReducer,
    menu: menuReducer,
    phone: phoneReducer,
    profile: profileReducer,
    order: orderReducer,
    address: addressReducer,
    favourite: favouriteReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    faq: faqReducer,
    contactUs: contactUsReducer,
    contactInfo: contactInfoReducer,
    brands: brandsReducer,
    social: SocialReducer,
    userNotification: NotificationReducer,
    coupon: CouponReducer,
    statistical: statisticalReducer,
    users: usersReducer,
    mobileNotification: mobileNotificationReducer,
    ContactUs: ContactUsReducer,
    productDraft: productDraftReducer,
    seller: sellerReducer,
    categoriesMenu: categoriesMenuReducer,
    productsCrudAdmin: productsCrudAdminReducer,
    userProductReview: userProductReviewReducer,
    search: searchReducer,
    home1: home1Reducer,
    home2: home2Reducer,
    currency: currencyReducer,
    currencyValue: currencyValueReducer,
    inventory: inventoryReducer,
    logo: logoReducer,
    howItWork: howItWorkReducer,
    settings: settingsReducer,
    tenant: tenantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
