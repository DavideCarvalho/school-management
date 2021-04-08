import { BlitzPage, useRouter } from "blitz"
import { Box, Flex } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Flex width="full" h="100vh" align="center" justifyContent="center">
        <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
          <LoginForm
            onSuccess={() => {
              const next = (router.query.next as string) ?? "/"
              router.push(next)
            }}
          />
        </Box>
      </Flex>
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
