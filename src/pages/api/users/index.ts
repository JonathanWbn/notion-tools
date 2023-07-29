import { CreateUser } from '../../../application/use-case/CreateUser'
import { EnvAuthorization } from '../../../infrastructure/EnvAuthorization'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { body, method } = req

  try {
    switch (method) {
      case 'POST': {
        const createUser = new CreateUser(
          new EnvAuthorization(body.secret),
          new DynamoUserRepository()
        )

        const newUser = await createUser.invoke({ userId: body.userId })

        res.status(200).send(newUser)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500 })
  }
}

export default handler
