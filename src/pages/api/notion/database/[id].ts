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

        const notion = new Client({ auth: user.notionAccess.access_token })
        const { results } = await notion.databases.query({ database_id: query.id as string })

        res.status(200).send(results)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)