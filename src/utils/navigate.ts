// utils/navigate.ts
"use client";

export function navigate(path: string) {
  if (typeof window !== "undefined") {
    // client-side navigation without reload
    import("next/navigation").then(({ useRouter }) => {
      const router = useRouter();
      router.push(path);
    }).catch(() => {
      // fallback in case import fails
      window.location.href = path;
    });
  }
}