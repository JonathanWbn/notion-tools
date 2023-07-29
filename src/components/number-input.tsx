import { PropertyInputProps } from './recurring-task-form'
import { NumberProperty, NumberPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'

export function NumberInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<NumberProperty, NumberPropertyValue>): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg flex-grow">{name}</span>
      <input
        value={value?.number}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        type="number"
        onChange={(e) => {
          const v: NumberPropertyValue = {
            id: property.id,
            type: 'number',
            number: parseFloat(e.target.value),
          }
          onChange(v)
        }}
      ></input>
    </label>
  )
}
