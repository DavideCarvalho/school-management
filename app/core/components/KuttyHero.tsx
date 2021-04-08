import React from "react"
import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react"

const KuttyHero = () => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacing={0}
      _after={{
        bg: "brand.500",
        opacity: 0.25,
        pos: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
        content: '" "',
      }}
    >
      <Flex
        direction="column"
        alignItems="start"
        justifyContent="center"
        px={{ base: 4, lg: 20 }}
        py={24}
      >
        <Badge
          color="white"
          px={3}
          py={1}
          mb={3}
          variant="solid"
          colorScheme="brand"
          rounded="full"
        >
          Pre Beta
        </Badge>
        <chakra.h1
          mb={6}
          fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          color={useColorModeValue("brand.600", "gray.300")}
          lineHeight="shorter"
        >
          Garanta que sua escola chegue mais rápido aos pais e alunos.
        </chakra.h1>
        <chakra.form w="full" mb={6}>
          <VisuallyHidden>Your Email</VisuallyHidden>
          <Box display={{ base: "block", lg: "none" }}>
            <Input
              size="lg"
              color="brand.900"
              type="email"
              placeholder="Enter your email..."
              bg="white"
              required={true}
            />
            <Button
              w="full"
              mt={2}
              color="white"
              variant="solid"
              colorScheme="brand"
              size="lg"
              type="submit"
            >
              Get Started
            </Button>
          </Box>
          <InputGroup size="lg" w="full" display={{ base: "none", lg: "flex" }}>
            <Input
              size="lg"
              color="brand.900"
              type="email"
              placeholder="Enter your email..."
              bg="white"
              required={true}
            />
            <InputRightElement w="auto">
              <Button
                color="white"
                variant="solid"
                colorScheme="brand"
                size="lg"
                type="submit"
                roundedLeft={0}
              >
                Get Started
              </Button>
            </InputRightElement>
          </InputGroup>
        </chakra.form>
        <chakra.p
          pr={{ base: 0, lg: 16 }}
          mb={4}
          fontSize="sm"
          color={useColorModeValue("brand.600", "gray.400")}
          letterSpacing="wider"
        >
          Somos uma plataforma inovadora de gestão escolar, garantindo uma comunicação direta da
          escola com pais e alunos.
        </chakra.p>
      </Flex>
      <Box>
        <Image
          src="https://nova-escola-producao.s3.amazonaws.com/4ZQNxnN8Z4Aydby3c7pfjY5m5Za6TzKaydrvpA6daU7RGEZDEhsdmTmmHyCp/professor-de-frente-para-classe-getty-images.jpg"
          alt="3 women looking at a laptop"
          fit="cover"
          w="full"
          h={{ base: 64, md: "full" }}
          bg="gray.100"
          loading="lazy"
        />
      </Box>
    </SimpleGrid>
  )
}

export default KuttyHero
