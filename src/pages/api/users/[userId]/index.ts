import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET': {
        const userRepository = new DynamoUserRepository()
        const user = await userRepository.getById(query.userId as string)

        res.status(200).send(user)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default withApiAuthRequired(handler)
