import { TitleProperty, TitlePropertyValue } from '@notionhq/client/build/src/api-types'
import { format } from 'date-fns'
import { ReactElement } from 'react'
import { PropertyInputProps } from './recurring-task-form'

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

  const handleChange = (str: string) => {
    const v: TitlePropertyValue = {
      id: property.id,
      type: 'title',
      title: [
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

  const useDate = textValue === 'formatted_day'
  return (
    <label className="flex justify-between mb-2 items-center">
      <span className="text-lg flex-grow">{name}</span>
      <label className="mr-4">
        <button
          className="w-4 h-4 border rounded-sm mr-1 text-xs"
          onClick={() => (useDate ? handleChange('') : handleChange('formatted_day'))}
        >
          {useDate ? '✔️' : <>&nbsp;</>}
        </button>
        Use date
      </label>
      <input
        value={useDate ? `e.g. "${format(Date.now(), 'LLL do')}"` : textValue}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
        disabled={useDate}
        onChange={(e) => handleChange(e.target.value)}
      ></input>
    </label>
  )
}
