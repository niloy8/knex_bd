import InfoPageLayout from "@/components/InfoPageLayout";
import Link from "next/link";

export const metadata = { title: "Sitemap - KNEX" };

const sections = [
    {
        title: "Shopping",
        links: [
            { name: "All Products", href: "/products" },
            { name: "Categories", href: "/category" },
            { name: "Cart", href: "/cart" },
            { name: "Wishlist", href: "/wishlist" },
        ],
    },
    {
        title: "Account",
        links: [
            { name: "My Account", href: "/account" },
            { name: "My Orders", href: "/account/orders" },
            { name: "My Addresses", href: "/account/addresses" },
            { name: "Login", href: "/login" },
            { name: "Register", href: "/register" },
        ],
    },
    {
        title: "About",
        links: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
            { name: "Corporate Information", href: "/corporate" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "Payments", href: "/payments" },
            { name: "Shipping", href: "/shipping" },
            { name: "Returns & Refunds", href: "/returns" },
            { name: "FAQ", href: "/faq" },
        ],
    },
    {
        title: "Policy",
        links: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Use", href: "/terms" },
            { name: "Security", href: "/security" },
        ],
    },
];

export default function SitemapPage() {
    return (
        <InfoPageLayout title="Sitemap" subtitle="Quick links to all pages">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h3 className="font-semibold text-gray-800 mb-2">{section.title}</h3>
                        <ul className="space-y-1">
                            {section.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-blue-600 hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </InfoPageLayout>
    );
}
