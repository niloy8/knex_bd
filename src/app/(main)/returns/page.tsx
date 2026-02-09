import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Returns & Refunds - KNEX" };

export default function ReturnsPage() {
    return (
        <InfoPageLayout title="Returns & Refunds" subtitle="Our return policy">
            <Section title="Return Policy">
                <p>We accept returns within 7 days of delivery for most items in original condition with packaging.</p>
            </Section>
            <Section title="How to Return">
                <ol className="list-decimal list-inside space-y-1">
                    <li>Contact our support team</li>
                    <li>Provide your order number and reason</li>
                    <li>We&apos;ll arrange pickup or provide return instructions</li>
                </ol>
            </Section>
            <Section title="Refund Process">
                <p>Refunds are processed within 5-7 business days after we receive the returned item.</p>
            </Section>
            <Section title="Non-Returnable Items">
                <ul className="list-disc list-inside space-y-1">
                    <li>Perishable goods</li>
                    <li>Personal care items</li>
                    <li>Customized products</li>
                </ul>
            </Section>
        </InfoPageLayout>
    );
}
