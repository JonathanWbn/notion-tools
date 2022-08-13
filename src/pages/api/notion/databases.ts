import { Client } from '@notionhq/client/build/src'
import { Database } from '@notionhq/client/build/src/api-types'
import { NextApiRequest, NextApiResponse } from 'next'
import { decrypt } from '../../crypto'
import { getUserFromSession } from '../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse<Database[]>): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        let userId: string
        if (typeof req.headers.url === 'string' && req.headers.url.includes('/embed/')) {
          const [, hash] = req.headers.url.split('/embed/')
          ;({ userId } = JSON.parse(decrypt(hash)))
        } else {
          const authUser = getUserFromSession(req, res)
          userId = authUser.sub
        }
        console.log(req.headers.referer)

        const user = await userRepository.getById(userId)
        if (!user.notionAccess) {
          res.status(401).end()
          return
        }

        const notion = new Client({ auth: user.notionAccess.access_token })
        const databases = await notion.databases.list()

        res.status(200).send(databases.results)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default handler
