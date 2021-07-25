import { TitleProperty, TitlePropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'
import { PropertyInputProps } from './tool-config-form'

export function TitleInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<TitleProperty, TitlePropertyValue>): ReactElement {
  const textValue = value
    ? value.title
        .filter((el) => el.type === 'text')
        .map((el) => el.plain_text)
        .join('')
    : ''
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg">{name}</span>
      <input
        value={textValue}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        onChange={(e) => {
          const v: TitlePropertyValue = {
            id: property.id,
            type: 'title',
            title: [
              {
                type: 'text',
                plain_text: e.target.value,
                text: { content: e.target.value },
                annotations: {
                  bold: false,
                  code: false,
                  color: 'default',
                  italic: false,
                  strikethrough: false,
                  underline: false,
                },
              },
            ],
          }
          onChange(v)
        }}
      ></input>
    </label>
  )
}
