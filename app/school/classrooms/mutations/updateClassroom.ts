import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateClassroom = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateClassroom),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const classroom = await db.classroom.update({ where: { id }, data })

    return classroom
  }
)
