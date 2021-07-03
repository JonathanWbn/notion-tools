import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../domain/User'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse<User>): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const { user: authUser } = getSession(req, res) || {}
        if (!authUser) {
          res.status(401).end()
          return
        }
        const userRepository = new DynamoUserRepository()
        const user = await userRepository.getById(authUser.sub as string)

        res.status(200).send(user)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
