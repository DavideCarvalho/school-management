import { BlitzPage, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import createStudent from "app/school/students/mutations/createStudent"
import { FORM_ERROR, StudentForm } from "app/school/students/components/StudentForm"
import { Suspense } from "react"
import { Center, Flex, Heading, useToast } from "@chakra-ui/react"

const NewStudentPage: BlitzPage = () => {
  const toast = useToast()
  const router = useRouter()
  const [createStudentMutation] = useMutation(createStudent)

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Adicionar novo aluno
          </Heading>
        </Center>

        <Suspense fallback={<div>Carregando...</div>}>
          <StudentForm
            submitText="Adicionar aluno"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateStudent}
            initialValues={{
              name: "",
              rm: "",
              email: "",
              accountableName: "",
              accountableEmail: "",
              classroomId: "",
            }}
            onSubmit={async (values) => {
              try {
                await createStudentMutation(values)
                toast({
                  title: "Aluno adicionado!",
                  description: "Aluno adicionado com sucesso!",
                  status: "success",
                  isClosable: true,
                })
                await router.push(`/alunos`)
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </Flex>
  )
}

NewStudentPage.authenticate = true
NewStudentPage.getLayout = (page) => <Layout title={"Create New Student"}>{page}</Layout>

export default NewStudentPage
