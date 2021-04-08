import { resolver, SecurePassword } from "blitz"
import db from "db"
import slugify from "slugify"
import * as z from "zod"
import generator from "generate-password"

const CreateProfessor = z
  .object({
    name: z.string(),
    email: z.string(),
    classroomsWithSubjects: z.array(z.object({ classroomId: z.string(), subjectId: z.string() })),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateProfessor),
  resolver.authorize(),
  async ({ name, email, classroomsWithSubjects }, ctx) => {
    const password = generator.generate({
      length: 10,
      numbers: true,
    })
    const { schoolId } = await ctx.session.$getPrivateData()
    const hashedPassword = await SecurePassword.hash(password)
    const countProfessorsWithSameNameOnSchool = await db.professor.count({
      where: { User: { name }, schoolId },
    })
    const professorOnClassroomsQuery = classroomsWithSubjects.map(({ classroomId, subjectId }) => ({
      Classroom: { connect: { id: classroomId } },
      Subject: { connect: { id: subjectId } },
    }))
    return await db.professor.create({
      data: {
        schoolId,
        User: {
          create: {
            name,
            email: email.toLowerCase(),
            login: email.toLowerCase(),
            hashedPassword,
            role: "PROFESSOR",
          },
        },
        slug: `${slugify(name)}_${countProfessorsWithSameNameOnSchool}`,
        ProfessorsOnClassrooms: {
          create: professorOnClassroomsQuery,
        },
      },
    })
  }
)
