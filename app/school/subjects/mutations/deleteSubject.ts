import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteSubject = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteSubject), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const subject = await db.subject.deleteMany({ where: { id } })

  return subject
})
