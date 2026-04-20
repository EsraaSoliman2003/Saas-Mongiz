"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { resetDraft, setField } from "@/rtk/slices/ui/ProductSlice";
import StepIndicator from "./_components/StepIndicator";
import BasicInformation from "./_components/BasicInformation";
import Pricing from "./_components/Pricing";
import Media from "./_components/Media";
import Attributes from "./_components/Attributes";
import ProductTypes from "./_components/ProductTypes";
import AdditionalData from "./_components/AdditionalData";
import Keywords from "./_components/Keywords";
import FormSubmitButton from "../../_components/FormSubmitButton";
import TextEditor from "./_components/TextEditor";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { createProduct, fetchProductById, updateProduct } from "@/rtk/slices/products/productsPaginationSlice";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { clearSelectedProduct } from "@/rtk/slices/products/productsPaginationSlice";
/* ---------------------------------- */
/* Step Icon Type (matches StepIndicator) */
/* ---------------------------------- */

type StepIcon =
  | "FileText"
  | "FileEdit"
  | "DollarSign"
  | "Image"
  | "Layers"
  | "Tag"
  | "Key"
  | "Settings";

const AddProductForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("addProduct");
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { selectedProduct, selectedLoading } = useAppSelector((s) => s.productsCrud)
  const productId = searchParams.get("id");

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetDraft());
    };
  }, [dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(setField({ key: "name", value: selectedProduct.name }));
      dispatch(setField({ key: "description", value: selectedProduct.description }));
      dispatch(setField({ key: "mainPrice", value: selectedProduct.mainPrice }));
      dispatch(setField({ key: "brandId", value: selectedProduct.brand?.id ?? 0, }));
      dispatch(setField({ key: "categoryId", value: selectedProduct.categoryId }));
      dispatch(setField({ key: "subCategoryId", value: selectedProduct.subCategoryId }));
      dispatch(setField({ key: "discount", value: selectedProduct.discount }));
      dispatch(setField({ key: "quantity", value: selectedProduct.quantity }));
      dispatch(setField({ key: "mainImageUrl", value: selectedProduct.mainImage ?? null }));
      dispatch(setField({ key: "imageUrls", value: selectedProduct.images }));
      dispatch(setField({ key: "limitProducts", value: selectedProduct.limitProducts }));
      dispatch(setField({ key: "limitStock", value: selectedProduct.limitStock }));
      dispatch(setField({ key: "keywords", value: selectedProduct.keywords || [] }));
      dispatch(setField({ key: "additionalData", value: selectedProduct.additionalData || [] }));
      dispatch(setField({ key: "variants", value: selectedProduct.variants || [] }));
    }
  }, [selectedProduct, dispatch]);


  const [currentStep, setCurrentStep] = useState(0);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const productDraft = useAppSelector((s) => s.productDraft);
  const { createLoading } = useAppSelector((s) => s.productsCrud);

  /* ---------------------------------- */
  /* Step Meta (for StepIndicator only) */
  /* ---------------------------------- */

  const stepMeta: { key: string; icon: StepIcon }[] = [
    { key: "basic", icon: "FileText" },
    { key: "attributes", icon: "Layers" },
    // { key: "media", icon: "Image" },
    // { key: "pricing", icon: "DollarSign" },
    // { key: "types", icon: "Tag" },
    // { key: "keywords", icon: "Settings" },
  ];

  /* ---------------------------------- */
  /* Step Renderers (for actual UI) */
  /* ---------------------------------- */

  const stepRenderers: (() => React.ReactNode)[] = [
    () => <BasicInformation
      mainFile={mainFile}
      setMainFile={setMainFile}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
    />,
    () => <Attributes />,
    // () => (
    //   <Media
    //     mainFile={mainFile}
    //     setMainFile={setMainFile}
    //     imageFiles={imageFiles}
    //     setImageFiles={setImageFiles}
    //   />
    // ),
    // () => <Pricing />,
    // () => <ProductTypes />,
    // () => <Keywords />,
  ];

  /* ---------------------------------- */
  /* Validation Per Step */
  /* ---------------------------------- */

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          productDraft.name.trim() !== "" &&
          productDraft.categoryId !== null &&
          productDraft.categoryId !== 0 &&
          productDraft.description?.trim() !== "" &&
          productDraft.mainPrice > 0 &&
          productDraft.mainPrice < 1000000 &&
          (!selectedProduct ? !!mainFile : true) // if no selectedProduct, mainFile must exist
        );

      default:
        return true;
    }
  };

  /* ---------------------------------- */
  /* Navigation */
  /* ---------------------------------- */

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      alert("Please fill all required fields before continuing.");
      return;
    }

    if (currentStep < stepMeta.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /* ---------------------------------- */
  /* Submit */
  /* ---------------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        try {
          await dispatch(
            updateProduct({
              id: selectedProduct.id,
              name: productDraft.name,
              description: productDraft.description,
              mainPrice: productDraft.mainPrice,
              categoryId: productDraft.categoryId,
              brandId: productDraft.brandId,
              subCategoryId: productDraft.subCategoryId,
              discount: productDraft.discount,
              quantity: productDraft.quantity,
              limitProducts: productDraft.limitProducts,
              limitStock: productDraft.limitStock,
              mainImage: mainFile ?? undefined,
              images: imageFiles,
              existsImages: productDraft.imageUrls,
              additionalData: productDraft.additionalData.filter((ad) => ad.values.length > 0 && ad.key !== ""),
              variants: productDraft.variants.map((v) => ({
                attributes: v.attributes,
                quantity: v.quantity,
              })),
              keywords: productDraft.keywords,
            })
          ).unwrap();

          toast(t("productUpdatedSuccessfully"));
          router.push("/admin/products");

        } catch (error) {
          console.log(error);
        }

      } else {

        if (!mainFile) {
          toast("Main image is required");
          return;
        }

        try {
          await dispatch(
            createProduct({
              name: productDraft.name,
              description: productDraft.description,
              mainPrice: productDraft.mainPrice,
              categoryId: productDraft.categoryId,
              brandId: productDraft.brandId,
              subCategoryId: productDraft.subCategoryId,
              discount: productDraft.discount,
              quantity: productDraft.quantity,
              limitProducts: productDraft.limitProducts,
              limitStock: productDraft.limitStock,
              mainImage: mainFile,
              images: imageFiles,
              keywords: productDraft.keywords,
              additionalData: productDraft.additionalData.filter((ad) => ad.values.length > 0 && ad.key.trim() !== ""),
              variants: productDraft.variants.map((v) => ({
                attributes: v.attributes,
                quantity: v.quantity,
              })),
            })
          ).unwrap();

          dispatch(resetDraft());
          router.push("/admin/products");
          toast(t("productAddedsuccessfully"));

        } catch (error) {
          console.log(error);

        }
      }

    } catch (error) {
      console.log(error);
      toast("Something went wrong");
    }
  };

  const CurrentStep = stepRenderers[currentStep];

  /* ---------------------------------- */
  /* JSX */
  /* ---------------------------------- */

  if (selectedLoading)
    return (
      <div className="text-center min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
          {t("title")}
        </h1>

        {/* Step Indicator */}
        <StepIndicator
          steps={stepMeta}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* Current Step */}
        {CurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            {t("previous")}
          </button>

          {currentStep === stepMeta.length - 1 ? (
            <FormSubmitButton
              text={t("submit")}
              className="min-w-40"
              loading={createLoading}
            />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="px-6 py-2 bg-main text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {t("next")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;