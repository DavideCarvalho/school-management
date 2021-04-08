import { AuthenticationError, resolver, SecurePassword } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"

export const authenticateUser = async (login: string, password: string) => {
  const user = await db.user.findFirst({ where: { login } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ login, password }, ctx) => {
  const userTypes = {
    PROFESSOR: "professor",
    STUDENT: "student",
    SCHOOL_ADMIN: "schoolAdmin",
  }
  // This throws an error if credentials are invalid
  const user = await authenticateUser(login, password)

  const userRole = await db[userTypes[user.role as Role]].findFirst({ where: { userId: user.id } })

  await ctx.session.$create({ userId: user.id, role: user.role as Role }, { ...user, ...userRole })

  return user
})
