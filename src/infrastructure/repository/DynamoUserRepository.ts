import { UserRepository } from '../../application/repository/UserRepository'
import AWS from 'aws-sdk'
import { User } from '../../domain/User'

AWS.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1',
})

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' })

interface PersistedItem {
  auth0UserId: string
  toolConfigs: string
  isActive: boolean
}

export class DynamoUserRepository implements UserRepository {
  public async create(auth0UserId: User['auth0UserId']): Promise<User> {
    const newUser: User = {
      auth0UserId,
      toolConfigs: [],
      isActive: true,
    }

    console.log('newUser', newUser)

    await documentClient
      .put({
        TableName: process.env.DYNAMO_DB_USER_REPOSITORY,
        Item: {
          auth0UserId: newUser.auth0UserId,
          toolConfigs: JSON.stringify(newUser.toolConfigs),
          isActive: newUser.isActive,
        } as PersistedItem,
        ConditionExpression: 'attribute_not_exists(auth0UserId)',
      })
      .promise()

    return newUser
  }
}
