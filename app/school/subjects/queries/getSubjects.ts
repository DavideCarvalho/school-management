import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetSubjectsInput
  extends Pick<Prisma.SubjectFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSubjectsInput, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const { items: subjects, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.subject.count({ where: { ...where, schoolId } }),
      query: (paginateArgs) =>
        db.subject.findMany({ ...paginateArgs, where: { ...where, schoolId }, orderBy }),
    })

    return {
      subjects,
      nextPage,
      hasMore,
      count,
    }
  }
)
