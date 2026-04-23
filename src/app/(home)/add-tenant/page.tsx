"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { createTenant } from "@/rtk/slices/setting/settingSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  X,
  Image as ImageIcon,
  Paintbrush,
  Building2,
  Globe
} from "lucide-react";

export default function Page() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading } = useAppSelector((s) => s.settings);

  const [form, setForm] = useState({
    name: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    isActive: true,
  });

  const [logoDark, setLogoDark] = useState<File | null>(null);
  const [logoLight, setLogoLight] = useState<File | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string>("");
  const [logoLightPreview, setLogoLightPreview] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "dark" | "light"
  ) => {
    const file = e.target.files?.[0] || null;
    
    if (type === "dark") {
      setLogoDark(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setLogoDarkPreview(previewUrl);
      } else {
        setLogoDarkPreview("");
      }
    } else {
      setLogoLight(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setLogoLightPreview(previewUrl);
      } else {
        setLogoLightPreview("");
      }
    }
  };

  const removeFile = (type: "dark" | "light") => {
    if (type === "dark") {
      setLogoDark(null);
      setLogoDarkPreview("");
    } else {
      setLogoLight(null);
      setLogoLightPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        createTenant({
          name: form.name,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          isActive: true,
          logoDark: logoDark || undefined,
          logoLight: logoLight || undefined,
        })
      ).unwrap();

      toast.success(t("tenantCreatedSuccessfully") || "Tenant created successfully", {
        icon: "✅",
        duration: 3000,
      });

      router.push("/");
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("failedToCreateTenant") || "Failed to create tenant", {
        icon: "❌",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{t("back") || "Back"}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t("createNewTenant") || "Create New Tenant"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {t("configureWorkspace") || "Configure your organization workspace"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Globe className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">{t("basicInformation") || "Basic Information"}</h2>
              </div>

              {/* Tenant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tenantName") || "Tenant Name"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("tenantNamePlaceholder") || "e.g., Acme Corporation"}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{t("tenantNameHint") || "Choose a unique name for your organization"}</p>
              </div>
            </div>

            {/* Brand Colors Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Paintbrush className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">{t("brandColors") || "Brand Colors"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("primaryColor") || "Primary Color"}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-md border-2 border-white ring-1 ring-gray-200 transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: form.primaryColor }}
                    />
                    <input
                      type="color"
                      name="primaryColor"
                      value={form.primaryColor}
                      onChange={handleChange}
                      className="flex-1 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("primaryColorHint") || "Used for buttons and highlights"}</p>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("secondaryColor") || "Secondary Color"}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-md border-2 border-white ring-1 ring-gray-200 transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: form.secondaryColor }}
                    />
                    <input
                      type="color"
                      name="secondaryColor"
                      value={form.secondaryColor}
                      onChange={handleChange}
                      className="flex-1 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("secondaryColorHint") || "Used for accents and backgrounds"}</p>
                </div>
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">{t("companyLogos") || "Company Logos"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Dark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("darkModeLogo") || "Dark Mode Logo"}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {logoDarkPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={logoDarkPreview}
                            alt={t("darkLogoPreview") || "Dark logo preview"}
                            className="h-20 w-auto mx-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile("dark")}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>{t("uploadFile") || "Upload a file"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "dark")}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">{t("orDragDrop") || "or drag and drop"}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {t("fileTypes") || "PNG, JPG, GIF up to 2MB"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("darkLogoHint") || "Used for light backgrounds"}</p>
                </div>

                {/* Logo Light */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("lightModeLogo") || "Light Mode Logo"}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {logoLightPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={logoLightPreview}
                            alt={t("lightLogoPreview") || "Light logo preview"}
                            className="h-20 w-auto mx-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile("light")}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>{t("uploadFile") || "Upload a file"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "light")}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">{t("orDragDrop") || "or drag and drop"}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {t("fileTypes") || "PNG, JPG, GIF up to 2MB"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("lightLogoHint") || "Used for dark backgrounds"}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2.5 rounded-xl font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("creating") || "Creating..."}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{t("createTenant") || "Create Tenant"}</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}