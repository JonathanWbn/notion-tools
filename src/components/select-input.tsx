import { PropertyInputProps } from './recurring-task-form'
import { SelectProperty, SelectPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'

export function SelectInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<SelectProperty, SelectPropertyValue>): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg">{name}</span>
      <select
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
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
        <option value=""></option>
        {property.select.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  )
}
