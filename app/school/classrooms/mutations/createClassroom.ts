import { resolver } from "blitz"
import db from "db"
import slugify from "slugify"
import * as z from "zod"

const CreateClassroom = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateClassroom),
  resolver.authorize(),
  async (input, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    return await db.classroom.create({
      data: { ...input, schoolId, slug: slugify(input.name, { strict: true, lower: true }) },
    })
  }
)
