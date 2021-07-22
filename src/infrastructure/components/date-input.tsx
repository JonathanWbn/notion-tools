import { DateProperty, DatePropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement, useState } from 'react'
import { PropertyInputProps } from './tool-config-form'

import { Select } from './select'

export function DateInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<DateProperty, DatePropertyValue>): ReactElement {
  const [type, setType] = useState('relative')

  return (
    <label key={property.id}>
      {name}
      <Select
        value={type}
        onChange={setType}
        options={[
          { value: 'fixed', label: 'Fixed date' },
          { value: 'relative', label: 'Relative date' },
        ]}
        noEmptyOption
      />
      {type === 'relative' && (
        <Select
          value={value ? value.date.start : ''}
          onChange={(value) => {
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
      )}
      {type === 'fixed' && (
        <input
          type="date"
          value={value ? value.date.start : ''}
          onChange={(e) => {
            const v: DatePropertyValue = {
              id: property.id,
              type: 'date',
              date: { start: e.target.value },
            }
            onChange(v)
          }}
        ></input>
      )}
    </label>
  )
}
