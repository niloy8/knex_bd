import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "About Us - KNEX" };

export default function AboutPage() {
    return (
        <InfoPageLayout title="About Us" subtitle="Learn more about KNEX">
            <Section title="Who We Are">
                <p>KNEX is Bangladesh&apos;s premier online shopping destination, offering a wide range of quality products at competitive prices.</p>
            </Section>
            <Section title="Our Mission">
                <p>To provide customers with a seamless shopping experience, quality products, and exceptional customer service.</p>
            </Section>
            <Section title="Our Vision">
                <p>To become the most trusted e-commerce platform in Bangladesh, making online shopping accessible to everyone.</p>
            </Section>
            <Section title="Contact">
                <p>Email: support@knex.com.bd</p>
                <p>Phone: +880 1XXX-XXXXXX</p>
            </Section>
        </InfoPageLayout>
    );
}
