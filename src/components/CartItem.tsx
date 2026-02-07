"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Package } from "lucide-react";

interface SelectedVariant {
    id: number;
    name: string;
    image: string;
    price?: number;
}

interface CartItemProps {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    selectedVariant?: SelectedVariant;
    customSelections?: Record<string, string>;
    onQuantityChange: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({
    id,
    title,
    price,
    image,
    quantity,
    selectedColor,
    selectedSize,
    selectedVariant,
    customSelections,
    onQuantityChange,
    onRemove,
}: CartItemProps) {
    // Build variant display text
    const getVariantText = () => {
        const parts: string[] = [];
        if (selectedVariant?.name) parts.push(selectedVariant.name);
        if (selectedColor) parts.push(selectedColor);
        if (selectedSize) parts.push(`Size: ${selectedSize}`);
        if (customSelections) {
            Object.entries(customSelections).forEach(([key, value]) => {
                parts.push(`${key}: ${value}`);
            });
        }
        return parts.join(" | ");
    };

    const variantText = getVariantText();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200 last:border-0">
            {/* Product Image & Info */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center shrink-0 shadow-md overflow-hidden relative">
                    {image ? (
                        <Image src={image} alt={title} fill className="object-cover" unoptimized />
                    ) : (
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase mb-1">Product</p>
                    <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">{title}</h4>
                    {variantText && (
                        <p className="text-xs text-blue-600 mt-0.5">{variantText}</p>
                    )}
                    <p className="text-xs sm:hidden text-gray-600 mt-1">Tk {price.toLocaleString()} each</p>
                </div>
            </div>

            {/* Controls - Mobile/Desktop Layout */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => onQuantityChange(id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 cursor-pointer border rounded sm:border-0"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium text-sm sm:text-base text-gray-900">{quantity}</span>
                    <button
                        onClick={() => onQuantityChange(id, quantity + 1)}
                        className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer border rounded sm:border-0"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Price */}
                <p className="font-semibold text-gray-900 text-sm sm:text-base w-20 sm:w-24 text-right">Tk {(price * quantity).toLocaleString()}</p>

                {/* Remove Button */}
                <button onClick={() => onRemove(id)} className="text-gray-400 hover:text-red-500 cursor-pointer p-1">
                    <Trash2 size={16} className="sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
}
