import { useField } from "formik"
import { FormControl, FormErrorMessage } from "@chakra-ui/react"
import { CUIAutoComplete } from "chakra-ui-autocomplete"
import { UseMultipleSelectionStateChange } from "downshift"

interface Item {
  value: string
  label: string
}

export interface LabeledMultiSelectFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  placeholder: string
  items: Item[]
  onCreate: (item: Item) => void
}

export const LabeledMultiSelectField: React.FC<LabeledMultiSelectFieldProps> = ({
  name,
  label,
  placeholder,
  items,
  onCreate,
}) => {
  const [input, { error }, { setValue }] = useField(name)
  const onChangeHandler = ({ selectedItems }: UseMultipleSelectionStateChange<Item>) => {
    setValue(selectedItems)
  }
  const onCreateHandler = (item: Item) => {
    onCreate(item)
  }
  return (
    <FormControl id={name}>
      <CUIAutoComplete
        label={label}
        placeholder={placeholder}
        items={items}
        stateReducer={({ selectedItems, activeIndex }, { selectedItem, type }) => {
          if (type === "__function_remove_selected_item__") {
            items = selectedItems.filter(({ value }) => selectedItem!.value !== value)
            return { selectedItems: items, activeIndex }
          }
          if (type === "__function_add_selected_item__") {
            items = [...selectedItems!, selectedItem!]
            return { selectedItems: items, activeIndex }
          }
          return { selectedItems: [], activeIndex }
        }}
        selectedItems={input.value}
        onSelectedItemsChange={onChangeHandler}
        onCreateItem={onCreateHandler}
        emptyState={(inputValue: string) => <p>Criar "{inputValue}"?</p>}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
