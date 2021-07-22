import { UserRepository } from '../../application/repository/UserRepository'
import AWS from 'aws-sdk'
import { IToolConfig, ToolConfig, User } from '../../domain/User'

const { DYNAMO_DB_USER_REPOSITORY, MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY } =
  process.env as Record<string, string>

AWS.config.update({
  accessKeyId: MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: MY_AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1',
})

const documentClient = new AWS.DynamoDB.DocumentClient()

interface PersistedItem {
  auth0UserId: string
  toolConfigs: string
  notionAccess: string
  isActive: boolean
}

export class DynamoUserRepository implements UserRepository {
  public async create(auth0UserId: User['auth0UserId']): Promise<User> {
    const newUser: User = {
      auth0UserId,
      toolConfigs: [],
      isActive: true,
    }

    await documentClient
      .put({
        TableName: DYNAMO_DB_USER_REPOSITORY,
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

  public async update(auth0UserId: User['auth0UserId'], user: User): Promise<User> {
    await documentClient
      .update({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Key: {
          auth0UserId,
        },
        UpdateExpression: 'set toolConfigs = :configs, notionAccess = :notionAccess',
        ExpressionAttributeValues: {
          ':configs': JSON.stringify(user.toolConfigs),
          ':notionAccess': JSON.stringify(user.notionAccess) || '',
        },
      })
      .promise()

    return user
  }

  public async getById(auth0UserId: User['auth0UserId']): Promise<User> {
    const results = await documentClient
      .query({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        KeyConditionExpression: 'auth0UserId = :auth0UserId',
        ExpressionAttributeValues: { ':auth0UserId': auth0UserId },
      })
      .promise()

    if (!results.Items) {
      throw Error('No User found.')
    }

    const user = results.Items[0] as PersistedItem

    return this.parseUser(user)
  }

  public async getAll(): Promise<User[]> {
    const results = await documentClient.scan({ TableName: DYNAMO_DB_USER_REPOSITORY }).promise()

    if (!results.Items) {
      throw Error('No User found.')
    }

    return (results.Items as PersistedItem[]).map(this.parseUser)
  }

  private parseUser(user: PersistedItem): User {
    return {
      ...user,
      toolConfigs: JSON.parse(user.toolConfigs || '[]').map(this.parseToolConfig),
      notionAccess: user.notionAccess ? JSON.parse(user.notionAccess) : undefined,
    }
  }

  private parseToolConfig(toolConfig: IToolConfig): ToolConfig {
    return new ToolConfig(
      toolConfig.id,
      toolConfig.toolId,
      toolConfig.settings,
      toolConfig.isActive,
      toolConfig.lastExecutedAt
    )
  }
}
