import Link from "next/link";

interface CategoryCardProps {
    name: string;
    icon: string;
    href: string;
    badge?: string;
}

export default function CategoryCard({ name, icon, href, badge }: CategoryCardProps) {
    return (
        <Link href={href} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 transition-transform group-hover:scale-105">
                {badge && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {badge}
                    </span>
                )}
                <div className="text-4xl">{icon}</div>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{name}</span>
        </Link>
    );
}
