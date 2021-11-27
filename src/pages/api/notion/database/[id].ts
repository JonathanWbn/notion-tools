import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { Client } from '@notionhq/client/build/src'
import { Page } from '@notionhq/client/build/src/api-types'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse<Page[]>): Promise<void> => {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET': {
        const authUser = getUserFromSession(req, res)

        const user = await userRepository.getById(authUser.sub)
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
  const notion = new Client({ auth: token })

  const { results, has_more, next_cursor } = await notion.databases.query({
    database_id: databaseId,
    start_cursor: cursor,
  })

  if (has_more && next_cursor) {
    return queryDatabase(databaseId, token, next_cursor, [...pages, ...results])
  }

  return [...pages, ...results]
}

export default withApiAuthRequired(handler)
