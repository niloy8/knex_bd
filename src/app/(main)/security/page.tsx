import InfoPageLayout, { Section } from "@/components/InfoPageLayout";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export const metadata = { title: "Security - KNEX" };

export default function SecurityPage() {
    return (
        <InfoPageLayout title="Security" subtitle="How we keep you safe">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                    { icon: Lock, title: "Secure Login", desc: "Firebase authentication protects your account" },
                    { icon: Shield, title: "Data Protection", desc: "Your data is encrypted and securely stored" },
                    { icon: Eye, title: "Privacy First", desc: "We never share your data with third parties" },
                    { icon: AlertTriangle, title: "Fraud Prevention", desc: "Advanced systems detect suspicious activity" },
                ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
                            <p className="text-xs text-gray-600">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Section title="Tips to Stay Safe">
                <ul className="list-disc list-inside space-y-1">
                    <li>Never share your password with anyone</li>
                    <li>Use a strong, unique password</li>
                    <li>Log out after using shared devices</li>
                    <li>Report suspicious emails claiming to be from KNEX</li>
                </ul>
            </Section>
        </InfoPageLayout>
    );
}
