import { InputPropertyValue } from '@notionhq/client/build/src/api-types'
import { Tool } from './Tool'

export interface ToolConfig {
  id: string
  toolId: Tool['id']
  config: RecurringToolConfig
  isActive: boolean
  executedAt: string[]
}

export interface RecurringToolConfig {
  databaseId?: string
  frequency?: RecurringFrequency
  weekday?: Weekday
  timeOfDay?: TimeOfDay
  properties?: {
    [propertyId: string]: InputPropertyValue
  }
}

export const configIsComplete = (config: RecurringToolConfig): boolean => {
  if (!config.databaseId || !config.timeOfDay || !config.frequency) {
    return false
  }

  if (config.frequency === 'weekly' && !config.weekday) {
    return false
  }

  return true
}

export const shouldBeExecuted = (toolConfig: ToolConfig): boolean => {
  const { config } = toolConfig
  const now = new Date()
  let latestExecutionDate: Date
  if (config.frequency === 'daily' && config.timeOfDay) {
    const [hour, minute] = config.timeOfDay.split(':')
    const executionToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      +hour,
      +minute
    )
    const executionYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      +hour,
      +minute
    )
    const todaysExecutionIsLater = +executionToday > +now
    latestExecutionDate = todaysExecutionIsLater ? executionYesterday : executionToday
  } else if (config.frequency === 'weekly' && config.weekday && config.timeOfDay) {
    const [hour, minute] = config.timeOfDay.split(':')
    const dayToSet = weekdayMap[config.weekday]
    const currentDay = now.getDay()
    const delta = dayToSet - currentDay
    const executionThisWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + delta,
      +hour,
      +minute
    )
    const executionLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + delta - 7,
      +hour,
      +minute
    )
    const thisWeeksExecutionIsLater = +executionThisWeek > +now
    latestExecutionDate = thisWeeksExecutionIsLater ? executionLastWeek : executionThisWeek
  } else {
    console.log('cannot determine execution')
    return false
  }

  const hasBeenExecutedSince = toolConfig.executedAt.some(
    (executionDate) => +new Date(executionDate) > +latestExecutionDate
  )

  return !hasBeenExecutedSince
}

export interface NotionAccess {
  access_token: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
}

export interface User {
  auth0UserId: string
  toolConfigs: ToolConfig[]
  notionAccess?: NotionAccess
  isActive: boolean
}

export type TimeOfDay = `${Hour}:${Minute}`

export type RecurringFrequency = 'daily' | 'weekly'

export type Weekday = 'mon' | 'tues' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const weekdayMap: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tues: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

export type Hour =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'

export type Minute =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'
  | '48'
  | '49'
  | '50'
  | '51'
  | '52'
  | '53'
  | '54'
  | '55'
  | '56'
  | '57'
  | '58'
  | '59'
