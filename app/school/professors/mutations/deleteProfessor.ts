import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteProfessor = z
  .object({
    userId: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteProfessor),
  resolver.authorize(),
  async ({ userId }, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    await db.professor.deleteMany({ where: { userId, schoolId } })
    await db.user.deleteMany({ where: { id: userId } })
  }
)
