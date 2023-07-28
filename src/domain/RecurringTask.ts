import { InputPropertyValue } from '@notionhq/client/build/src/api-types'
import { weekdayMap } from '../utils'
import { isFuture, sub, set, setDay, isAfter, setDate, add, isBefore } from 'date-fns'

export function isExecutable(recurringTask: RecurringTask): boolean {
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

export function shouldBeExecutedNow(recurringTask: RecurringTask): boolean {
  if (!isExecutable(recurringTask)) {
    return false
  }

  const now = new Date()
  let latestScheduledExecution: Date

  const [hour, minute] = (recurringTask.settings.timeOfDay as TimeOfDay).split(':')

  if (recurringTask.settings.frequency === 'daily') {
    const executionToday = set(now, {
      hours: +hour,
      minutes: +minute,
      seconds: 0,
      milliseconds: 0,
    })
    const executionYesterday = sub(executionToday, { days: 1 })

    latestScheduledExecution = isFuture(executionToday) ? executionYesterday : executionToday
  } else if (recurringTask.settings.frequency === 'weekly') {
    const dayToSet = weekdayMap[recurringTask.settings.weekday as Weekday]
    const executionThisWeek = setDay(
      set(now, { hours: +hour, minutes: +minute, seconds: 0, milliseconds: 0 }),
      dayToSet
    )
    const executionLastWeek = sub(executionThisWeek, { days: 7 })

    latestScheduledExecution = isFuture(executionThisWeek) ? executionLastWeek : executionThisWeek
  } else if (recurringTask.settings.frequency === 'monthly') {
    const dayOfMonthToSet = recurringTask.settings.dayOfMonth
    const executionThisMonth = setDate(
      set(now, { hours: +hour, minutes: +minute, seconds: 0, milliseconds: 0 }),
      dayOfMonthToSet as number
    )
    const executionLastMonth = sub(executionThisMonth, { months: 1 })

    latestScheduledExecution = isFuture(executionThisMonth)
      ? executionLastMonth
      : executionThisMonth
  } else {
    throw new Error(`Invalid frequency ${recurringTask.settings.frequency}`)
  }

  const hasBeenExecutedSince =
    recurringTask.lastExecutedAt &&
    isAfter(new Date(recurringTask.lastExecutedAt), latestScheduledExecution)

  const isWithinOneHourOfScheduledExecution = isBefore(
    new Date(),
    add(latestScheduledExecution, { hours: 1 })
  )

  return (
    !hasBeenExecutedSince &&
    (!recurringTask.createdAt ||
      isAfter(latestScheduledExecution, new Date(recurringTask.createdAt))) &&
    isWithinOneHourOfScheduledExecution
  )
}

export interface RecurringTask {
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
