import { Container } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <Container>
      <Sidebar />
      <main>
        <h1>Welcome</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae et
          obcaecati facilis quos possimus sequi voluptatem ratione doloremque
          maxime provident ab, consequuntur, pariatur quisquam necessitatibus
          fugiat dignissimos expedita. Mollitia, provident. Officia, corporis
          nam explicabo quas libero aut distinctio ipsa rem modi, officiis,
          laborum in! Hic officiis maiores laborum ipsam alias, aliquid
          necessitatibus odit inventore fugit voluptatum consectetur! Quos,
          provident explicabo. Neque accusamus esse voluptas eligendi quibusdam
          dolore quaerat consequatur sed, ullam vel ab expedita perferendis at
          doloremque nam maiores, commodi odit incidunt fugiat! Ipsa a et, quo
          rerum alias asperiores.
        </p>
        <input type="text" placeholder="Input field" />
        <textarea placeholder="Textarea field" />
      </main>
    </Container>
  );
}
