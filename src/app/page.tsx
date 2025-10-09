import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function Home() {
  return (
    <Container>
      <Sidebar />
      <MainContentContainer>
        <Card>
          <h2>Welcome</h2>
          <Divider height={4} width={240} />
          <p>
            Welcome to your Kitchen Tools Dashboard! Here you’ll find a
            collection of handy tools to make daily operations easier. From
            generating food delivery reports and planning specials to tracking
            sales performance. Everything you need to keep your kitchen running
            at its best, all in one place.
          </p>
        </Card>
        <div className="home__quick-links">
          <Card textAlign="center" grow={true}>
            <h2>FDT</h2>
            <p>Food Delivery Times</p>
            <Button href="/fdt">Go to FDT</Button>
          </Card>
          <Card textAlign="center" grow={true}>
            <h2>Specials</h2>
            <p>Weekly Specials Planner</p>
            <Button href="/specials" disabled>
              Go to Specials
            </Button>
          </Card>
          <Card textAlign="center" grow={true}>
            <h2>Sales</h2>
            <p>Sales Performance Tracker</p>
            <Button>Go to Sales</Button>
          </Card>
        </div>
      </MainContentContainer>
    </Container>
  );
}
