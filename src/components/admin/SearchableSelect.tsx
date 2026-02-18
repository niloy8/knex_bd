"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface Option {
    id: string;
    name: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    className = "",
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => String(opt.id) === String(value));

    const filteredOptions = options.filter((opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            setSearchQuery("");
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg text-left focus:ring-2 focus:ring-blue-500 outline-none transition-all ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400" : "hover:border-gray-300"
                    }`}
            >
                <span className={`block truncate ${!selectedOption ? "text-gray-400" : "text-gray-900"}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-sm outline-none bg-transparent"
                            autoFocus
                        />
                        {searchQuery && (
                            <button type="button" onClick={() => setSearchQuery("")}>
                                <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(String(option.id));
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors ${String(option.id) === String(value) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    <span>{option.name}</span>
                                    {String(option.id) === String(value) && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
