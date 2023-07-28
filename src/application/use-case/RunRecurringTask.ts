import { Client } from '@notionhq/client/build/src'
import { InputPropertyValue, RichTextInput } from '@notionhq/client/build/src/api-types'
import { add, format } from 'date-fns'
import { RecurringTask, isExecutable } from '../../domain/RecurringTask'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface RunRecurringTaskRequest {
  userId: User['userId']
  recurringTaskId: RecurringTask['id']
}

export class RunRecurringTask {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: RunRecurringTaskRequest): Promise<void> {
    const user = await this.userRepository.getById(request.userId)

    const recurringTask = user.recurringTasks.find(
      (config) => config.id === request.recurringTaskId
    )

    if (!recurringTask) {
      throw new Error('No config found')
    }
    if (!isExecutable(recurringTask)) {
      throw new Error('Incomplete config.')
    }
    if (!user.notionAccess) {
      throw new Error('No access to Notion.')
    }

    const notion = new Client({ auth: user.notionAccess.access_token })
    await notion.pages.create({
      parent: { database_id: recurringTask.settings.databaseId as string },
      properties: this.parseProperties(recurringTask.settings.properties),
    })

    await this.userRepository.update(user.userId, {
      ...user,
      recurringTasks: user.recurringTasks.map((config) =>
        config.id === request.recurringTaskId
          ? { ...config, lastExecutedAt: new Date().toISOString() }
          : config
      ),
    })
  }

  private parseProperties(
    properties: RecurringTask['settings']['properties']
  ): Record<string, InputPropertyValue> {
    const parsedProperties: Record<string, InputPropertyValue> = {}

    for (const key in properties) {
      const value = properties[key]

      if (value.type === 'date') {
        parsedProperties[key] = {
          id: value.id,
          type: value.type,
          date: { start: this.parseDate(value.date.start) },
        }
      } else if (value.type === 'title') {
        const parsedTitle = this.parseTitle(value.title)
        if (parsedTitle) {
          parsedProperties[key] = {
            id: value.id,
            type: value.type,
            title: [
              {
                type: 'text',
                plain_text: parsedTitle,
                text: { content: parsedTitle },
                annotations: {
                  bold: false,
                  code: false,
                  color: 'default',
                  italic: false,
                  strikethrough: false,
                  underline: false,
                },
              },
            ],
          }
        }
      } else {
        parsedProperties[key] = value
      }
    }

    return parsedProperties
  }

  private parseDate(date: string): string {
    const now = new Date()

    let parsedDate = now

    switch (date) {
      case 'today':
        parsedDate = now
        break
      case 'in1day':
        parsedDate = add(now, { days: 1 })
        break
      case 'in1week':
        parsedDate = add(now, { weeks: 1 })
        break
      case 'in1month':
        parsedDate = add(now, { months: 1 })
        break
      case 'in1year':
        parsedDate = add(now, { years: 1 })
        break
    }

    return parsedDate.toISOString().substring(0, 10)
  }

  private parseTitle(title: RichTextInput[]): string | undefined {
    const titleString = title
      .filter((el) => el.type === 'text')
      .map((el) => el.plain_text)
      .join('')

    if (titleString === 'formatted_day') {
      return format(Date.now(), 'LLL do')
    }

    return titleString || undefined
  }
}
