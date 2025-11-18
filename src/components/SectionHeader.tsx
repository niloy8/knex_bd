import Link from "next/link";

interface SectionHeaderProps {
    title: string;
    href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {href && (
                <Link href={href} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View All
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
    );
}
