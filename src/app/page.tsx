import { Card, Divider, QuickLink } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Card>
        <h2>Welcome</h2>
        <Divider height={4} width={240} />
        <p>
          Welcome to your Kitchen Tools Dashboard! Here you&apos;ll find a
          collection of handy tools to make daily operations easier. From
          generating food delivery reports and planning specials to tracking
          sales performance. Everything you need to keep your kitchen running at
          its best, all in one place.
        </p>
      </Card>
      <div className="home__quick-links">
        <QuickLink
          title="FDT"
          description="Food Delivery Times"
          icon="fdt"
          href="/productivity"
          cta="Open"
        />
        <QuickLink
          title="Specials"
          description="Specials Generator"
          icon="special"
          href="/specials"
          cta="Generate"
        />
        <QuickLink
          title="Sales"
          description="Top Sales Report"
          icon="sales"
          href="/sales"
          cta="View"
        />
        <QuickLink
          title="Wastage"
          description="Wastage Report"
          icon="wastage"
          href="/wastage"
          cta="Analyze"
        />
      </div>
    </>
  );
}
