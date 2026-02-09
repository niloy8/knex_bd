import InfoPageLayout, { Section } from "@/components/InfoPageLayout";

export const metadata = { title: "Shipping - KNEX" };

export default function ShippingPage() {
    return (
        <InfoPageLayout title="Shipping" subtitle="Delivery information">
            <Section title="Delivery Areas">
                <p>We deliver to all districts across Bangladesh.</p>
            </Section>
            <Section title="Delivery Charges">
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Inside Dhaka:</strong> Tk 80</li>
                    <li><strong>Outside Dhaka:</strong> Tk 150</li>
                </ul>
            </Section>
            <Section title="Delivery Time">
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Inside Dhaka:</strong> 1-2 business days</li>
                    <li><strong>Outside Dhaka:</strong> 3-5 business days</li>
                </ul>
            </Section>
            <Section title="Order Tracking">
                <p>Track your order status from your account&apos;s &quot;My Orders&quot; section.</p>
            </Section>
        </InfoPageLayout>
    );
}
