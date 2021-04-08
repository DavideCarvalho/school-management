import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const GetStudent = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetStudent),
  resolver.authorize(),
  async ({ slug }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const student = await db.student.findFirst({
      where: { slug, schoolId },
      include: { User: true, Accountable: { include: { User: true } }, Classroom: true },
    })

    if (!student) throw new NotFoundError()

    return student
  }
)
