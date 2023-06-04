import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { ManagementClient } from 'auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { DeleteUser } from '../../../application/use-case/DeleteUser'
import { getUserFromSession } from '../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const authUser = await getUserFromSession(req, res)
        const userRepository = new DynamoUserRepository()
        const user = await userRepository.getById(authUser.sub as string)

        res.status(200).send(user)
        break
      }
      case 'DELETE': {
        const managementClient = new ManagementClient({
          domain: 'notion-tools.eu.auth0.com',
          clientId: process.env.AUTH0_BE_CLIENT_ID,
          clientSecret: process.env.AUTH0_BE_CLIENT_SECRET,
          scope: 'delete:users',
        })
        const authUser = await getUserFromSession(req, res)
        const deleteUser = new DeleteUser(new DynamoUserRepository())

        await deleteUser.invoke({ userId: authUser.sub as string })
        await managementClient.deleteUser({ id: authUser.sub })

        res.status(200).send({ success: true })
        break
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
