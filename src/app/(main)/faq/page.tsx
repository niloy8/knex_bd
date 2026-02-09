import InfoPageLayout from "@/components/InfoPageLayout";
import { ChevronDown } from "lucide-react";

export const metadata = { title: "FAQ - KNEX" };

const faqs = [
    { q: "How do I place an order?", a: "Browse products, add to cart, and proceed to checkout. You'll need to create an account or login to complete your order." },
    { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), bKash, and Nagad." },
    { q: "How long does delivery take?", a: "1-2 days inside Dhaka, 3-5 days outside Dhaka." },
    { q: "Can I cancel my order?", a: "Yes, you can cancel before the order is shipped. Contact support for assistance." },
    { q: "How do I track my order?", a: "Login to your account and visit 'My Orders' to see your order status." },
    { q: "What if I receive a damaged product?", a: "Contact us within 24 hours with photos of the damage for a replacement or refund." },
];

export default function FAQPage() {
    return (
        <InfoPageLayout title="FAQ" subtitle="Frequently asked questions">
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <details key={i} className="group border border-gray-200 rounded-lg">
                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                            <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="px-4 pb-4 text-sm text-gray-600">{faq.a}</p>
                    </details>
                ))}
            </div>
        </InfoPageLayout>
    );
}
