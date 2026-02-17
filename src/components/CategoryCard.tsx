import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
    name: string;
    icon: string;
    href: string;
    badge?: string;
    subCategories?: {
        id: number;
        name: string;
        slug: string;
        image?: string;
    }[];
}

export default function CategoryCard({ name, icon, href, badge, subCategories = [] }: CategoryCardProps) {
    return (
        <div className="flex flex-col items-center group">
            <Link href={href} className="flex flex-col items-center cursor-pointer">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-3 transition-transform group-hover:scale-105 ">
                    {badge && (
                        <span className="absolute -top-2 -right-2 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold z-10">
                            {badge}
                        </span>
                    )}
                    <Image src={icon} alt={name} width={128} height={128} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center -mt-1 group-hover:text-blue-600 transition-colors">{name}</span>
            </Link>

            {/* Subcategories (small size) */}
            {subCategories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {subCategories.slice(0, 3).map((sub) => (
                        <Link
                            key={sub.id}
                            href={`/products?category=${name.toLowerCase()}&subcategory=${sub.slug}`}
                            className="flex flex-col items-center hover:bg-gray-50 p-1 rounded transition-colors"
                        >
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                                <Image
                                    src={sub.image || "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png"}
                                    alt={sub.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[10px] text-gray-500 text-center truncate w-12">{sub.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}