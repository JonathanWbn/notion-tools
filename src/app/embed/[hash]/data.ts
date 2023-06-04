import { Page } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import { decrypt } from '../../../application/crypto'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

export async function getEmbeddedData(key: string) {
  try {
    const { userId, visualizationId } = JSON.parse(decrypt(key))

    const user = await userRepository.getById(userId)

    if (!user.notionAccess) {
      return null
    }

    const databaseVisualization = user.databaseVisualizations.find(
      (viz) => viz.id === visualizationId
    )

    if (!databaseVisualization || !databaseVisualization.settings.databaseId) {
      return null
    }

    const pages = await queryDatabase(
      databaseVisualization.settings.databaseId,
      user.notionAccess.access_token
    )
    return {
      databaseVisualization,
      pages,
    }
  } catch {
    return null
  }
}

async function queryDatabase(
  databaseId: string,
  token: string,
  cursor?: string,
  pages: Page[] = []
): Promise<Page[]> {
  const {
    data: { results, has_more, next_cursor },
  } = await axios.post(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    { start_cursor: cursor },
    {
      headers: {
        'Notion-Version': '2022-06-28',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (has_more && next_cursor) {
    return queryDatabase(databaseId, token, next_cursor, [...pages, ...results])
  }

  return [...pages, ...results]
}
