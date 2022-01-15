import { InputPropertyValue } from '@notionhq/client/build/src/api-types'
import { weekdayMap } from '../utils'
import { isFuture, sub, set, setDay, isAfter, setDate, add, isBefore } from 'date-fns'

export class RecurringTask implements IRecurringTask {
  static _isExecutable(recurringTask: IRecurringTask): boolean {
    if (
      !recurringTask.settings.databaseId ||
      !recurringTask.settings.timeOfDay ||
      !recurringTask.settings.frequency
    ) {
      return false
    }

    if (recurringTask.settings.frequency === 'weekly' && !recurringTask.settings.weekday) {
      return false
    }

    if (recurringTask.settings.frequency === 'monthly' && !recurringTask.settings.dayOfMonth) {
      return false
    }

    return true
  }

  constructor(
    public readonly id: string,
    public readonly settings: RecurringTaskSettings,
    public readonly isActive: boolean,
    public readonly createdAt?: string,
    public readonly lastExecutedAt?: string
  ) {}

  get isExecutable(): boolean {
    return RecurringTask._isExecutable(this)
  }

  public shouldBeExecutedNow(): boolean {
    if (!this.isExecutable) {
      return false
    }

    const now = new Date()
    let latestScheduledExecution: Date

    const [hour, minute] = (this.settings.timeOfDay as TimeOfDay).split(':')

    if (this.settings.frequency === 'daily') {
      const executionToday = set(now, {
        hours: +hour,
        minutes: +minute,
        seconds: 0,
        milliseconds: 0,
      })
      const executionYesterday = sub(executionToday, { days: 1 })

      latestScheduledExecution = isFuture(executionToday) ? executionYesterday : executionToday
    } else if (this.settings.frequency === 'weekly') {
      const dayToSet = weekdayMap[this.settings.weekday as Weekday]
      const executionThisWeek = setDay(
        set(now, { hours: +hour, minutes: +minute, seconds: 0, milliseconds: 0 }),
        dayToSet
      )
      const executionLastWeek = sub(executionThisWeek, { days: 7 })

      latestScheduledExecution = isFuture(executionThisWeek) ? executionLastWeek : executionThisWeek
    } else if (this.settings.frequency === 'monthly') {
      const dayOfMonthToSet = this.settings.dayOfMonth
      const executionThisMonth = setDate(
        set(now, { hours: +hour, minutes: +minute, seconds: 0, milliseconds: 0 }),
        dayOfMonthToSet as number
      )
      const executionLastMonth = sub(executionThisMonth, { months: 1 })

      latestScheduledExecution = isFuture(executionThisMonth)
        ? executionLastMonth
        : executionThisMonth
    } else {
      throw new Error(`Invalid frequency ${this.settings.frequency}`)
    }

    const hasBeenExecutedSince =
      this.lastExecutedAt && isAfter(new Date(this.lastExecutedAt), latestScheduledExecution)

    const isWithinOneHourOfScheduledExecution = isBefore(
      new Date(),
      add(latestScheduledExecution, { hours: 1 })
    )

    return (
      !hasBeenExecutedSince &&
      (!this.createdAt || isAfter(latestScheduledExecution, new Date(this.createdAt))) &&
      isWithinOneHourOfScheduledExecution
    )
  }

  public copyWith({
    settings,
    isActive,
    lastExecutedAt,
    createdAt,
  }: Partial<RecurringTask>): RecurringTask {
    return new RecurringTask(
      this.id,
      settings || this.settings,
      isActive !== undefined ? isActive : this.isActive,
      createdAt || this.createdAt,
      lastExecutedAt || this.lastExecutedAt
    )
  }
}

export interface IRecurringTask {
  id: string
  settings: RecurringTaskSettings
  isActive: boolean
  createdAt?: string
  lastExecutedAt?: string
}

export interface RecurringTaskSettings {
  databaseId?: string
  frequency?: 'daily' | 'weekly' | 'monthly'
  weekday?: Weekday
  dayOfMonth?: number
  timeOfDay?: TimeOfDay
  properties?: {
    [propertyId: string]: InputPropertyValue
  }
}
