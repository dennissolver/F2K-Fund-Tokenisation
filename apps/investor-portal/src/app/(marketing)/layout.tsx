import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-off-white font-archivo">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
