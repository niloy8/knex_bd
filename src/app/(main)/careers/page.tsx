import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Careers - KNEX" };

export default function CareersPage() {
    return (
        <InfoPageLayout title="Careers" subtitle="Join our growing team">
            <Section title="Why Work With Us?">
                <p>At KNEX, we believe in fostering innovation, growth, and a collaborative work environment.</p>
            </Section>
            <Section title="Current Openings">
                <p>We&apos;re always looking for talented individuals. Check back soon for open positions or send your resume to careers@knex.com.bd</p>
            </Section>
            <Section title="Benefits">
                <ul className="list-disc list-inside space-y-1">
                    <li>Competitive salary</li>
                    <li>Health insurance</li>
                    <li>Flexible working hours</li>
                    <li>Growth opportunities</li>
                </ul>
            </Section>
        </InfoPageLayout>
    );
}
