import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const GetSubject = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetSubject),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const subject = await db.subject.findFirst({ where: { id, schoolId } })

    if (!subject) throw new NotFoundError()

    return subject
  }
)
