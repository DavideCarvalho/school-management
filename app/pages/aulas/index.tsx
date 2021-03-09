import React, { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getSubjects from "app/school/subjects/queries/getSubjects"
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  IconButton,
  Button,
  Heading,
  Center,
} from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons"
import deleteSubject from "../../school/subjects/mutations/deleteSubject"

const ITEMS_PER_PAGE = 5

export const SubjectsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ subjects, hasMore }] = usePaginatedQuery(getSubjects, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const [deleteSubjectMutation] = useMutation(deleteSubject)

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
          {subjects.map((subject) => (
            <Tr key={subject.id}>
              <Td>{subject.name}</Td>
              <Td>
                <div>
                  <Link href={`/aulas/${subject.id}/editar`}>
                    <IconButton aria-label="editar aula" icon={<EditIcon />} colorScheme="blue" />
                  </Link>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm("This will be deleted")) {
                        await deleteSubjectMutation({ id: subject.id })
                        router.push("/subjects")
                      }
                    }}
                    ml="5px"
                    aria-label="excluir aula"
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
        <Link href="/aulas/nova">
          <Button colorScheme="blue">Criar aula</Button>
        </Link>
      </Flex>
    </div>
  )
}

const SubjectsPage: BlitzPage = () => {
  return (
    <Flex width="full" h="100%" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Subjects</title>
        </Head>
        <Center mb="10px">
          <Heading as="h3" size="lg">
            Aulas
          </Heading>
        </Center>
        <Suspense fallback={<div>Loading...</div>}>
          <SubjectsList />
        </Suspense>
      </div>
    </Flex>
  )
}

SubjectsPage.authenticate = true
SubjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default SubjectsPage
