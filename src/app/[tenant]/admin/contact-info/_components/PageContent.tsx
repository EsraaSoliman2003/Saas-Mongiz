"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  fetchContactInfoList,
  fetchContactInfoById,
  clearContactInfoSelected,
  updateContactInfo,
} from "@/rtk/slices/contactInfo/contactInfoSlice";
import ContactInfoForm from "./ContactInfoForm";
import ContactInfoView from "./ContactInfoView";

const PageContent = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const {
    list,
    loading,
    selected,
    detailsLoading,
    updateLoading,
  } = useAppSelector((state) => state.contactInfo);

  const firstId = useMemo(() => {
    const x: any = list?.[0];
    return x?.id ? Number(x.id) : null;
  }, [list]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    phoneNumber: "",
    email: "",
  });

  // 1) fetch list (to get id)
  useEffect(() => {
    dispatch(fetchContactInfoList());
  }, [dispatch]);

  // 2) fetch full by id (clear old first)
  useEffect(() => {
    if (!firstId) return;

    dispatch(clearContactInfoSelected());
    dispatch(fetchContactInfoById(firstId));
  }, [dispatch, firstId]);

  // 3) fill form from selectedFull
  useEffect(() => {
    if (!selected) return;

    setFormData({
      location: selected.location ?? "",
      phoneNumber: selected.phoneNumber ?? "",
      email: selected.email ?? "",
    });
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selected) return;

    await dispatch(
      updateContactInfo({ id: selected.id, ...formData })
    ).unwrap();

    // refresh full after save
    dispatch(clearContactInfoSelected());
    dispatch(fetchContactInfoById(selected.id));

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (selected) {
      setFormData({
        location: selected.location ?? "",
        phoneNumber: selected.phoneNumber ?? "",
        email: selected.email ?? "",
      });
    }
    setIsEditing(false);
  };

  const pageLoading = loading || detailsLoading || updateLoading;
  const data = selected;

  return (
    <>
      <AdminSectionHeader title={t("Contact Info")} />

      <div className="relative mt-6">
        {pageLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 rounded-xl">
            <LoadingSpinner />
          </div>
        )}

        {!data ? (
          <div className="rounded-xl bg-white box-shadow p-10 text-center text-gray-500">
            {t("No contact info available")}
          </div>
        ) : isEditing ? (
          <ContactInfoForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <ContactInfoView data={list?.[0]} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </>
  );
};

export default PageContent;
