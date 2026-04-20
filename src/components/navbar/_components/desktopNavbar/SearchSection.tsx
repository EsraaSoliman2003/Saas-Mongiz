"use client";

import { Mic, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  fetchSearchHistory,
  deleteSearchHistory,
  searchProducts
} from "@/rtk/slices/search/searchSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarHeaderProps {
  onClose?: () => void;
  hideButton?: boolean;
}

export default function SearchSection({ onClose }: SidebarHeaderProps) {
  const { token } = useAuth();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { history } = useAppSelector((s) => s.search);
  const tenantId = useAppSelector((s) => s.settings.data?.id);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [listening, setListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch history
  useEffect(() => {
    if (token) {
      dispatch(fetchSearchHistory());
    }
  }, [dispatch, token]);

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset keyword on tenant root
  useEffect(() => {
    if (!tenantId) return;

    if (pathname === `/${tenantId}`) {
      setKeyword("");
    }
  }, [pathname, tenantId]);

  // Query param sync
  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setKeyword(queryParam);
    }
  }, [searchParams]);

  // Voice search
  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t("VoiceSearchNotSupported") || "Not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = t("dir") === "rtl" ? "ar-EG" : "en-US";
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
      if (inputRef.current) inputRef.current.value = transcript;
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  // Search
  const handleSearch = () => {
    if (!keyword.trim() || !tenantId) return;

    router.push(
      `/${tenantId}/products?query=${encodeURIComponent(keyword)}`
    );

    dispatch(searchProducts(keyword))
      .unwrap()
      .then(() => {
        if (token) {
          dispatch(fetchSearchHistory());
        }
      })
      .catch((err) => {
        console.error("Search failed", err);
      });

    setIsFocused(false);
    onClose?.();
  };

  // Delete history
  const handleDeleteHistory = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteSearchHistory(id));
  };

  const filteredHistory = keyword.trim()
    ? history
        .filter((item) =>
          item.keyword.toLowerCase().includes(keyword.toLowerCase())
        )
        .slice(0, 8)
    : history.slice(0, 8);

  const showHistory = isFocused && filteredHistory.length > 0;

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Input */}
      <div className="relative flex items-center w-full bg-white rounded-full border border-gray-300 focus-within:border-(--main-color) focus-within:ring-2 focus-within:ring-(--main-color)/20 transition-all duration-200">
        <Search size={18} className="absolute left-4 text-gray-400" />

        <input
          ref={inputRef}
          type="text"
          placeholder={t("SearchPlaceholder") || "Search..."}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="w-full py-2.5 pl-11 pr-12 rounded-full outline-none text-sm"
        />

        <button
          onClick={handleVoiceSearch}
          className={`absolute right-2 p-1.5 rounded-full ${
            listening
              ? "bg-(--main-color)/10 text-main animate-pulse"
              : "text-gray-400"
          }`}
        >
          <Mic size={18} />
        </button>
      </div>

      {/* History */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 group"
            >
              <Link
                href={`/${tenantId}/products?query=${encodeURIComponent(
                  item.keyword
                )}`}
                className="flex-1"
                onClick={() => {
                  setKeyword(item.keyword);
                  dispatch(searchProducts(item.keyword));
                  setIsFocused(false);
                  onClose?.();
                }}
              >
                {item.keyword}
              </Link>

              <button
                onClick={(e) => handleDeleteHistory(item.id, e)}
                className="opacity-0 group-hover:opacity-100 text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}