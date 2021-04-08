import { Suspense } from "react"
import { BlitzPage, Head, Link, useMutation, useParam, useQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStudent from "app/school/students/queries/getStudent"
import deleteStudent from "app/school/students/mutations/deleteStudent"

export const Student = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [deleteStudentMutation] = useMutation(deleteStudent)
  const [student] = useQuery(getStudent, { slug: slug! })

  return (
    <>
      <Head>
        <title>Student {student.slug}</title>
      </Head>

      <div>
        <h1>Student {student.slug}</h1>
        <pre>{JSON.stringify(student, null, 2)}</pre>

        <Link href={`/students/${student.slug}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            // if (window.confirm("This will be deleted")) {
            //   await deleteStudentMutation({ id: student.id })
            //   router.push("/students")
            // }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowStudentPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/students">
          <a>Students</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Student />
      </Suspense>
    </div>
  )
}

ShowStudentPage.authenticate = true
ShowStudentPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowStudentPage
