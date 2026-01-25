import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
    name: string;
    icon: string;
    href: string;
    badge?: string;
}

export default function CategoryCard({ name, icon, href, badge }: CategoryCardProps) {
    return (
        <Link href={href} className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-32 md:h-32 lg:w-32 lg:h-32 p-3 transition-transform group-hover:scale-105 ">
                {badge && (
                    <span className="absolute -top-2 -right-2 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {badge}
                    </span>
                )}
                <Image src={icon} alt={name} width={128} height={128} className="w-full h-full object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center -mt-1">{name}</span>
        </Link>
    );
}