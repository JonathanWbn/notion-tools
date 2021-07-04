import { Tool } from './Tool'

export interface ToolConfig {
  id: string
  toolId: Tool['id']
  config: RecurringToolConfig
  isActive: boolean
}

export interface RecurringToolConfig {
  databaseId?: string
  frequency?: RecurringFrequency
  weekday?: Weekday
  timeOfDay?: TimeOfDay
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
