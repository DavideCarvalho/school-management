import * as z from "zod"
import { useMutation, usePaginatedQuery } from "blitz"
import { Flex, IconButton } from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledMultiSelectField } from "app/core/components/LabeledMultiSelectField"
import getSubjects from "app/school/subjects/queries/getSubjects"
import createSubject from "app/school/subjects/mutations/createSubject"
import getClassrooms from "app/school/classrooms/queries/getClassrooms"
import createClassroom from "app/school/classrooms/mutations/createClassroom"
import { useField } from "formik"

export { FORM_ERROR } from "app/core/components/Form"

const ITEMS_PER_PAGE = 250

export function ProfessorForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Nome" placeholder="Carlos Gonçalves" />
      <LabeledTextField name="email" label="Email" placeholder="novoprofessor@email.com" />
      <SelectClasses />
    </Form>
  )
}

function SelectClasses() {
  const [selectedSubjectsInput, , { setValue: setSelectedSubjectsValue }] = useField<any[]>(
    "selectedSubjects"
  )
  const [selectedClassroomsInput, , { setValue: setSelectedClassroomsValue }] = useField<any[]>(
    "selectedClassrooms"
  )
  const [createSubjectMutation] = useMutation(createSubject)
  const [createClassroomMutation] = useMutation(createClassroom)
  const [{ subjects }, { refetch: refetchSubjects }] = usePaginatedQuery(getSubjects, {
    orderBy: { name: "asc" },
    skip: 0,
    take: ITEMS_PER_PAGE,
  })
  const selectSubjects = subjects.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }))
  const [{ classrooms }, { refetch: refetchClassrooms }] = usePaginatedQuery(getClassrooms, {
    orderBy: { name: "asc" },
    skip: 0,
    take: ITEMS_PER_PAGE,
  })
  const selectClassrooms = classrooms.map((classroom) => ({
    label: classroom.name,
    value: classroom.id,
  }))
  return (
    <>
      {selectedClassroomsInput.value.map((value, index) => {
        return (
          <Flex key={index}>
            <LabeledMultiSelectField
              name={`selectedSubjects[${index}]`}
              label="Da aula(s) de..."
              placeholder="Matemática"
              items={selectSubjects}
              onCreate={async (item) => {
                await createSubjectMutation({ name: item.value })
                await refetchSubjects()
              }}
            />
            <LabeledMultiSelectField
              name={`selectedClassrooms[${index}]`}
              label="Na(s) sala(s)..."
              placeholder="9 ano A"
              items={selectClassrooms}
              onCreate={async (item) => {
                await createClassroomMutation({ name: item.value })
                await refetchClassrooms()
              }}
            />
            {index === selectedClassroomsInput.value.length - 1 && (
              <>
                <IconButton
                  onClick={() => {
                    setSelectedClassroomsValue([...selectedClassroomsInput.value, []])
                    setSelectedSubjectsValue([...selectedSubjectsInput.value, []])
                  }}
                  aria-label="add row"
                  icon={<AddIcon />}
                />
                {index !== 0 && (
                  <>
                    <IconButton
                      onClick={() => {
                        setSelectedClassroomsValue(selectedClassroomsInput.value.slice(0, -1))
                        setSelectedSubjectsValue(selectedSubjectsInput.value.slice(0, -1))
                      }}
                      aria-label="delete row"
                      icon={<MinusIcon />}
                    />
                  </>
                )}
              </>
            )}
          </Flex>
        )
      })}
    </>
  )
}
