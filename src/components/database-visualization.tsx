'use server'

import {
  DatabaseVisualization,
  DatabaseVisualizationSettings,
} from '../domain/DatabaseVisualization'
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

  const pages = await queryDatabase(databaseVisualization.settings, user.notionAccess.access_token)

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
  settings: DatabaseVisualizationSettings,
  token: string,
  cursor?: string,
  pages: Page[] = []
): Promise<Page[]> {
  const onOrAfter = settings.xAxisTimeFrame?.[0] ?? undefined
  const onOrBefore = settings.xAxisTimeFrame?.[1] ?? undefined

  const res = await fetch(`https://api.notion.com/v1/databases/${settings.databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      start_cursor: cursor,
      filter:
        onOrAfter || onOrBefore
          ? {
              property: settings.xAxis,
              date: { on_or_after: onOrAfter, on_or_before: onOrBefore },
            }
          : undefined,
    }),
    headers: {
      'Notion-Version': '2022-06-28',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  })

  const { results, has_more, next_cursor } = await res.json()

  if (has_more && next_cursor) {
    return queryDatabase(settings, token, next_cursor, [...pages, ...results])
  }

  return [...pages, ...results]
}
