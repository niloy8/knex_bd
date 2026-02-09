import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Payments - KNEX" };

export default function PaymentsPage() {
    return (
        <InfoPageLayout title="Payments" subtitle="Payment options and information">
            <Section title="Accepted Payment Methods">
                <ul className="list-disc list-inside space-y-1">
                    <li>Cash on Delivery (COD)</li>
                    <li>bKash</li>
                    <li>Nagad</li>
                    <li>Credit/Debit Cards (Coming soon)</li>
                </ul>
            </Section>
            <Section title="Payment Security">
                <p>All transactions are secured with industry-standard encryption to protect your information.</p>
            </Section>
            <Section title="Cash on Delivery">
                <p>Pay in cash when your order arrives. Available for all locations in Bangladesh.</p>
            </Section>
        </InfoPageLayout>
    );
}
