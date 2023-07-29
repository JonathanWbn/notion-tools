import { PropertyInputProps } from './recurring-task-form'
import { MultiSelectProperty, MultiSelectPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'

export function MultiSelectInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<MultiSelectProperty, MultiSelectPropertyValue>): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg">{name}</span>
      <select
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        value={value ? value.multi_select[0].id : ''}
        onChange={(e) => {
          const selectedOption = property.multi_select.options.find(
            (opt) => opt.id === e.target.value
          )
          if (!selectedOption) {
            onChange(undefined)
            return
          }
          const v: MultiSelectPropertyValue = {
            id: property.id,
            type: 'multi_select',
            multi_select: [selectedOption],
          }
          onChange(v)
        }}
      >
        <option value=""></option>
        {property.multi_select.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  )
}
