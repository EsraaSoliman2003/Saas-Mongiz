"use client";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/rtk/hooks";
import { logoutUser } from "@/rtk/slices/auth/authSlice";
import { useAuth } from "@/context/AuthContext";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setToken } = useAuth();

  const logout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      deleteCookie("roles");
      deleteCookie("token");
      deleteCookie("user");

      setToken(null);
      router.replace("/login");
    }
  };

  return logout;
};
