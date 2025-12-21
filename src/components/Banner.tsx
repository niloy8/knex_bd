"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface BannerProps {
    banners: Array<{
        title: string;
        subtitle: string;
        price?: string;
        bgColor?: string;
        image: string;
    }>;
    autoSlide?: boolean;
    interval?: number;
}

export default function Banner({ banners, autoSlide = true, interval = 1500 }: BannerProps) {
    const [current, setCurrent] = useState(0);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (!autoSlide) return;
        const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), interval);
        return () => clearInterval(timer);
    }, [autoSlide, interval, banners.length, key]);

    const next = () => {
        setCurrent((prev) => (prev + 1) % banners.length);
        setKey((prev) => prev + 1);
    };
    const prev = () => {
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
        setKey((prev) => prev + 1);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl group">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner, idx) => (
                    <div key={idx} className={`cursor-pointer min-w-full ${banner.bgColor || "bg-linear-to-r from-blue-600 to-indigo-600"} p-8 text-white relative overflow-hidden min-h-[200px] flex items-center`}>
                        <div className="relative z-10 max-w-md">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{banner.title}</h2>
                            <p className="text-lg mb-4 text-white/90">{banner.subtitle}</p>
                            {banner.price && <p className="text-2xl font-bold">{banner.price}</p>}
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-9xl opacity-20">{banner.image}</div>
                    </div>
                ))}
            </div>

            <button onClick={prev} className="cursor-pointer absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button onClick={next} className="cursor-pointer absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 md:p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button key={idx} onClick={() => { setCurrent(idx); setKey((prev) => prev + 1); }} className={`h-2 rounded-full transition-all relative overflow-hidden ${current === idx ? "w-8" : "w-2"}`}>
                        <div className="absolute inset-0 bg-white/50" />
                        {current === idx && autoSlide && <div key={key} className="absolute inset-0 bg-white origin-left" style={{ animation: `fillBar ${interval}ms linear` }} />}
                    </button>
                ))}
            </div>
        </div>
    );
}
