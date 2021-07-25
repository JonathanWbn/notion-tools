import React, { ReactElement, ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export function Toggle({ label, children }: Props): ReactElement {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-start my-2">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-1 rounded-sm hover:bg-gray-100"
        style={{ width: 'fit-content', margin: 3, marginRight: 5 }}
      >
        <div
          style={{
            borderTop: '5px solid transparent',
            borderLeft: '10px solid black',
            borderBottom: '5px solid transparent',
          }}
          className={`w-0 h-0 transition-transform ${isOpen ? 'transform rotate-90' : ''}`}
        />
      </button>
      <div>
        <p className="font-bold mb-2">{label}</p>
        {isOpen && children}
      </div>
    </div>
  )
}
