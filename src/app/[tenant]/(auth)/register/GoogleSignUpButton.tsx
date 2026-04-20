"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { googleSignUp } from "@/rtk/slices/auth/authSlice";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Google } from "@/assets";

interface Props {
    phoneNumber: string;
    countryCode: string;
}

export default function GoogleSignUpButton({ phoneNumber, countryCode }: Props) {
    const dispatch = useAppDispatch();
    const { setToken } = useAuth();
    const router = useRouter();
    const t = useTranslations();

    const handleGoogleSignUp = async (res: CredentialResponse) => {
        if (!res.credential) return toast.error("Google signup failed");

        const resultAction = await dispatch(
            googleSignUp({ token: res.credential, phoneNumber, countryCode })
        );

        if (googleSignUp.fulfilled.match(resultAction)) {
            const { user, token, roles } = resultAction.payload;

            setCookie("token", token, { maxAge: 60 * 60 * 24 * 7, path: `/${useAppSelector((s) => s.settings.data?.id)}` });
            setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7, path: `/${useAppSelector((s) => s.settings.data?.id)}` });
            setCookie("roles", JSON.stringify(roles), { maxAge: 60 * 60 * 24 * 7, path: `/${useAppSelector((s) => s.settings.data?.id)}` });

            setToken(token);

            toast.success(t("AccountCreated"));

            if (roles.includes("ADMIN")) router.replace(`/${useAppSelector((s) => s.settings.data?.id)}/admin`);
            else if (roles.includes("SELLER")) router.replace(`/${useAppSelector((s) => s.settings.data?.id)}/seller`);
            else router.replace(`/${useAppSelector((s) => s.settings.data?.id)}`);
        }
    };

    return (
        <div className="relative w-full">

            {/* Custom Button */}
            <button
                className="w-full h-11 rounded-lg bg-white text-gray-800 flex items-center justify-center gap-2 font-medium cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:shadow-md active:scale-[0.97]">
                <Image src={Google} alt="Google" width={28} height={28} /> {t("LoginWithGoogle")}
            </button>

            {/* Invisible Google Button */}
            <GoogleLogin
                onSuccess={handleGoogleSignUp}
                onError={() => toast.error("Google signup failed")}
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