interface BannerProps {
    title: string;
    subtitle: string;
    price?: string;
    bgColor?: string;
    image: string;
}

export default function Banner({ title, subtitle, price, bgColor = "bg-gradient-to-r from-blue-600 to-indigo-600", image }: BannerProps) {
    return (
        <div className={`${bgColor} rounded-2xl p-8 text-white relative overflow-hidden min-h-[200px] flex items-center`}>
            <div className="relative z-10 max-w-md">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
                <p className="text-lg mb-4 text-white/90">{subtitle}</p>
                {price && <p className="text-2xl font-bold">{price}</p>}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-9xl opacity-20">
                {image}
            </div>
        </div>
    );
}
