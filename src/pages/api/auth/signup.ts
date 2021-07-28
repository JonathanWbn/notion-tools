import { handleLogin } from '@auth0/nextjs-auth0'
import { Database } from '@notionhq/client/build/src/api-types'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<Database[]>): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        await handleLogin(req, res, {
          returnTo: '/user',
          authorizationParams: {
            screen_hint: 'signup',
          },
        })
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default handler
