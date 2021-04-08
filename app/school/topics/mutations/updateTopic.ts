import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateTopic = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateTopic),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const topic = await db.topic.update({ where: { id }, data: data as any })

    return topic
  }
)
