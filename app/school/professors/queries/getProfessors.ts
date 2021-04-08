import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetProfessorsInput
  extends Pick<Prisma.ProfessorFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProfessorsInput, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const { items: professors, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.professor.count({ where: { ...where, schoolId } }),
      query: (paginateArgs) =>
        db.professor.findMany({
          ...paginateArgs,
          where: { ...where, schoolId },
          orderBy,
          include: {
            ProfessorsOnClassrooms: { include: { Classroom: true, Subject: true } },
            User: true,
          },
        }),
    })

    return {
      professors,
      nextPage,
      hasMore,
      count,
    }
  }
)
