import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateTopic = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateTopic), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const topic = await db.topic.create({ data: input as any })

  return topic
})
