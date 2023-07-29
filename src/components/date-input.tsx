import { PropertyInputProps } from './recurring-task-form'
import { Select } from './select'
import { DateProperty, DatePropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'

export function DateInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<DateProperty, DatePropertyValue>): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg">{name}</span>
      <Select
        value={value ? value.date.start : ''}
        onChange={(value) => {
          if (!value) onChange(undefined)
          const v: DatePropertyValue = { id: property.id, type: 'date', date: { start: value } }
          onChange(v)
        }}
        options={[
          { value: 'today', label: 'Day of creation' },
          { value: 'in1day', label: 'Day after creation' },
          { value: 'in1week', label: 'One week after creation' },
          { value: 'in1month', label: 'One month after creation' },
          { value: 'in1year', label: 'One year after creation' },
        ]}
      />
    </label>
  )
}
