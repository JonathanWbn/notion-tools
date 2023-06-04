import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { decrypt } from '../../../application/crypto'
import { getUserFromSession } from '../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method } = req

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

        const { data } = await axios.post(
          'https://api.notion.com/v1/search',
          { filter: { value: 'database', property: 'object' } },
          {
            headers: {
              'Notion-Version': '2022-06-28',
              Authorization: `Bearer ${user.notionAccess.access_token}`,
            },
          }
        )

        res.status(200).send(data.results)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default handler
