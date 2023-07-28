import React from 'react'

import { Select } from './select'
import { Database } from '@notionhq/client/build/src/api-types'

export function DatabaseSelect({
  value,
  onChange,
  databases,
}: {
  value?: string
  onChange: (v: string) => void
  databases: Database[]
}): React.ReactElement {
  const [useManual, setUseManual] = React.useState(false)

  const databaseOptions = (databases || []).map((database) => ({
    value: database.id,
    label: database.title[0].plain_text,
  }))

  return (
    <div>
      <label className="mr-4">
        <button
          className="w-4 h-4 border rounded-sm mr-1 text-xs"
          onClick={() => setUseManual((v) => !v)}
        >
          {useManual ? '✔️' : <>&nbsp;</>}
        </button>
        Select database manually
      </label>
      {useManual && (
        <p className="border border-dashed mt-2 p-1">
          1. Go to the database view.
          <br />
          2. Click context menu (···).
          <br />
          3. Select &quot;Copy link to view&quot;.
          <br />
          4. Paste link into input field.
        </p>
      )}
      {useManual ? (
        <>
          <input
            value={value}
            placeholder="Paste link here..."
            className="border w-full text-sm p-2 appearance-none focus:outline-none focus:border-gray-400 mt-2 self-end"
            onChange={(e) => {
              const parsedId = e.target.value.split('?')[0].split('/')[4]
              const formattedId =
                parsedId &&
                `${parsedId.substr(0, 8)}-${parsedId.substr(8, 4)}-${parsedId.substr(
                  12,
                  4
                )}-${parsedId.substr(16, 4)}-${parsedId.substr(20, 12)}`
              onChange(formattedId)
            }}
          ></input>
        </>
      ) : (
        <Select value={value} onChange={onChange} options={databaseOptions} />
      )}
    </div>
  )
}
