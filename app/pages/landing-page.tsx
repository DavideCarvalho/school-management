import React from "react"
import { BlitzPage } from "blitz"
import { Flex, Heading } from "@chakra-ui/react"
import Layout from "../core/layouts/Layout"
import FirstHero from "../core/components/FirstHero"
import TeacherHero from "../core/components/TeacherHero"
import ParentsHero from "app/core/components/ParentsHero"

const LandingPage: BlitzPage = () => {
  return (
    <>
      <Flex width="full" h="100vh" align="center" justifyContent="center">
        <FirstHero
          title={"Automatize seu diário escolar"}
          subtitle={`Com o App, você e sua escola podem automatizar seu diário escolar e podem ter um lugar super integrado onde pais, filhos e escola podem trabalhar juntos`}
          image={"/slime-2.png"}
          ctaText={"Create your account now"}
          ctaLink={"/login"}
        />
      </Flex>
      <Flex width="full" align="center" justifyContent="center" bg="#0066FF">
        <Heading
          as="h1"
          size="3xl"
          fontWeight="bold"
          color="white"
          mt="30px"
          textAlign={["center", "center", "left", "left"]}
        >
          O que você ganha?
        </Heading>
      </Flex>
      <Flex width="full" align="center" justifyContent="center" bg="#0066FF" h="70vh">
        <TeacherHero
          mt="2%"
          title={"Professores"}
          subtitle={`Oferecemos aos professores um ambiente online para registrar todas as aulas`}
          image={"/professor-1.png"}
        />
      </Flex>
      <Flex width="full" align="center" justifyContent="center" bg="#0066FF" h="70vh">
        <ParentsHero
          title={"Pais"}
          subtitle={`Fiquem de olho nas notas dos seus filhos`}
          image={"/fatherhood.svg"}
        />
      </Flex>
    </>
  )
}

LandingPage.suppressFirstRenderFlicker = true
LandingPage.getLayout = (page) => <Layout title="Landing Page">{page}</Layout>

export default LandingPage
