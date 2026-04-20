"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const { token } = useAuth();

  if (!token) {
    router.replace("/login");
    return;
  }

  return (
    <>
      {children}
    </>
  );
}
