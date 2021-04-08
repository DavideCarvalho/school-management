import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTopicsInput
  extends Pick<Prisma.TopicFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTopicsInput, ctx) => {
    const { schoolId, role, id } = await ctx.session.$getPrivateData()
    let professorWhere = {}
    let isProfessor = role === "PROFESSOR"
    if (isProfessor) {
      professorWhere = { ...professorWhere, professorUserId: id }
    }
    const { items: topics, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.topic.count({ where: { ...where, professorSchoolId: schoolId } }),
      query: (paginateArgs) =>
        db.topic.findMany({
          ...paginateArgs,
          where: { ...where, ...professorWhere, professorSchoolId: schoolId },
          orderBy,
          include: { Classroom: true, Professor: { include: { User: true } }, Subject: true },
        }),
    })

    return {
      topics,
      nextPage,
      hasMore,
      count,
    }
  }
)
