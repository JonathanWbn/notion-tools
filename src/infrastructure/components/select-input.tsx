import { SelectProperty, SelectPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'
import { PropertyInputProps } from './tool-config-form'

export function SelectInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<SelectProperty, SelectPropertyValue>): ReactElement {
  return (
    <label key={property.id}>
      {name}
      <select
        value={value ? value.select.id : ''}
        onChange={(e) => {
          const selectedOption = property.select.options.find((opt) => opt.id === e.target.value)
          if (!selectedOption) {
            onChange(undefined)
            return
          }
          const v: SelectPropertyValue = {
            id: property.id,
            type: 'select',
            select: selectedOption,
          }
          onChange(v)
        }}
      >
        <option value="">---</option>
        {property.select.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  )
}
