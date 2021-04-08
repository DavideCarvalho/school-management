import React, { Suspense } from "react"
import { BlitzPage, Head, Link, useMutation, usePaginatedQuery, useRouter } from "blitz"
import {
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import Layout from "app/core/layouts/Layout"
import getClassrooms from "app/school/classrooms/queries/getClassrooms"
import deleteClassroom from "app/school/classrooms/mutations/deleteClassroom"

const ITEMS_PER_PAGE = 100

export const ClassroomsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ classrooms, hasMore }] = usePaginatedQuery(getClassrooms, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const [deleteClassroomMutation] = useMutation(deleteClassroom)

  return (
    <div>
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {classrooms.map((classroom) => (
            <Tr key={classroom.id}>
              <Td>{classroom.name}</Td>
              <Td>
                <div>
                  <Link href={`/salas/${classroom.id}/editar`}>
                    <IconButton aria-label="editar sala" icon={<EditIcon />} colorScheme="blue" />
                  </Link>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm("Tem certeza que deseja apagar essa sala?")) {
                        await deleteClassroomMutation({ id: classroom.id })
                        await router.push("/salas")
                      }
                    }}
                    ml="5px"
                    aria-label="excluir sala"
                    icon={<DeleteIcon />}
                    colorScheme="blue"
                  />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex mt="10px" width="full" align="center" justifyContent="center">
        <IconButton
          mr="5px"
          colorScheme="blue"
          disabled={page === 0}
          onClick={goToPreviousPage}
          aria-label="pagina anterior"
          icon={<ArrowBackIcon />}
        />

        <IconButton
          ml="5px"
          colorScheme="blue"
          disabled={!hasMore}
          onClick={goToNextPage}
          aria-label="proxima pagina"
          icon={<ArrowForwardIcon />}
        />
      </Flex>

      <Flex mt="5px" width="full" align="center" justifyContent="center">
        <Link href="/escola/admin/salas/novo">
          <Button colorScheme="blue">Criar sala</Button>
        </Link>
      </Flex>
    </div>
  )
}

const ClassroomsPage: BlitzPage = () => {
  return (
    <Flex width="full" h="100%" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Salas</title>
        </Head>
        <Center mb="10px">
          <Heading as="h3" size="lg">
            Salas
          </Heading>
        </Center>
        <Suspense fallback={<div>Carregando salas...</div>}>
          <ClassroomsList />
        </Suspense>
      </div>
    </Flex>
  )
}

ClassroomsPage.authenticate = { redirectTo: "/login" }
ClassroomsPage.suppressFirstRenderFlicker = true
ClassroomsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ClassroomsPage
