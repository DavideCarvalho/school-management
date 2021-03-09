import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetClassroomsInput
  extends Pick<Prisma.ClassroomFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetClassroomsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: classrooms, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.classroom.count({ where }),
      query: (paginateArgs) => db.classroom.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      classrooms,
      nextPage,
      hasMore,
      count,
    }
  }
)
