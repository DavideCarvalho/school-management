import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteSubject = z
  .object({
    id: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteSubject),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const subject = await db.subject.deleteMany({ where: { id, schoolId } })

    return subject
  }
)
