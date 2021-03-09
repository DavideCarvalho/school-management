import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateClassroom = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateClassroom), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const classroom = await db.classroom.create({ data: input })

  return classroom
})
