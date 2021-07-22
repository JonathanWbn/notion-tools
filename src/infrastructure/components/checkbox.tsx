import { PropsWithChildren, ReactElement } from 'react'

interface CheckboxProps {
  value: boolean
  onChange: (val: boolean) => void
}

export function Checkbox({
  value,
  onChange,
  children,
}: PropsWithChildren<CheckboxProps>): ReactElement {
  return (
    <label>
      {children}
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}></input>
    </label>
  )
}
