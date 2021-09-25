import { ReactElement } from 'react'

type Value = [string | undefined, string | undefined]

export function DateRangeInput({
  value,
  onChange,
}: {
  value?: Value
  onChange: (v: Value) => void
}): ReactElement {
  return (
    <label className="flex justify-between mb-2 items-center">
      <input
        type="date"
        value={value?.[0]?.substring(0, 10)}
        onChange={(e) => onChange([e.target.value || undefined, value?.[1]])}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400 mr-1"
      />
      <input
        type="date"
        value={value?.[1]?.substring(0, 10)}
        onChange={(e) => onChange([value?.[0], e.target.value || undefined])}
        className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
      />
    </label>
  )
}
