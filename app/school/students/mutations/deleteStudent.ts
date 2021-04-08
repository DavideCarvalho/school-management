import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteStudent = z
  .object({
    userId: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteStudent),
  resolver.authorize(),
  async ({ userId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { schoolId } = await ctx.session.$getPrivateData()
    await db.$transaction([
      db.accountable.deleteMany({ where: { Student: { is: { userId, schoolId } } } }),
      db.student.deleteMany({ where: { userId, schoolId } }),
    ])
  }
)
