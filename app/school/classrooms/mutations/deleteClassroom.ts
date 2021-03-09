import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteClassroom = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteClassroom),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const classroom = await db.classroom.deleteMany({ where: { id } })

    return classroom
  }
)
