import axios from 'axios'
import { Page } from '@notionhq/client/build/src/api-types'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'
import { decrypt } from '../../../../application/crypto'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse<Page[]>): Promise<void> => {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET': {
        let userId: string
        if (typeof req.headers.url === 'string' && req.headers.url.includes('/embed/')) {
          const [, hash] = req.headers.url.split('/embed/')
          ;({ userId } = JSON.parse(decrypt(hash)))
        } else {
          const authUser = await getUserFromSession(req, res)
          userId = authUser.sub
        }

        const user = await userRepository.getById(userId)
        if (!user.notionAccess) {
          res.status(401).end()
          return
        }

        const pages = await queryDatabase(query.id as string, user.notionAccess.access_token)

        res.status(200).send(pages)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
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

export default handler
