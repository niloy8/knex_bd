import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Corporate Information - KNEX" };

export default function CorporatePage() {
    return (
        <InfoPageLayout title="Corporate Information" subtitle="Company details">
            <Section title="Registered Name">
                <p>KNEX Bangladesh Limited</p>
            </Section>
            <Section title="Registered Address">
                <p>Dhaka, Bangladesh</p>
            </Section>
            <Section title="Registration">
                <p>Registered under the laws of Bangladesh</p>
            </Section>
        </InfoPageLayout>
    );
}
