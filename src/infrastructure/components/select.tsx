import { PropsWithChildren, ReactElement } from 'react'

interface SelectProps {
  value: string | undefined
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  noEmptyOption?: boolean
}

export function Select({
  value,
  onChange,
  options,
  children,
  noEmptyOption,
}: PropsWithChildren<SelectProps>): ReactElement {
  return (
    <label>
      {children}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {!noEmptyOption && <option value="">---</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
