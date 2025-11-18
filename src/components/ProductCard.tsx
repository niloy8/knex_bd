import Link from "next/link";

interface ProductCardProps {
    title: string;
    price: string;
    image: string;
    discount?: string;
    href: string;
}

export default function ProductCard({ title, price, image, discount, href }: ProductCardProps) {
    return (
        <Link href={href} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
            <div className="aspect-square bg-gray-50 p-4 relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-6xl">
                    {image}
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