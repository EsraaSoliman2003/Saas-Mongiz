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

export default function SearchSection({ onClose, hideButton }: SidebarHeaderProps) {
    const { token } = useAuth();
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { history } = useAppSelector((s) => s.search);

    const [keyword, setKeyword] = useState("");
    const [listening, setListening] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch history on mount
    useEffect(() => {
        if (token) {
            dispatch(fetchSearchHistory());
        }
    }, [dispatch, token]);

    // Close dropdown when clicking outside
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

    const currentPath = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (currentPath === "/") {
            setKeyword("")
        }
    }, [currentPath]);

    const queryParam = searchParams.get("query");

    useEffect(() => {
        if (queryParam) {
            setKeyword(queryParam);
        }
    }, [queryParam]);

    const handleVoiceSearch = () => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(t("VoiceSearchNotSupported") || "Your browser does not support voice search");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = t("dir") === "rtl" ? "ar-EG" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

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

    const handleSearch = () => {
        if (!keyword.trim()) return;

        router.push(`/products?query=${encodeURIComponent(keyword)}`);

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
        : history.length > 0
            ? history.slice(0, 8)
            : [];

    const showHistory = isFocused && filteredHistory.length > 0;

    return (
        <div className="w-full" ref={containerRef}>
            <div className="relative flex items-center w-full bg-white rounded-full border border-gray-300 focus-within:border-(--main-color) focus-within:ring-2 focus-within:ring-(--main-color)/20 transition-all duration-200">
                <Search size={18} className="absolute left-4 text-gray-400" />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder={t("SearchPlaceholder") || "Search products..."}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    className="w-full py-2.5 pl-11 pr-12 rounded-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                />

                <button
                    onClick={handleVoiceSearch}
                    className={`absolute right-2 p-1.5 rounded-full transition-all duration-200 ${listening
                            ? "bg-(--main-color)/10 text-main animate-pulse"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        }`}
                    type="button"
                    aria-label="Voice search"
                >
                    <Mic size={18} />
                </button>
            </div>

            {/* Search History Dropdown */}
            {showHistory && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                    <div className="py-1">
                        {filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer group"
                            >
                                <Link
                                    href={`/products?query=${encodeURIComponent(item.keyword)}`}
                                    className="flex-1"
                                    onClick={() => {
                                        setKeyword(item.keyword);
                                        if (inputRef.current) inputRef.current.value = item.keyword;
                                        dispatch(searchProducts(item.keyword))
                                            .unwrap()
                                            .then(() => {
                                                if (token) {
                                                    dispatch(fetchSearchHistory());
                                                }
                                            });
                                        setIsFocused(false);
                                        onClose?.();
                                    }}
                                >
                                    <span className="text-sm text-gray-700">{item.keyword}</span>
                                </Link>

                                <button
                                    onClick={(e) => handleDeleteHistory(item.id, e)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    aria-label="Delete search history"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}