"use client";

import { Mail, X, Send, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ConfirmEmailModal from "./ConfirmEmailModal";

export default function EmailStatusButton() {
    const t = useTranslations();
    const { emailConfirmed, token } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        const user = getCookie("user");
        if (user) {
            try {
                const parsedUser = JSON.parse(user as string);
                setUserEmail(parsedUser.email || "");
            } catch (err) {
                console.error("Failed to parse user cookie:", err);
            }
        }
    }, []);

    if (emailConfirmed || !token) return null;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setModalOpen(true)}
                className="relative bg-gradient-to-r from-red-500 to-(--main-color) p-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
                aria-label={t("Email not confirmed")}
            >
                <Mail className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                </div>
            </button>

            {
                modalOpen && (
                    <ConfirmEmailModal
                        setModalOpen={setModalOpen}
                        userEmail={userEmail}
                        cooldown={cooldown}
                        loading={loading}
                        setLoading={setLoading}
                        setCooldown={setCooldown}
                    />
                )
            }
        </>
    );
}