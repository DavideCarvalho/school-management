import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getClassrooms from "app/school/classrooms/queries/getClassrooms"

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

  return (
    <div>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>
            <Link href={`/classrooms/${classroom.id}`}>
              <a>{classroom.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ClassroomsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Classrooms</title>
      </Head>

      <div>
        <p>
          <Link href="/classrooms/new">
            <a>Create Classroom</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ClassroomsList />
        </Suspense>
      </div>
    </>
  )
}

ClassroomsPage.authenticate = true
ClassroomsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ClassroomsPage
