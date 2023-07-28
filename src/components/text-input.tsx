import { RichTextProperty, RichTextPropertyValue } from '@notionhq/client/build/src/api-types'
import { ReactElement } from 'react'
import { PropertyInputProps } from './recurring-task-form'

export function TextInput({
  property,
  value,
  onChange,
  name,
}: PropertyInputProps<RichTextProperty, RichTextPropertyValue>): ReactElement {
  const textValue = value
    ? value.rich_text
        .filter((el) => el.type === 'text')
        .map((el) => el.plain_text)
        .join('')
    : ''

  const handleChange = (str: string) => {
    const v: RichTextPropertyValue = {
      id: property.id,
      type: 'rich_text',
      rich_text: [
        {
          type: 'text',
          plain_text: str,
          text: { content: str },
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
  }

  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg flex-grow">{name}</span>
      <input
        value={textValue}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        onChange={(e) => handleChange(e.target.value)}
      ></input>
    </label>
  )
}
