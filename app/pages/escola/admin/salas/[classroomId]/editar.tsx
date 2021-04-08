import { Suspense } from "react"
import { BlitzPage, Head, useMutation, useParam, useQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import getClassroom from "app/school/classrooms/queries/getClassroom"
import updateClassroom from "app/school/classrooms/mutations/updateClassroom"
import { ClassroomForm, FORM_ERROR } from "app/school/classrooms/components/ClassroomForm"
import { Flex, useToast } from "@chakra-ui/react"

export const EditClassroom = () => {
  const toast = useToast()
  const router = useRouter()
  const classroomId = useParam("classroomId", "string")
  const [classroom] = useQuery(getClassroom, { id: classroomId! })
  const [updateClassroomMutation] = useMutation(updateClassroom)

  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Head>
          <title>Editar sala</title>
        </Head>

        <ClassroomForm
          submitText="Atualizar Sala"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateClassroom}
          initialValues={classroom}
          onSubmit={async (values) => {
            try {
              await updateClassroomMutation({
                id: classroom.id,
                ...values,
              })
              toast({
                title: "Sala editada!",
                description: "Sala editada com sucesso!",
                status: "success",
                isClosable: true,
              })
              await router.push(`/escola/admin/salas`)
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

const EditClassroomPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditClassroom />
      </Suspense>
    </div>
  )
}

EditClassroomPage.authenticate = { redirectTo: "/login" }
EditClassroomPage.suppressFirstRenderFlicker = true
EditClassroomPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditClassroomPage
