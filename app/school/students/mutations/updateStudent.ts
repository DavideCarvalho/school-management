import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"
import slugify from "slugify"

const UpdateStudent = z
  .object({
    studentId: z.string(),
    name: z.string(),
    rm: z.string(),
    accountableName: z.string(),
    accountableEmail: z.string(),
    classroomId: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateStudent),
  resolver.authorize(),
  async ({ studentId, ...data }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const student = await db.student.findUnique({
      where: { userId_schoolId: { schoolId, userId: studentId } },
      include: { Accountable: { include: { User: true } }, User: true },
    })
    if (!student) throw new NotFoundError()
    if (
      student.Accountable.User.name !== data.accountableName &&
      student.Accountable.User.email !== data.accountableEmail
    ) {
      // send email to Accountable
    }

    console.log("nomes", student.User.name, data.name)

    const countStudentsWithSameNameOnSchool =
      student.User.name !== data.name
        ? await db.student.count({
            where: { User: { name: data.name }, schoolId },
          })
        : null
    return db.student.update({
      where: { userId_schoolId: { userId: studentId, schoolId } },
      data: {
        User: {
          update: {
            name: data.name,
            login: data.rm.toLowerCase().trim(),
          },
        },
        slug:
          countStudentsWithSameNameOnSchool != null
            ? `${slugify(data.name)}_${countStudentsWithSameNameOnSchool}`
            : student.slug,
        Accountable: {
          update: {
            slug: `${slugify(data.accountableName)}`,
            User: {
              update: {
                name: data.accountableName,
                login: data.accountableEmail.toLowerCase().trim(),
                email: data.accountableEmail.toLowerCase().trim(),
              },
            },
          },
        },
      },
    })
  }
)
