import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { UpdateToolConfig } from '../../../../../application/use-case/UpdateToolConfig'
import { getUserFromSession } from '../../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ success: true }>
): Promise<void> => {
  const { query, method, body } = req

  try {
    switch (method) {
      case 'PATCH': {
        const authUser = getUserFromSession(req, res)
        const updateToolConfig = new UpdateToolConfig(new DynamoUserRepository())

        await updateToolConfig.invoke({
          auth0UserId: authUser.sub,
          toolConfigId: query.configId as string,
          toolConfig: body,
        })

        res.status(200).send({ success: true })
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
