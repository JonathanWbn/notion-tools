import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { DisableToolConfig } from '../../../../application/use-case/DisableToolConfig'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ success: true }>
): Promise<void> => {
  const { query, method } = req

  try {
    switch (method) {
      case 'POST': {
        const authUser = getUserFromSession(req, res)
        const disableToolConfig = new DisableToolConfig(new DynamoUserRepository())

        await disableToolConfig.invoke({
          auth0UserId: authUser.sub,
          toolConfigId: query.configId as string,
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
