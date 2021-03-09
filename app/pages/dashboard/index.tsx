import React from "react"
import { BlitzPage } from "blitz"
import Layout from "../../core/layouts/Layout"
import { Box, Flex, Heading, Center } from "@chakra-ui/react"
import { DashboardCard } from "./DashboardCard"

const DashboardPage: BlitzPage = () => {
  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <Box>
        <Center m="5%">
          <Heading>Dashboard</Heading>
        </Center>
        <Flex w="full">
          <DashboardCard
            title="Administração"
            buttonsLabels={["materias", "salas", "professores", "alunos"]}
            buttonsLinks={["/subjects"]}
          />
          <DashboardCard
            title="Professores"
            buttonsLabels={["aulas", "alunos"]}
            buttonsLinks={["/"]}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

DashboardPage.suppressFirstRenderFlicker = true
DashboardPage.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default DashboardPage
