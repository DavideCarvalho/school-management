import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteClassroom = z
  .object({
    id: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteClassroom),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { schoolId } = await ctx.session.$getPrivateData()
    const classroom = await db.classroom.deleteMany({ where: { id, schoolId } })

    return classroom
  }
)
