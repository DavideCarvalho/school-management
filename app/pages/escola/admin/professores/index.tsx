import { Suspense } from "react"
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
import getProfessors from "app/school/professors/queries/getProfessors"
import deleteProfessor from "app/school/professors/mutations/deleteProfessor"

const ITEMS_PER_PAGE = 10

export const ProfessorsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ professors, hasMore }] = usePaginatedQuery(getProfessors, {
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const [deleteProfessorMutation] = useMutation(deleteProfessor)

  return (
    <div>
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Quantidade de salas</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {professors.map((professor) => (
            <Tr key={professor.slug}>
              <Td>{professor.User.name}</Td>
              <Td>{professor.ProfessorsOnClassrooms.length}</Td>
              <Td>
                <div>
                  <Link href={`/professores/${professor.slug}/editar`}>
                    <IconButton aria-label="editar aula" icon={<EditIcon />} colorScheme="blue" />
                  </Link>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm("Tem certeza que deseja apagar essa aula?")) {
                        await deleteProfessorMutation({ userId: professor.User.id })
                        await router.push("/professores")
                      }
                    }}
                    ml="5px"
                    aria-label="excluir professor?"
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
        <Link href="/escola/admin/professores/novo">
          <Button colorScheme="blue">Adicionar professor</Button>
        </Link>
      </Flex>
    </div>
  )
}

const ProfessorsPage: BlitzPage = () => {
  return (
    <Flex width="full" h="80%" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Professores</title>
        </Head>
        <Center mb="10px">
          <Heading as="h3" size="lg">
            Professores
          </Heading>
        </Center>

        <Suspense fallback={<div>Loading...</div>}>
          <ProfessorsList />
        </Suspense>
      </div>
    </Flex>
  )
}

ProfessorsPage.authenticate = { redirectTo: "/login" }
ProfessorsPage.suppressFirstRenderFlicker = true
ProfessorsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProfessorsPage
