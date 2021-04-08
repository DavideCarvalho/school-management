import { FC } from "react"
import { useField, useFormikContext } from "formik"
import { FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react"

export interface LabeledTextFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  placeholder: string
  items: { label: string; value: string }[]
}

export const LabeledSelectField: FC<LabeledTextFieldProps> = ({
  name,
  label,
  placeholder,
  items,
}) => {
  const [input, { error }, { setValue }] = useField<string>(name)
  const { isSubmitting } = useFormikContext<Record<string, string>>()

  return (
    <FormControl id={name} isRequired isInvalid={error != null}>
      <FormLabel>{label}</FormLabel>
      <Select
        disabled={isSubmitting}
        onChange={(item) => setValue(item.target.value)}
        value={input.value}
        placeholder={placeholder}
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
