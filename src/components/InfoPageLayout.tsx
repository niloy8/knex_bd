import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface InfoPageLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-500 mb-6">{subtitle}</p>}
                <div className="prose prose-gray max-w-none">{children}</div>
            </div>
        </div>
    );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
            <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
        </section>
    );
}
