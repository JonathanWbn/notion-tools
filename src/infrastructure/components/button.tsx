import { ReactElement, ReactNode } from 'react'

interface Props {
  onClick?: () => void
  color: 'green' | 'red' | 'blue' | 'yellow'
  className?: string
  children: ReactNode
  href?: string
  isExternal?: boolean
}

export function Button({
  onClick,
  color,
  children,
  href,
  isExternal,
  className,
}: Props): ReactElement {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      className={`py-1 px-8 bg-${color}-light border-${color} text-${color} hover:text-${color}-dark ${
        className || ''
      }`}
      onClick={onClick}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <span className={`border-b border-${color} text-current font-medium`}>{children}</span>
    </Tag>
  )
}
