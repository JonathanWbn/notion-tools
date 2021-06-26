import { getSession } from '@auth0/nextjs-auth0'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { ConnectNotion } from '../../application/use-case/ConnectNotion'
import { DynamoUserRepository } from '../../infrastructure/repository/DynamoUserRepository'

const { NOTION_OAUTH_CLIENT_ID, NOTION_OAUTH_CLIENT_SECRET } = process.env

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { code } = req.query
        const { user } = getSession(req, res)

        const { data } = await axios.post(
          'https://api.notion.com/v1/oauth/token',
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'https://notion-tools.io/api/notion-connect',
          },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${NOTION_OAUTH_CLIENT_ID}:${NOTION_OAUTH_CLIENT_SECRET}`
              ).toString('base64')}`,
            },
          }
        )

        const connectNotion = new ConnectNotion(new DynamoUserRepository())

        await connectNotion.invoke({
          auth0UserId: user.sub,
          notionAccess: data,
        })

        res.status(301).redirect('/user')
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
