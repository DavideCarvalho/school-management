import React, { Suspense } from "react"
import { BlitzPage, Head, Link, useMutation, usePaginatedQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStudents from "app/school/students/queries/getStudents"
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
import deleteStudent from "app/school/students/mutations/deleteStudent"

const ITEMS_PER_PAGE = 100

export const StudentsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ students, hasMore }] = usePaginatedQuery(getStudents, {
    orderBy: { userId: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const [deleteStudentMutation] = useMutation(deleteStudent)

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
          {students.map((student) => (
            <Tr key={student.userId}>
              <Td>{student.User.name}</Td>
              <Td>
                <div>
                  <Link href={`/alunos/${student.slug}/editar`}>
                    <IconButton aria-label="editar aluno" icon={<EditIcon />} colorScheme="blue" />
                  </Link>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm("Tem certeza que deseja apagar esse aluno?")) {
                        await deleteStudentMutation({ userId: student.userId })
                        await router.push("/alunos")
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
        <Link href="/escola/admin/alunos/novo">
          <Button colorScheme="blue">Adicionar aluno</Button>
        </Link>
      </Flex>
    </div>
  )
}

const StudentsPage: BlitzPage = () => {
  return (
    <Flex width="full" h="70%" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Alunos</title>
        </Head>
        <Center mb="10px">
          <Heading as="h3" size="lg">
            Alunos
          </Heading>
        </Center>
        <Suspense fallback={<div>Carregando alunos...</div>}>
          <StudentsList />
        </Suspense>
      </div>
    </Flex>
  )
}

StudentsPage.authenticate = { redirectTo: "/login" }
StudentsPage.suppressFirstRenderFlicker = true
StudentsPage.getLayout = (page) => <Layout>{page}</Layout>

export default StudentsPage
