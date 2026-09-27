import { Card, Divider, QuickLink } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Card>
        <div className="page__heading">
          <h2>Welcome</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Tools for day-to-day kitchen work: food delivery times, specials,
          like-for-like sales, top sellers and wastage. Pick a tool below to
          get started.
        </p>
      </Card>
      <div className="home__quick-links">
        <QuickLink
          title="FDT"
          description="Food delivery times"
          icon="fdt"
          href="/productivity"
          cta="Open"
        />
        <QuickLink
          title="Specials"
          description="Build a specials menu"
          icon="special"
          href="/specials"
          cta="Open"
        />
        <QuickLink
          title="LFL"
          description="Like-for-like sales"
          icon="lfl"
          href="/lfl"
          cta="Open"
        />
        <QuickLink
          title="Sales"
          description="Top products by qty and sales"
          icon="sales"
          href="/sales"
          cta="Open"
        />
        <QuickLink
          title="Wastage"
          description="Wastage report"
          icon="wastage"
          href="/wastage"
          cta="Open"
        />
      </div>
    </>
  );
}
