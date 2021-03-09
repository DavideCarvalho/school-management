import React, { useState } from "react"
import { AuthenticationError, Link, useMutation } from "blitz"
import { Box, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"
import { FormikProps, useFormik } from "formik"
import { FormErrorMessage } from "app/auth/components/FormErrorMessage"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: () => void
}

interface LoginFormState {
  email: string
  password: string
}

export const LoginForm = (props: LoginFormProps) => {
  const [formState, setFormState] = useState({
    error: "",
    loading: false,
  })
  const [loginMutation] = useMutation(login)
  const formik: FormikProps<LoginFormState> = useFormik<LoginFormState>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      if (!Login) return
      try {
        Login.parse(values)
      } catch (error) {
        return error.formErrors.fieldErrors
      }
    },
    onSubmit: async (values) => {
      setFormState((state) => ({ ...state, error: "" }))
      try {
        await loginMutation(values)
        props.onSuccess?.()
      } catch (error) {
        if (error instanceof AuthenticationError) {
          setFormState((state) => ({ ...state, error: "Sorry, those credentials are invalid" }))
        } else {
          setFormState((state) => ({
            ...state,
            error: `Sorry, we had an unexpected error. Please try again. - ${error.toString()}`,
          }))
        }
      }
    },
  })

  return (
    <div>
      <Box textAlign="center">
        <Heading>Login</Heading>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        {formState.error && <FormErrorMessage message={formState.error} />}

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="meu@email.com"
            size="lg"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            colorScheme="purple"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            placeholder="*******"
            size="lg"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            colorScheme="purple"
          />
        </FormControl>
        {/*<div>*/}
        {/*  <Link href="/forgot-password">*/}
        {/*    <a>Forgot your password?</a>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <Button
          colorScheme="yellow"
          type="submit"
          width="full"
          mt={4}
          isLoading={formik.isSubmitting}
          loadingText="Entrando"
        >
          Entrar
        </Button>
      </form>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        Or{" "}
        <Link href="/signup">
          <span style={{ color: "#ECC94B" }}>Sign Up</span>
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
