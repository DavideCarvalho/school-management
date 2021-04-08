import React from "react"
import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Box, Center, Flex, Heading } from "@chakra-ui/react"
import { DashboardCard } from "app/core/components/DashboardCard"

const SchoolPage: BlitzPage = () => {
  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <Box>
        <Center m="5%">
          <Heading>Dashboard</Heading>
        </Center>
        <Flex w="full">
          <DashboardCard
            title="Administração"
            buttonsLabels={["matérias", "salas", "professores", "alunos"]}
            buttonsLinks={["/aulas", "/salas", "/professores", "/alunos"]}
          />
          <DashboardCard
            title="Professores"
            buttonsLabels={["conteúdos", "presenças", "observações", "notas"]}
            buttonsLinks={["/topics", "/attendance", "/notes", "/grades"]}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

SchoolPage.authenticate = { redirectTo: "/login" }
SchoolPage.suppressFirstRenderFlicker = true
SchoolPage.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default SchoolPage
