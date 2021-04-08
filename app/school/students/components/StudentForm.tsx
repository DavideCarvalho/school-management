import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { usePaginatedQuery } from "blitz"
import getClassrooms from "app/school/classrooms/queries/getClassrooms"
import { LabeledSelectField } from "app/core/components/LabeledSelectField"

export { FORM_ERROR } from "app/core/components/Form"

const ITEMS_PER_PAGE = 250

export function StudentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ classrooms }] = usePaginatedQuery(getClassrooms, {
    orderBy: { name: "asc" },
    skip: 0,
    take: ITEMS_PER_PAGE,
  })
  const selectClassrooms = classrooms.map((classroom) => ({
    label: classroom.name,
    value: classroom.id,
  }))
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Nome do aluno" placeholder="Nome do aluno" />
      <LabeledTextField name="rm" label="RM do aluno" placeholder="RM" />
      <LabeledTextField
        name="accountableName"
        label="Nome do responsável"
        placeholder="Nome do responsável"
      />
      <LabeledTextField
        name="accountableEmail"
        label="Email do responsável"
        placeholder="Email do responsável"
      />
      <LabeledSelectField
        name="classroomId"
        placeholder="Escolha a sala do aluno"
        label="Sala do aluno"
        items={selectClassrooms}
      />
    </Form>
  )
}
