import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { KSRSForm } from "@/components/feat/KSRSForm";
import { Divider } from "@/components/ui/Divider";
export default function Productivity() {
  return (
    <Container>
      <Sidebar />
      <MainContentContainer>
        <Card>
          <h2>Food Delivery Times</h2>
          <Divider height={4} width={240} />
          <p>
            This tool generates productivity reports for your kitchens using
            KSRS data. To ensure that colors are retained when printing, please
            enable both &quot;Headers and Footers&quot; and &quot;Background
            Graphics&quot; in your print settings.
          </p>
        </Card>
        <KSRSForm />
      </MainContentContainer>
    </Container>
  );
}
