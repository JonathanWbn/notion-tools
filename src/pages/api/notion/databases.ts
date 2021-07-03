import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { Client } from '@notionhq/client/build/src'
import { Database } from '@notionhq/client/build/src/api-types'
import { NextApiRequest, NextApiResponse } from 'next'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse<Database[]>): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { user: authUser } = getSession(req, res) || {}
        if (!authUser) {
          res.status(401).end()
          return
        }
        const user = await userRepository.getById(authUser.sub)
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

export default withApiAuthRequired(handler)
