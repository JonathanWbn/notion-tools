import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { UserRepository } from '../../application/repository/UserRepository'
import { DatabaseVisualization } from '../../domain/DatabaseVisualization'
import { RecurringTask } from '../../domain/RecurringTask'
import { User } from '../../domain/User'

const { DYNAMO_DB_USER_REPOSITORY, MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY } =
  process.env as Record<string, string>

const documentClient = new DynamoDBClient({
  credentials: {
    accessKeyId: MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: MY_AWS_SECRET_ACCESS_KEY,
  },
  region: 'eu-central-1',
})

interface PersistedItem {
  userId: string
  recurringTasks: string
  databaseVisualizations: string
  notionAccess: string
}

export class DynamoUserRepository implements UserRepository {
  public async create(userId: User['userId']): Promise<User> {
    const newUser: User = {
      userId,
      recurringTasks: [],
      databaseVisualizations: [],
    }

    await documentClient.send(
      new PutItemCommand({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Item: {
          userId: { S: newUser.userId },
          recurringTasks: { S: JSON.stringify(newUser.recurringTasks) },
          databaseVisualizations: { S: JSON.stringify(newUser.databaseVisualizations) },
        },
        ConditionExpression: 'attribute_not_exists(userId)',
      })
    )

    return newUser
  }

  public async update(userId: User['userId'], user: User): Promise<User> {
    await documentClient.send(
      new UpdateItemCommand({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Key: { userId: { S: userId } },
        UpdateExpression:
          'set recurringTasks = :recurringTasks, notionAccess = :notionAccess, databaseVisualizations = :databaseVisualizations',
        ExpressionAttributeValues: {
          ':recurringTasks': { S: JSON.stringify(user.recurringTasks) },
          ':databaseVisualizations': { S: JSON.stringify(user.databaseVisualizations) },
          ':notionAccess': { S: JSON.stringify(user.notionAccess) || '' },
        },
      })
    )
    return user
  }

  public async delete(userId: User['userId']): Promise<void> {
    await documentClient.send(
      new DeleteItemCommand({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Key: { userId: { S: userId } },
      })
    )
  }

  public async getById(userId: User['userId']): Promise<User> {
    const { Item } = await documentClient.send(
      new GetItemCommand({
        TableName: DYNAMO_DB_USER_REPOSITORY,
        Key: { userId: { S: userId } },
      })
    )

    if (!Item) {
      throw Error('No User found.')
    }

    const user: PersistedItem = {
      userId: Item.userId?.S || '',
      recurringTasks: Item.recurringTasks?.S || '',
      databaseVisualizations: Item.databaseVisualizations?.S || '',
      notionAccess: Item.notionAccess?.S || '',
    }

    return this.parseUser(user)
  }

  public async getAll(): Promise<User[]> {
    const results = await documentClient.send(
      new ScanCommand({ TableName: DYNAMO_DB_USER_REPOSITORY })
    )

    if (!results.Items) {
      throw Error('No User found.')
    }

    return results.Items.map((item) => {
      const user: PersistedItem = {
        userId: item.userId?.S || '',
        recurringTasks: item.recurringTasks?.S || '',
        databaseVisualizations: item.databaseVisualizations?.S || '',
        notionAccess: item.notionAccess?.S || '',
      }
      return this.parseUser(user)
    })
  }

  private parseUser(user: PersistedItem): User {
    return {
      ...user,
      recurringTasks: JSON.parse(user.recurringTasks || '[]') as RecurringTask[],
      databaseVisualizations: JSON.parse(
        user.databaseVisualizations || '[]'
      ) as DatabaseVisualization[],
      notionAccess: user.notionAccess ? JSON.parse(user.notionAccess) : undefined,
    }
  }
}
