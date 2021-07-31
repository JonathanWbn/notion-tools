import { CheckboxProperty, CheckboxPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'
import { PropertyInputProps } from './tool-config-form'

export function CheckboxInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<CheckboxProperty, CheckboxPropertyValue>): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg flex-grow">{name}</span>
      <div className="w-40">
        <button
          className="w-7 h-7 border"
          onClick={() => {
            const v: CheckboxPropertyValue = {
              id: property.id,
              type: 'checkbox',
              checkbox: !value?.checkbox,
            }

            onChange(v)
          }}
        >
          {value?.checkbox ? '✔️' : <>&nbsp;</>}
        </button>
      </div>
    </label>
  )
}
