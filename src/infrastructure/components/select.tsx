import { PropsWithChildren, ReactElement } from 'react'

interface SelectProps {
  value: string | undefined
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}

export function Select({
  value,
  onChange,
  options,
  children,
}: PropsWithChildren<SelectProps>): ReactElement {
  return (
    <label>
      {children}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">---</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
