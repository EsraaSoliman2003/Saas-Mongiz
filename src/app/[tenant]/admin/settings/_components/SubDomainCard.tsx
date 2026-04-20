"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export default function SubDomainCard() {
  const t = useTranslations();

  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);

  const baseDomain = "imothmr.com";

  const handleSave = async () => {
    if (!subdomain.trim()) return;
    setLoading(true);
    // await new Promise(resolve => setTimeout(resolve, 800));
    console.log({ subdomain });
    setLoading(false);
  };

  const isValid = subdomain.trim().length > 0 && /^[a-z0-9-]+$/.test(subdomain);

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-7">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t("Custom Subdomain")}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("Create a unique web address for your store")}
            </p>
          </div>
        </div>

        {/* Subdomain Input */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Subdomain")}
            </label>
            <div dir="ltr" className="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-brand"
                className="px-4 py-3 flex-1 outline-none text-gray-800 bg-white"
              />
              <span className="px-4 py-3 bg-gray-50 text-gray-500 text-sm font-medium border-l border-gray-200">
                .{baseDomain}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {t("Use only lowercase letters, numbers, and hyphens")}
            </p>
          </div>

          {/* Live Preview */}
          {subdomain && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-600">{t("Preview")}:</span>
                <code className="font-mono text-sm font-medium text-gray-900 bg-white px-2 py-0.5 rounded-md">
                  https://{subdomain}.{baseDomain}
                </code>
              </div>
            </div>
          )}

          {/* Validation message */}
          {subdomain && !isValid && (
            <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t("Please enter a valid subdomain (letters, numbers, hyphens only)")}
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading || !subdomain || !isValid}
              className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("Saving")}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {t("Save Subdomain")}
                </>
              )}
            </button>
          </div>

          {/* Info note */}
          <div className="mt-3 text-center text-xs text-gray-400 border-t border-gray-100 pt-3">
            💡 {t("Changes will be applied immediately after saving")}
          </div>
        </div>
      </div>
    </div>
  );
}