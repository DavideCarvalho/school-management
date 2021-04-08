import { BlitzPage, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import createClassroom from "app/school/classrooms/mutations/createClassroom"
import { ClassroomForm, FORM_ERROR } from "app/school/classrooms/components/ClassroomForm"
import { Center, Flex, Heading, useToast } from "@chakra-ui/react"

const NewClassroomPage: BlitzPage = () => {
  const toast = useToast()
  const router = useRouter()
  const [createClassroomMutation] = useMutation(createClassroom)

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Criar nova sala
          </Heading>
        </Center>

        <ClassroomForm
          submitText="Criar sala"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateClassroom}
          initialValues={{
            name: "",
          }}
          onSubmit={async (values) => {
            try {
              await createClassroomMutation(values)
              toast({
                title: "Sala adicionada!",
                description: "Sala adicionada com sucesso!",
                status: "success",
                isClosable: true,
              })
              await router.push(`/salas`)
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

NewClassroomPage.authenticate = true
NewClassroomPage.getLayout = (page) => <Layout title={"Create New Classroom"}>{page}</Layout>

export default NewClassroomPage
