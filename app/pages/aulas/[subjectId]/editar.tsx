import React, { Suspense } from "react"
import { useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getSubject from "app/school/subjects/queries/getSubject"
import updateSubject from "app/school/subjects/mutations/updateSubject"
import { SubjectForm, FORM_ERROR } from "app/school/subjects/components/SubjectForm"
import { Center, Flex, Heading } from "@chakra-ui/react"

export const EditSubject = () => {
  const router = useRouter()
  const subjectId = useParam("subjectId", "number")
  const [subject, { setQueryData }] = useQuery(getSubject, { id: subjectId })
  const [updateSubjectMutation] = useMutation(updateSubject)

  return (
    <>
      <div>
        <SubjectForm
          submitText="Editar aula"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateSubject}
          initialValues={subject}
          onSubmit={async (values) => {
            try {
              const updated = await updateSubjectMutation({
                id: subject.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/subjects`)
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

const EditSubjectPage: BlitzPage = () => {
  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Editar aula
          </Heading>
        </Center>
        <Suspense fallback={<div>Loading...</div>}>
          <EditSubject />
        </Suspense>
      </div>
    </Flex>
  )
}

EditSubjectPage.authenticate = true
EditSubjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditSubjectPage
