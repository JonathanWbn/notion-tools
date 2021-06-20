import { NextApiRequest, NextApiResponse } from 'next'
import { CreateUser } from '../../src/application/use-case/CreateUser'
import { EnvAuthorization } from '../../src/infrastructure/EnvAuthorization'
import { DynamoUserRepository } from '../../src/infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { body, method } = req

  try {
    switch (method) {
      case 'POST': {
        const createUser = new CreateUser(
          new EnvAuthorization(body.secret),
          new DynamoUserRepository()
        )

        const newUser = await createUser.invoke({ auth0UserId: body.auth0Id })

        res.status(200).send(newUser)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
