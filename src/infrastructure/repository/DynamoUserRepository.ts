import { UserRepository } from '../../application/repository/UserRepository'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { User } from '../../domain/User'

const dbClient = new DynamoDB({ region: 'eu-central-1' })

export interface PersistedItem {
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

    await dbClient.putItem({
      TableName: process.env.DYNAMO_DB_USER_REPOSITORY,
      Item: {
        auth0UserId: { S: newUser.auth0UserId },
        toolConfigs: { S: JSON.stringify(newUser.toolConfigs) },
        isActive: { BOOL: newUser.isActive },
      },
      ConditionExpression: 'attribute_not_exists(auth0UserId)',
    })

    return newUser
  }
}
