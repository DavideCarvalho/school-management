import { resolver, SecurePassword } from "blitz"
import db from "db"
import * as z from "zod"
import generator from "generate-password"
import slugify from "slugify"
import { v4 } from "uuid"

const CreateStudent = z
  .object({
    name: z.string(),
    rm: z.string(),
    accountableName: z.string(),
    accountableEmail: z.string(),
    classroomId: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateStudent),
  resolver.authorize(),
  async ({ name, rm, accountableName, accountableEmail, classroomId }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const password = generator.generate({
      length: 10,
      numbers: true,
    })
    const accountablePassword = generator.generate({
      length: 10,
      numbers: true,
    })
    const hashedPassword = await SecurePassword.hash(password)
    const accountableHashedPassword = await SecurePassword.hash(accountablePassword)
    const countStudentsWithSameNameOnSchool = await db.student.count({
      where: { User: { name }, schoolId },
    })
    const userId = v4()
    await db.student.create({
      data: {
        User: {
          create: {
            id: userId,
            hashedPassword,
            role: "STUDENT",
            name,
            login: rm.toLowerCase().trim(),
          },
        },
        slug: `${slugify(name)}_${countStudentsWithSameNameOnSchool}`,
        School: {
          connect: {
            id: schoolId,
          },
        },
        Classroom: {
          connect: {
            id: classroomId,
          },
        },
        Accountable: {
          create: {
            studentId: userId,
            slug: `${slugify(accountableName)}`,
            User: {
              create: {
                hashedPassword: accountableHashedPassword,
                role: "ACCOUNTABLE",
                name: accountableName,
                login: accountableEmail.toLowerCase().trim(),
                email: accountableEmail.toLowerCase().trim(),
              },
            },
          },
        },
      },
    })
  }
)
