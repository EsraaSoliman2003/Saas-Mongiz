"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAppDispatch } from "@/rtk/hooks";
import { googleSignIn } from "@/rtk/slices/auth/authSlice";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Google } from "@/assets";
import Image from "next/image";

export default function GoogleSignInButton() {
    const dispatch = useAppDispatch();
    const { setToken } = useAuth();
    const router = useRouter();
    const t = useTranslations();

    const handleGoogleLogin = async (res: CredentialResponse) => {
        if (!res.credential) return toast.error("Google login failed");

        const resultAction = await dispatch(googleSignIn(res.credential));

        if (googleSignIn.fulfilled.match(resultAction)) {
            const { user, token, roles } = resultAction.payload;

            setCookie("token", token, { maxAge: 60 * 60 * 24 * 7, path: "/" });
            setToken(token);

            setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7, path: "/" });
            setCookie("roles", JSON.stringify(roles), { maxAge: 60 * 60 * 24 * 7, path: "/" });

            toast.success(t("Login successful"));

            if (roles.includes("ADMIN")) router.replace("/admin");
            else if (roles.includes("SELLER")) router.replace("/seller");
            else router.replace("/");
        } else {
            toast.error(resultAction.payload?.title || "Google login failed");
        }
    };

    return (
        <div className="relative w-full">

            {/* Your custom button */}
            <button className="w-full h-11 rounded-lg bg-white text-gray-800 flex items-center justify-center gap-2 font-medium cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:shadow-md active:scale-[0.97]">
                <Image src={Google} alt="Google" width={28} height={28} /> {t("LoginWithGoogle")}
            </button>

            {/* Invisible Google button */}
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
                containerProps={{
                    style: {
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                    },
                }}
            />

        </div>
    );
}