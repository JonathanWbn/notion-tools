import { ReactElement, ReactNode } from 'react'

interface Props {
  onClick?: () => void
  color: 'green' | 'red' | 'blue' | 'yellow'
  className?: string
  children: ReactNode
  href?: string
  isExternal?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function Button({
  onClick,
  color,
  children,
  href,
  isExternal,
  className,
  ...rest
}: Props): ReactElement {
  const Tag = href ? 'a' : 'button'

  const { bg, border, text, hoverText } = classMap[color]

  return (
    <Tag
      className={`py-1 px-8 ${bg} ${border} ${text} ${hoverText} ${className || ''}`}
      onClick={onClick}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      <span className={`border-b ${border} text-current font-medium`}>{children}</span>
    </Tag>
  )
}

// using this map so that tailwind doesn't purge the dynamic classes
const classMap: Record<Props['color'], Record<string, string>> = {
  green: {
    bg: 'bg-green-light',
    border: 'border-green',
    text: 'text-green',
    hoverText: 'hover:text-green-dark',
  },
  red: {
    bg: 'bg-red-light',
    border: 'border-red',
    text: 'text-red',
    hoverText: 'hover:text-red-dark',
  },
  blue: {
    bg: 'bg-blue-light',
    border: 'border-blue',
    text: 'text-blue',
    hoverText: 'hover:text-blue-dark',
  },
  yellow: {
    bg: 'bg-yellow-light',
    border: 'border-yellow',
    text: 'text-yellow',
    hoverText: 'hover:text-yellow-dark',
  },
}
