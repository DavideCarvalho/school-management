import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateSubject = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateSubject), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const subject = await db.subject.create({ data: input })

  return subject
})
