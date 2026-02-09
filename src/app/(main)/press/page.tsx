import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Press - KNEX" };

export default function PressPage() {
    return (
        <InfoPageLayout title="Press" subtitle="Media resources and news">
            <Section title="Press Inquiries">
                <p>For media inquiries, please contact our PR team at press@knex.com.bd</p>
            </Section>
            <Section title="Brand Assets">
                <p>Our brand guidelines and logo assets are available upon request for authorized media use.</p>
            </Section>
            <Section title="Recent News">
                <p>Stay tuned for our latest announcements and press releases.</p>
            </Section>
        </InfoPageLayout>
    );
}
