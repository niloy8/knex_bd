import Link from "next/link";
import Image from "next/image";
import { Package, Projector, Speaker, Monitor, Gamepad2, Snowflake, Apple, Baby, Lightbulb, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Projector, Speaker, Monitor, Gamepad2, Snowflake, Apple, Baby, Lightbulb, Package
};

interface ProductCardProps {
    title: string;
    price: string;
    iconName?: string;
    image?: string;
    discount?: string;
    href: string;
}

export default function ProductCard({ title, price, iconName, image, discount, href }: ProductCardProps) {
    const IconComponent = iconName ? iconMap[iconName] : null;

    return (
        <Link href={href} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
            <div className="aspect-square bg-gray-50 p-4 relative overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative">
                    {IconComponent ? (
                        <IconComponent className="w-16 h-16 text-gray-500" />
                    ) : image ? (
                        <Image src={image} alt={title} fill className="object-contain" unoptimized />
                    ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                    )}
                </div>
                {discount && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {discount}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600">{title}</h3>
                <p className="text-green-600 font-bold text-lg">{price}</p>
            </div>
        </Link>
    );
}