import React, { Suspense } from "react"
import { BlitzPage, Head, useMutation, useParam, useQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProfessorBySlug from "app/school/professors/queries/getProfessorBySlug"
import updateProfessor from "app/school/professors/mutations/updateProfessor"
import { FORM_ERROR, ProfessorForm } from "app/school/professors/components/ProfessorForm"
import { Center, Flex, Heading, useToast } from "@chakra-ui/react"

export const EditProfessor = () => {
  const toast = useToast()
  const router = useRouter()
  const professorSlug = useParam("professorSlug", "string")
  const [professor, { refetch: refetchProfessor }] = useQuery(getProfessorBySlug, {
    slug: professorSlug!,
  })
  let subjects: { label: string; value: string }[][] = []
  let intermediateClassrooms: { label: string; value: string }[][] = []
  let classrooms: any = []
  professor.ProfessorsOnClassrooms.forEach(({ Classroom, Subject }) => {
    const subjectAlreadyInserted = subjects.find((subject) =>
      subject.some(({ value }) => value === Subject.id)
    )
    if (!subjectAlreadyInserted) {
      subjects = [...subjects, [{ label: Subject.name, value: Subject.id }]]
      intermediateClassrooms = [
        ...intermediateClassrooms,
        [{ label: Classroom.name, value: Classroom.id }],
      ]
      return
    }
    const index = subjects.indexOf(subjectAlreadyInserted)
    intermediateClassrooms[index] = [
      ...intermediateClassrooms[index],
      { label: Classroom.name, value: Classroom.id },
    ]
  })
  intermediateClassrooms.forEach((row, index) => {
    intermediateClassrooms.forEach((_row, _index) => {
      if (index === _index) return
      const isEqual = _row.reduce((acc, item) => {
        if (!acc) return acc
        acc = _row.some(({ value }) => value === item.value)
        return acc
      }, true)
      if (!isEqual) return
      subjects[index] = [...subjects[index], ...subjects[_index]]
      classrooms[index] = row
      intermediateClassrooms.splice(_index, 1)
      subjects.splice(_index, 1)
    })
  })
  const [updateProfessorMutation] = useMutation(updateProfessor)

  return (
    <>
      <Head>
        <title>Atualizar Professor {professor.User.name}</title>
      </Head>

      <div>
        <ProfessorForm
          submitText="Atualizar professor"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateProfessor}
          initialValues={{
            name: professor.User.name,
            email: professor.User.email,
            selectedSubjects: subjects,
            selectedClassrooms: classrooms,
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
              await updateProfessorMutation({
                slug: professorSlug!,
                name: values.name,
                email: values.email,
                classroomsWithSubjects,
              })
              await refetchProfessor()
              toast({
                title: "Professor editado!",
                description: "Professor editado com sucesso!",
                status: "success",
                isClosable: true,
              })
              await router.push(`/professores`)
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

const EditProfessorPage: BlitzPage = () => {
  return (
    <Flex width="full" h="70vh" align="center" justifyContent="center">
      <div>
        <Center mb="10px">
          <Heading as="h5" size="sm">
            Editar professor
          </Heading>
        </Center>
        <Suspense fallback={<div>Carregando professor...</div>}>
          <EditProfessor />
        </Suspense>
      </div>
    </Flex>
  )
}

EditProfessorPage.authenticate = true
EditProfessorPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProfessorPage
