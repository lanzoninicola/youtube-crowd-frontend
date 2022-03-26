import { Heading, Container, Box } from "@chakra-ui/react";
import Link from "next/link";
import useSwr from "swr";

export default function App() {
  const { data, error } = useSwr(
    "https://jsonplaceholder.typicode.com/users",
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  return (
    <>
      <Container>
        <Heading as="h1">This is the app page</Heading>
        <Link href={"/"}>
          <p>Home</p>
        </Link>
        <Box>
          {error ? <div>failed to load</div> : <div>loading...</div>}
          {data && data.map((user) => <div key={user.id}>{user.name}</div>)}
        </Box>
      </Container>
    </>
  );
}
