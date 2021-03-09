import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetSubject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetSubject), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const subject = await db.subject.findFirst({ where: { id } })

  if (!subject) throw new NotFoundError()

  return subject
})
