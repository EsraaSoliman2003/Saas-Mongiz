"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  fetchSocialList,
  updateSocial,
} from "@/rtk/slices/social/socialSlice";
import LoadingSpinner from "../_components/LoadingSpinner";

export default function Page() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { list, loading, updateLoading } = useAppSelector(
    (state) => state.social
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [urlValue, setUrlValue] = useState("");

  useEffect(() => {
    dispatch(fetchSocialList());
  }, [dispatch]);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setUrlValue(item.url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setUrlValue("");
  };

  const submitEdit = async (id: number, name: string) => {
    try {
      await dispatch(
        updateSocial({
          id,
          Url: urlValue,
          Name: name,
        })
      ).unwrap();

      toast.success(t("SocialUpdated"));
      cancelEdit();
    } catch (err: any) {
      toast.error(err || t("UpdateFailed"));
    }
  };

  return (
    <section className="p-4 lg:p-10 space-y-6">
      <AdminSectionHeader title={t("SocialLinks")} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-gray-200 rounded-xl p-4 bg-white"
            >
              {/* Name (Read Only) */}
              <div className="w-full md:w-1/4 font-medium capitalize">
                {item.name}
              </div>

              {/* URL */}
              <div className="flex-1 w-full">
                {editingId === item.id ? (
                  <input
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="truncate text-sm text-gray-700">{item.url}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => submitEdit(item.id, item.name)}
                      disabled={updateLoading}
                      className="px-4 py-2 text-sm rounded-lg bg-primary text-white disabled:opacity-50"
                    >
                      {t("Save")}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-200"
                    >
                      {t("Cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(item)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200"
                  >
                    {t("Edit")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
