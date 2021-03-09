import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getClassroom from "app/school/classrooms/queries/getClassroom"
import deleteClassroom from "app/school/classrooms/mutations/deleteClassroom"

export const Classroom = () => {
  const router = useRouter()
  const classroomId = useParam("classroomId", "number")
  const [deleteClassroomMutation] = useMutation(deleteClassroom)
  const [classroom] = useQuery(getClassroom, { id: classroomId })

  return (
    <>
      <Head>
        <title>Classroom {classroom.id}</title>
      </Head>

      <div>
        <h1>Classroom {classroom.id}</h1>
        <pre>{JSON.stringify(classroom, null, 2)}</pre>

        <Link href={`/classrooms/${classroom.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteClassroomMutation({ id: classroom.id })
              router.push("/classrooms")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowClassroomPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/classrooms">
          <a>Classrooms</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Classroom />
      </Suspense>
    </div>
  )
}

ShowClassroomPage.authenticate = true
ShowClassroomPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowClassroomPage
