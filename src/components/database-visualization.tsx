'use server'

import { DatabaseVisualization } from '../domain/DatabaseVisualization'
import { User } from '../domain/User'
import { DatabaseVisualizationChart } from './database-visualization-chart'
import { Page } from '@notionhq/client/build/src/api-types'

type Props = {
  user: User
  databaseVisualization: DatabaseVisualization
  width: number | string
  height: number | string
}

export async function DatabaseVisualizationComponent({
  user,
  databaseVisualization,
  width,
  height,
}: Props) {
  if (!user.notionAccess) {
    return null
  }

  const pages = await queryDatabase(
    databaseVisualization.settings.databaseId ?? '',
    user.notionAccess.access_token
  )

  return (
    <DatabaseVisualizationChart
      pages={pages}
      databaseVisualization={databaseVisualization}
      width={width}
      height={height}
    />
  )
}

async function queryDatabase(
  databaseId: string,
  token: string,
  cursor?: string,
  pages: Page[] = []
): Promise<Page[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({ start_cursor: cursor }),
    headers: {
      'Notion-Version': '2022-06-28',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const { results, has_more, next_cursor } = await res.json()

  if (has_more && next_cursor) {
    return queryDatabase(databaseId, token, next_cursor, [...pages, ...results])
  }

  return [...pages, ...results]
}
