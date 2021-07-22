import { ReactElement } from 'react'
import { useUser } from '../api-client'

export function NotionConnect(): ReactElement {
  const { user } = useUser()

  if (!user) return <h1>loading...</h1>

  return user.notionAccess ? (
    <>Connected to Notion</>
  ) : (
    <a href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code">
      Connect to Notion
    </a>
  )
}
