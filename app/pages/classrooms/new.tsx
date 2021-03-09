import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createClassroom from "app/school/classrooms/mutations/createClassroom"
import { ClassroomForm, FORM_ERROR } from "app/school/classrooms/components/ClassroomForm"

const NewClassroomPage: BlitzPage = () => {
  const router = useRouter()
  const [createClassroomMutation] = useMutation(createClassroom)

  return (
    <div>
      <h1>Create New Classroom</h1>

      <ClassroomForm
        submitText="Create Classroom"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateClassroom}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const classroom = await createClassroomMutation(values)
            router.push(`/classrooms/${classroom.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/classrooms">
          <a>Classrooms</a>
        </Link>
      </p>
    </div>
  )
}

NewClassroomPage.authenticate = true
NewClassroomPage.getLayout = (page) => <Layout title={"Create New Classroom"}>{page}</Layout>

export default NewClassroomPage
