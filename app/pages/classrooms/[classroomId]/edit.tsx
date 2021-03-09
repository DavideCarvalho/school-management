import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getClassroom from "app/school/classrooms/queries/getClassroom"
import updateClassroom from "app/school/classrooms/mutations/updateClassroom"
import { ClassroomForm, FORM_ERROR } from "app/school/classrooms/components/ClassroomForm"

export const EditClassroom = () => {
  const router = useRouter()
  const classroomId = useParam("classroomId", "number")
  const [classroom, { setQueryData }] = useQuery(getClassroom, { id: classroomId })
  const [updateClassroomMutation] = useMutation(updateClassroom)

  return (
    <>
      <Head>
        <title>Edit Classroom {classroom.id}</title>
      </Head>

      <div>
        <h1>Edit Classroom {classroom.id}</h1>
        <pre>{JSON.stringify(classroom)}</pre>

        <ClassroomForm
          submitText="Update Classroom"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateClassroom}
          initialValues={classroom}
          onSubmit={async (values) => {
            try {
              const updated = await updateClassroomMutation({
                id: classroom.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/classrooms/${updated.id}`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditClassroomPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditClassroom />
      </Suspense>

      <p>
        <Link href="/classrooms">
          <a>Classrooms</a>
        </Link>
      </p>
    </div>
  )
}

EditClassroomPage.authenticate = true
EditClassroomPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditClassroomPage
