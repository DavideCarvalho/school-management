import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import slugify from "slugify"

const CreateSubject = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateSubject),
  resolver.authorize(),
  async (input, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    return await db.subject.create({
      data: { ...input, slug: slugify(input.name), schoolId },
    })
  }
)
