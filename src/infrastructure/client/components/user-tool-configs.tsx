import { ReactElement } from 'react'
import Link from 'next/link'
import { useTools, useUser } from '../api-client'

export function UserToolConfigs(): ReactElement {
  const { user } = useUser()
  const { tools } = useTools()

  if (!user || !tools) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {user.toolConfigs.map((config) => {
        const tool = tools.find((tool) => tool.id === config.toolId)
        if (!tool) return null
        return (
          <li key={config.id}>
            {tool.name} {config.isActive ? 'Active' : 'Disabled'}{' '}
            <Link href={`/user/config/${config.id}`}>Config</Link>
          </li>
        )
      })}
    </ul>
  )
}
