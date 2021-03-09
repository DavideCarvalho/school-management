import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetClassroom = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetClassroom), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const classroom = await db.classroom.findFirst({ where: { id } })

  if (!classroom) throw new NotFoundError()

  return classroom
})
