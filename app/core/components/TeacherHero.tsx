import React from "react"
import { Box, Flex, Img, Heading, Stack } from "@chakra-ui/react"

export default function TeacherHero({ title, subtitle, image, ...rest }: any) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      h="100%"
      w="80vw"
      px={8}
      mb={16}
      {...rest}
    >
      <Box boxSize="70%" mb={{ base: 12, md: 0 }}>
        <Img src={image} rounded="1rem" />
      </Box>
      <Stack spacing={4} w="50%" align={["center", "center", "flex-start", "flex-start"]}>
        <Heading
          as="h1"
          size="4xl"
          fontWeight="bold"
          color="white"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="white"
          opacity="0.8"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
      </Stack>
    </Flex>
  )
}

TeacherHero.defaultProps = {
  title: "React landing page with Chakra UI",
  subtitle: "This is the subheader section where you describe the basic benefits of your product",
  image: "https://source.unsplash.com/collection/404339/800x600",
}
