
import Footer from "./fotter";
import Header from "./header";
import ConditionalCategoryNav from "@/components/ConditionalCategoryNav";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header></Header>
            <ConditionalCategoryNav />
            {children}
            <Footer></Footer>
        </>
    );
}