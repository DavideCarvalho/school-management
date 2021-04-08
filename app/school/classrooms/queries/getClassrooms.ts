import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetClassroomsInput
  extends Pick<Prisma.ClassroomFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetClassroomsInput, ctx) => {
    const { schoolId } = await ctx.session.$getPrivateData()
    const { items: classrooms, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.classroom.count({ where: { ...where, schoolId } }),
      query: (paginateArgs) =>
        db.classroom.findMany({ ...paginateArgs, where: { ...where, schoolId }, orderBy }),
    })

    return {
      classrooms,
      nextPage,
      hasMore,
      count,
    }
  }
)
