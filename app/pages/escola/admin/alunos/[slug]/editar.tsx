import { Suspense } from "react"
import { BlitzPage, Head, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Flex, useToast } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getStudent from "app/school/students/queries/getStudent"
import updateStudent from "app/school/students/mutations/updateStudent"
import { FORM_ERROR, StudentForm } from "app/school/students/components/StudentForm"

export const EditStudent = () => {
  const toast = useToast()
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [student, { refetch: refetchStudent }] = useQuery(getStudent, { slug: slug! })
  const [updateStudentMutation] = useMutation(updateStudent)

  const formValues = {
    name: student.User.name,
    rm: student.User.login,
    accountableName: student.Accountable.User.name,
    accountableEmail: student.Accountable.User.email,
    classroomId: student.classroomId,
  }

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <Head>
        <title>Editar aluno {student.User.name}</title>
      </Head>

      <div>
        <StudentForm
          submitText="Update Student"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateStudent}
          initialValues={formValues}
          onSubmit={async (values) => {
            try {
              await updateStudentMutation({
                ...values,
                studentId: student.userId,
              })
              toast({
                title: "Aluno editado",
                description: "Aluno editado com sucesso!",
                status: "success",
                isClosable: true,
              })
              await refetchStudent()
              await router.push(`/escola/admin/alunos`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </Flex>
  )
}

const EditStudentPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditStudent />
      </Suspense>
    </div>
  )
}

EditStudentPage.authenticate = { redirectTo: "/login" }
EditStudentPage.suppressFirstRenderFlicker = true
EditStudentPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditStudentPage
