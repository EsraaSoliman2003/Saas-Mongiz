"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function ResponsiveToaster() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <Toaster position={isMobile ? "top-center" : "bottom-right"} />
    );
}