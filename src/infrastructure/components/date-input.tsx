import { DateProperty, DatePropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'
import { PropertyInputProps } from './tool-config-form'

export function DateInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<DateProperty, DatePropertyValue>): ReactElement {
  return (
    <label key={property.id}>
      {name}
      <input
        type="date"
        value={value ? value.date.start : ''}
        onChange={(e) => {
          const v: DatePropertyValue = {
            id: property.id,
            type: 'date',
            date: {
              start: e.target.value,
            },
          }
          console.log('v', v)
          onChange(v)
        }}
      ></input>
    </label>
  )
}
