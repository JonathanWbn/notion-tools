import { PropertyInputProps } from './recurring-task-form'
import { URLProperty, URLPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'

export function URLInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<URLProperty, URLPropertyValue>): ReactElement {
  const handleChange = (str: string) => {
    const v: URLPropertyValue = {
      id: property.id,
      type: 'url',
      url: str,
    }
    onChange(v)
  }

  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg flex-grow">{name}</span>
      <input
        value={value?.url}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        onChange={(e) => handleChange(e.target.value)}
      ></input>
    </label>
  )
}
