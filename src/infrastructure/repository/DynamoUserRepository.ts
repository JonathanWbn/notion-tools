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
  userId: string
  toolConfigs: string
  notionAccess: string
  isActive: boolean
}

export class DynamoUserRepository implements UserRepository {
  public async create(userId: User['userId']): Promise<User> {
    const newUser: User = {
      userId,
      toolConfigs: [],
      isActive: true,
    }

    await documentClient
      .put({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Item: {
          userId: newUser.userId,
          toolConfigs: JSON.stringify(newUser.toolConfigs),
          isActive: newUser.isActive,
        } as PersistedItem,
        ConditionExpression: 'attribute_not_exists(userId)',
      })
      .promise()

    return newUser
  }

  public async update(userId: User['userId'], user: User): Promise<User> {
    await documentClient
      .update({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Key: {
          userId,
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

  public async delete(userId: User['userId']): Promise<void> {
    await documentClient.delete({ TableName: DYNAMO_DB_USER_REPOSITORY, Key: { userId } }).promise()
  }

  public async getById(userId: User['userId']): Promise<User> {
    const results = await documentClient
      .query({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
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
      toolConfigs: (JSON.parse(user.toolConfigs || '[]') as IToolConfig[]).map(
        (toolConfig) =>
          new ToolConfig(
            toolConfig.id,
            toolConfig.toolId,
            toolConfig.settings,
            toolConfig.isActive,
            toolConfig.lastExecutedAt
          )
      ),
      notionAccess: user.notionAccess ? JSON.parse(user.notionAccess) : undefined,
    }
  }
}
