import React, { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation, useSession } from "blitz"
import { Flex, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
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

  return (
    <div>
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            {session.role !== "PROFESSOR" && <Th>Nome do professor</Th>}
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {topics.map((topic) => (
            <Tr key={topic.id}>
              {session.role !== "PROFESSOR" && <Td>{topic.Professor.User.name}</Td>}
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
    </div>
  )
}

const TopicsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Topics</title>
      </Head>

      <div>
        <p>
          <Link href="/topics/new">
            <a>Create Topic</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <TopicsList />
        </Suspense>
      </div>
    </>
  )
}

TopicsPage.authenticate = true
TopicsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TopicsPage
