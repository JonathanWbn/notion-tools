import { RecurringTask } from './RecurringTask'

export interface User {
  userId: string
  recurringTasks: RecurringTask[]
  notionAccess?: NotionAccess
}

export interface NotionAccess {
  access_token: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
}
