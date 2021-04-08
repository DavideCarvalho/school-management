import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"
import slugify from "slugify"

const UpdateProfessor = z
  .object({
    slug: z.string(),
    name: z.string(),
    email: z.string(),
    classroomsWithSubjects: z.array(z.object({ classroomId: z.string(), subjectId: z.string() })),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateProfessor),
  resolver.authorize(),
  async ({ name, email, classroomsWithSubjects, slug }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    // const createClassroomsQuery = selectedClassrooms.map(({ id }) => ({ classroomId: id }))
    // const createSubjectsQuery = selectedSubjects.map(({ id }) => ({ subjectId: id }))
    const professor = await db.professor.findUnique({
      where: { slug },
      include: {
        ProfessorsOnClassrooms: { include: { Classroom: true, Subject: true } },
        User: true,
      },
    })
    if (!professor) throw new NotFoundError()
    const classroomsToDelete = classroomsWithSubjects.filter(({ classroomId, subjectId }) => {
      return !professor.ProfessorsOnClassrooms.some(
        (classroom) => classroom.classroomId === classroomId && classroom.subjectId === subjectId
      )
    })
    const deleteClassroomsQuery =
      classroomsToDelete.map(({ classroomId, subjectId }) => {
        return {
          professorUserId_professorSchoolId_classroomId_subjectId: {
            classroomId,
            subjectId,
            professorUserId: professor.userId,
            professorSchoolId: professor.schoolId,
          },
        }
      }) || null

    const createClassroomsQuery = classroomsToDelete.map(({ classroomId, subjectId }) => {
      return {
        Classroom: {
          id: classroomId,
        },
        Subject: {
          id: subjectId,
        },
      }
    })
    const countProfessorsWithSameNameOnSchool =
      name !== professor.User.name
        ? await db.professor.count({
            where: { User: { name }, schoolId },
          })
        : null
    return await db.professor.update({
      where: { slug },
      data: {
        User: { update: { name, email: email.toLowerCase(), login: email.toLowerCase() } },
        ProfessorsOnClassrooms: {
          delete: deleteClassroomsQuery,
          create: createClassroomsQuery,
        },
        slug:
          countProfessorsWithSameNameOnSchool != null
            ? `${slugify(name)}_${countProfessorsWithSameNameOnSchool}`
            : professor.slug,
      },
      include: { ProfessorsOnClassrooms: true, User: true },
    })
  }
)
