import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const GetProfessor = z.object({
  slug: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetProfessor),
  resolver.authorize(),
  async ({ slug }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const professor = await db.professor.findFirst({ where: { slug, schoolId } })

    if (!professor) throw new NotFoundError()

    return professor
  }
)
