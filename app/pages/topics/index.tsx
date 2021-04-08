import React, { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation, useSession } from "blitz"
import { formatDistance } from "date-fns"
import { ptBR } from "date-fns/locale"
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
import getTopics from "app/school/topics/queries/getTopics"
import deleteTopic from "app/school/topics/mutations/deleteTopic"

const ITEMS_PER_PAGE = 100

export const TopicsList = () => {
  const session = useSession()
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ topics, hasMore }] = usePaginatedQuery(getTopics, {
    orderBy: { date: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const [deleteTopicMutation] = useMutation(deleteTopic)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  const isProfessor = session.role !== "PROFESSOR"

  return (
    <div>
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            {!isProfessor && <Th>Nome do professor</Th>}
            <Th>Dia</Th>
            <Th>Descrição</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {topics.map((topic) => (
            <Tr key={topic.id}>
              {!isProfessor && <Td>{topic.Professor.User.name}</Td>}
              <Td>{formatDistance(topic.date, new Date(), { addSuffix: true, locale: ptBR })}</Td>
              <Td>{topic.description}</Td>
              <Td>
                <div>
                  <Link href={`/topics/${topic.id}`}>
                    <IconButton aria-label="editar sala" icon={<EditIcon />} colorScheme="blue" />
                  </Link>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm("Tem certeza que deseja apagar esse conteúdo?")) {
                        await deleteTopicMutation({ id: topic.id })
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
        <Link href="/topics/new">
          <Button colorScheme="blue">Criar matéria</Button>
        </Link>
      </Flex>
    </div>
  )
}

const TopicsPage: BlitzPage = () => {
  return (
    <Flex width="full" h="100%" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Matérias</title>
        </Head>
        <Center mb="10px">
          <Heading as="h3" size="lg">
            Aulas
          </Heading>
        </Center>
        <Suspense fallback={<div>Loading...</div>}>
          <TopicsList />
        </Suspense>
      </div>
    </Flex>
  )
}

TopicsPage.authenticate = { redirectTo: "/login" }
TopicsPage.suppressFirstRenderFlicker = true
TopicsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TopicsPage
