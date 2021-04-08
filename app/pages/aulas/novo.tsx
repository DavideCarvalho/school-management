import { BlitzPage, useMutation, useRouter } from "blitz"
import { Center, Flex, Heading, useToast } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import createSubject from "app/school/subjects/mutations/createSubject"
import { FORM_ERROR, SubjectForm } from "app/school/subjects/components/SubjectForm"

const NewSubjectPage: BlitzPage = () => {
  const toast = useToast()
  const router = useRouter()
  const [createSubjectMutation] = useMutation(createSubject)

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Criar nova aula
          </Heading>
        </Center>

        <SubjectForm
          submitText="Criar aula"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateSubject}
          initialValues={{ name: "" }}
          onSubmit={async (values) => {
            try {
              await createSubjectMutation(values)
              toast({
                title: "Aula adicionada!",
                description: "Aula adicionada com sucesso!",
                status: "success",
                isClosable: true,
              })
              await router.push(`/aulas`)
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

NewSubjectPage.authenticate = true
NewSubjectPage.getLayout = (page) => <Layout title={"Criar nova aula"}>{page}</Layout>

export default NewSubjectPage
