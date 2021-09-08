import { UserRepository } from '../../application/repository/UserRepository'
import AWS from 'aws-sdk'
import { User } from '../../domain/User'
import { IRecurringTask, RecurringTask } from '../../domain/RecurringTask'

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
  recurringTasks: string
  notionAccess: string
}

export class DynamoUserRepository implements UserRepository {
  public async create(userId: User['userId']): Promise<User> {
    const newUser: User = {
      userId,
      recurringTasks: [],
    }

    await documentClient
      .put({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Item: {
          userId: newUser.userId,
          recurringTasks: JSON.stringify(newUser.recurringTasks),
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
        UpdateExpression: 'set recurringTasks = :configs, notionAccess = :notionAccess',
        ExpressionAttributeValues: {
          ':configs': JSON.stringify(user.recurringTasks),
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
      recurringTasks: (JSON.parse(user.recurringTasks || '[]') as IRecurringTask[]).map(
        (recurringTask) =>
          new RecurringTask(
            recurringTask.id,
            recurringTask.settings,
            recurringTask.isActive,
            recurringTask.createdAt,
            recurringTask.lastExecutedAt
          )
      ),
      notionAccess: user.notionAccess ? JSON.parse(user.notionAccess) : undefined,
    }
  }
}
