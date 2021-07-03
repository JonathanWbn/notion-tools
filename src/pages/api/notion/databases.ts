import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { Client } from '@notionhq/client/build/src'
import { NextApiRequest, NextApiResponse } from 'next'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { user: authUser } = getSession(req, res) || {}
        if (!authUser) {
          res.status(401).json({ statusCode: 401, message: 'No user found in session.' })
          return
        }
        const user = await userRepository.getById(authUser.sub)
        if (!user.notionAccess) {
          res.status(401).json({ statusCode: 401, message: 'User has no Notion access token.' })
          return
        }

        const notion = new Client({ auth: user.notionAccess.access_token })
        const databases = await notion.databases.list()

        res.status(200).send(databases)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default withApiAuthRequired(handler)
