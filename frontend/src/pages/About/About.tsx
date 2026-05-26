import { Container, Heading, Text } from '@chakra-ui/react'

export default function About() {
  return (
    <Container maxW="600px" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
      <Heading size="lg" mb={4}>
        about me
      </Heading>
      <Text color="text.muted" fontSize="md" lineHeight="1.75">
        I am Nishant, a Software Engineer by profession, trying to find a way to
        express while boasting my tech skills via this blog, lol.
      </Text>
    </Container>
  );
}
