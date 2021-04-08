import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const GetClassroom = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetClassroom),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const classroom = await db.classroom.findFirst({ where: { id, schoolId } })

    if (!classroom) throw new NotFoundError()

    return classroom
  }
)
