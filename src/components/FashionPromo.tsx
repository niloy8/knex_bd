import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface FashionPromoProps {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    href?: string;
}

export default function FashionPromo({ title, subtitle, buttonText, image, href = "/products" }: FashionPromoProps) {
    return (
        <section className="relative w-full h-full rounded-lg overflow-hidden shadow-sm min-h-[260px] md:min-h-80 lg:min-h-[360px]">
            <div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/95 via-white/70 to-white/10" />

            <div className="relative p-6 md:p-8 lg:p-10">
                <div className="max-w-lg">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
                    <p className="text-sm sm:text-base text-gray-700 mb-6">{subtitle}</p>
                    <Link href={href} className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                        {buttonText}
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
