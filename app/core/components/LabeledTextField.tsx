import { FC, PropsWithoutRef } from "react"
import { useField, useFormikContext } from "formik"
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  placeholder: string
}

export const LabeledTextField: FC<LabeledTextFieldProps> = ({ name, label, placeholder }) => {
  const [input] = useField(name)
  const { isSubmitting, errors } = useFormikContext<Record<string, string>>()

  return (
    <FormControl id={name} isRequired isInvalid={errors?.name != null}>
      <FormLabel>{label}</FormLabel>
      <Input {...input} disabled={isSubmitting} placeholder={placeholder} />
      <FormErrorMessage>{errors.name}</FormErrorMessage>
    </FormControl>
  )
}
