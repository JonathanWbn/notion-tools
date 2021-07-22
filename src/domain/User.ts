import { InputPropertyValue } from '@notionhq/client/build/src/api-types'
import { weekdayMap } from '../utils'
import { Tool } from './Tool'
import { isFuture, sub, set, setDay, isAfter } from 'date-fns'

export interface User {
  userId: string
  toolConfigs: ToolConfig[]
  notionAccess?: NotionAccess
  isActive: boolean
}

export interface NotionAccess {
  access_token: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
}

export class ToolConfig implements IToolConfig {
  static _isExecutable(toolConfig: IToolConfig): boolean {
    if (
      !toolConfig.settings.databaseId ||
      !toolConfig.settings.timeOfDay ||
      !toolConfig.settings.frequency
    ) {
      return false
    }

    if (toolConfig.settings.frequency === 'weekly' && !toolConfig.settings.weekday) {
      return false
    }

    if (!toolConfig.settings.properties) {
      return false
    }

    return true
  }

  constructor(
    public readonly id: string,
    public readonly toolId: Tool['id'],
    public readonly settings: RecurringToolSettings,
    public readonly isActive: boolean,
    public readonly lastExecutedAt?: string
  ) {}

  get isExecutable(): boolean {
    return ToolConfig._isExecutable(this)
  }

  public shouldBeExecutedNow(): boolean {
    if (!this.isExecutable) {
      return false
    }

    const now = new Date()
    let latestScheduledExecution: Date

    const [hour, minute] = (this.settings.timeOfDay as TimeOfDay).split(':')

    if (this.settings.frequency === 'daily') {
      const executionToday = set(now, { hours: +hour, minutes: +minute })
      const executionYesterday = sub(executionToday, { days: 1 })

      latestScheduledExecution = isFuture(executionToday) ? executionYesterday : executionToday
    } else if (this.settings.frequency === 'weekly') {
      const dayToSet = weekdayMap[this.settings.weekday as Weekday]
      const executionThisWeek = setDay(set(now, { hours: +hour, minutes: +minute }), dayToSet)
      const executionLastWeek = sub(executionThisWeek, { days: 7 })

      latestScheduledExecution = isFuture(executionThisWeek) ? executionLastWeek : executionThisWeek
    } else {
      throw new Error(`Invalid frequency ${this.settings.frequency}`)
    }

    const hasBeenExecutedSince =
      this.lastExecutedAt && isAfter(new Date(this.lastExecutedAt), latestScheduledExecution)

    return !hasBeenExecutedSince
  }

  public copyWith({ toolId, settings, isActive, lastExecutedAt }: Partial<ToolConfig>): ToolConfig {
    return new ToolConfig(
      this.id,
      toolId || this.toolId,
      settings || this.settings,
      isActive !== undefined ? isActive : this.isActive,
      lastExecutedAt || this.lastExecutedAt
    )
  }
}

export interface IToolConfig {
  id: string
  toolId: Tool['id']
  settings: RecurringToolSettings
  isActive: boolean
  lastExecutedAt?: string
}

export interface RecurringToolSettings {
  databaseId?: string
  frequency?: 'daily' | 'weekly'
  weekday?: Weekday
  timeOfDay?: TimeOfDay
  properties?: {
    [propertyId: string]: InputPropertyValue
  }
}
