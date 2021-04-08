import React from "react"
import { Link } from "blitz"
import { Box, Button, Flex, Heading, Image, Stack } from "@chakra-ui/react"

export default function FirstHero({ title, subtitle, image, ctaLink, ctaText, ...rest }: any) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      h="100vh"
      w="80vw"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack spacing={4} w="50%" align={["center", "center", "flex-start", "flex-start"]}>
        <Heading
          as="h1"
          size="3xl"
          fontWeight="bold"
          color="#0066FF"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Link href={ctaLink}>
          <Button colorScheme="primary" borderRadius="8px" py="4" px="4" lineHeight="1" size="md">
            {ctaText}
          </Button>
        </Link>
        <Box as="button" bg="#0066FF" color="white" borderRadius="5px" h="60px" w="120px">
          Entrar
        </Box>
      </Stack>
      <Box w="50%" mb={{ base: 12, md: 0 }}>
        <Image src={image} size="50%" rounded="1rem" />
      </Box>
    </Flex>
  )
}

FirstHero.defaultProps = {
  title: "React landing page with Chakra UI",
  subtitle: "This is the subheader section where you describe the basic benefits of your product",
  image: "https://source.unsplash.com/collection/404339/800x600",
  ctaText: "Create your account now",
  ctaLink: "/login",
}
