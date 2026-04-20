"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAppSelector } from "@/rtk/hooks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const { token } = useAuth();

  if (!token) {
    router.replace(`/${useAppSelector((s) => s.settings.data?.id)}/login`);
    return;
  }

  return (
    <>
      {children}
    </>
  );
}
