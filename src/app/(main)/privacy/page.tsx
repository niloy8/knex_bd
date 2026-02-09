import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Privacy Policy - KNEX" };

export default function PrivacyPage() {
    return (
        <InfoPageLayout title="Privacy Policy" subtitle="Last updated: February 2026">
            <Section title="Information We Collect">
                <p>We collect information you provide directly: name, email, phone number, and delivery address when you create an account or place an order.</p>
            </Section>
            <Section title="How We Use Your Information">
                <ul className="list-disc list-inside space-y-1">
                    <li>Process and deliver your orders</li>
                    <li>Send order updates and notifications</li>
                    <li>Improve our services</li>
                    <li>Respond to your inquiries</li>
                </ul>
            </Section>
            <Section title="Data Security">
                <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
            </Section>
            <Section title="Contact">
                <p>For privacy concerns, email us at privacy@knex.com.bd</p>
            </Section>
        </InfoPageLayout>
    );
}
