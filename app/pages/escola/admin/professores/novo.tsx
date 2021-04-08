import { BlitzPage, useMutation, useRouter } from "blitz"
import { Suspense } from "react"
import { Center, Flex, Heading, useToast } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import createProfessor from "app/school/professors/mutations/createProfessor"
import { FORM_ERROR, ProfessorForm } from "app/school/professors/components/ProfessorForm"

const NewProfessorPage: BlitzPage = () => {
  const toast = useToast()
  const router = useRouter()
  const [createProfessorMutation] = useMutation(createProfessor)

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Adicionar novo professor
          </Heading>
        </Center>

        <Suspense fallback={<div>Carregando...</div>}>
          <ProfessorForm
            submitText="Adicionar Professor"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateProfessor}
            initialValues={{
              name: "",
              email: "",
              selectedSubjects: [[]],
              selectedClassrooms: [[]],
            }}
            onSubmit={async (values) => {
              try {
                let classroomsWithSubjects: { classroomId: string; subjectId: string }[] = []
                values.selectedSubjects.forEach((selectedSubjects, index) => {
                  selectedSubjects.forEach(({ value: subjectId }) => {
                    classroomsWithSubjects = [
                      ...classroomsWithSubjects,
                      ...values.selectedClassrooms[index].map(({ value: classroomId }) => ({
                        subjectId,
                        classroomId,
                      })),
                    ]
                  })
                })
                await createProfessorMutation({
                  ...values,
                  classroomsWithSubjects,
                })
                toast({
                  title: "Professor adicionado!",
                  description: "Professor adicionado com sucesso!",
                  status: "success",
                  isClosable: true,
                })
                await router.push(`/escola/admin/professores`)
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

NewProfessorPage.authenticate = { redirectTo: "/login" }
NewProfessorPage.suppressFirstRenderFlicker = true
NewProfessorPage.getLayout = (page) => <Layout title={"Adicionar novo professor"}>{page}</Layout>

export default NewProfessorPage
