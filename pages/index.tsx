import { Container, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Heading as="h1">This is the home page</Heading>
      <p>lorem ipsum advocata vostra</p>
      <Link href="/app">
        <p>Go to the app page</p>
      </Link>
    </Container>
  );
}
