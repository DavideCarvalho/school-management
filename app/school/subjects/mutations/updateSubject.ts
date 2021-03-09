import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateSubject = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateSubject),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const subject = await db.subject.update({ where: { id }, data })

    return subject
  }
)
