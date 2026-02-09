import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Terms of Use - KNEX" };

export default function TermsPage() {
    return (
        <InfoPageLayout title="Terms of Use" subtitle="Last updated: February 2026">
            <Section title="Acceptance of Terms">
                <p>By accessing and using KNEX, you agree to be bound by these terms and conditions.</p>
            </Section>
            <Section title="User Accounts">
                <p>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
            </Section>
            <Section title="Orders and Payments">
                <p>All orders are subject to product availability. Prices are in BDT and may change without notice.</p>
            </Section>
            <Section title="Prohibited Activities">
                <ul className="list-disc list-inside space-y-1">
                    <li>Fraudulent transactions</li>
                    <li>Misuse of promotional offers</li>
                    <li>Violation of intellectual property rights</li>
                </ul>
            </Section>
            <Section title="Limitation of Liability">
                <p>KNEX shall not be liable for any indirect, incidental, or consequential damages arising from use of our services.</p>
            </Section>
        </InfoPageLayout>
    );
}
