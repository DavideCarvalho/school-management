import { AppProps, AuthenticationError, AuthorizationError, ErrorComponent, ErrorFallbackProps, useRouter } from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import { ChakraProvider } from "@chakra-ui/react"
import LoginForm from "app/auth/components/LoginForm"
import { Navbar } from "../core/components/Navbar"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ChakraProvider>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
        onReset={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      >
        <Navbar />
        <div style={{ height: "100%" }}>{getLayout(<Component {...pageProps} />)}</div>
      </ErrorBoundary>
      <style global jsx>{`
        body {
          height: 100vh;
          width: 100vw;
        }
        #__next {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </ChakraProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
