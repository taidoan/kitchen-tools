import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function Home() {
  return (
    <Container>
      <Sidebar />
      <MainContentContainer>
        <Card>
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <Divider height={4} width={240} />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            dignissimos sed quisquam odit voluptates earum officia quasi at.
            Tempore possimus aperiam laudantium voluptates velit, accusamus
            earum quos architecto accusantium in? Quos quaerat quae perferendis
            doloremque praesentium dolores voluptates exercitationem vitae
            minima cupiditate nobis soluta qui, minus fuga quasi itaque maiores
            sit temporibus dolor, debitis architecto cumque eligendi. Eveniet,
            quo tenetur. Iure laudantium quibusdam mollitia. Optio inventore
            maxime repudiandae facere delectus dolor nihil provident. Quidem a
            dolores eos. Qui voluptatibus ex et, voluptatem possimus explicabo.
            Atque voluptas labore minus corrupti aspernatur. Recusandae
            quibusdam non modi officia dolores quidem quo neque ad, voluptas
            fugiat doloribus vitae, dolor ipsum maxime accusamus maiores labore
            a alias illum, fugit iure voluptatibus aperiam voluptatum provident.
            At.
          </p>
        </Card>
      </MainContentContainer>
    </Container>
  );
}
