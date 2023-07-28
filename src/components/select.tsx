import { ReactElement } from 'react'

interface SelectProps {
  value: string | undefined
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  noEmptyOption?: boolean
}

export function Select({ value, onChange, options, noEmptyOption }: SelectProps): ReactElement {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
    >
      {!noEmptyOption && <option value=""></option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
