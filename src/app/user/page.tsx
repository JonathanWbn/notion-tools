import { CreateDatabaseVisualization } from '../../application/use-case/CreateDatabaseVisualization'
import { CreateRecurringTask } from '../../application/use-case/CreateRecurringTask'
import { Button } from '../../components/button'
import { DeleteAccountButton } from '../../components/delete-account-button'
import { DynamoUserRepository } from '../../infrastructure/repository/DynamoUserRepository'
import { getDatabases, getUser } from './actions'
import { Database, TitlePropertyValue } from '@notionhq/client/build/src/api-types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const userRepository = new DynamoUserRepository()
const createRecurringTask = new CreateRecurringTask(userRepository)
const createDatabaseVisualization = new CreateDatabaseVisualization(userRepository)

const UserPage = async () => {
  const user = await getUser()
  if (!user || !user.notionAccess) redirect('/')
  const databases = await getDatabases(user.notionAccess.access_token)

  async function addRecurringTask() {
    'use server'
    if (!user) return
    const config = await createRecurringTask.invoke({ userId: user.userId })
    redirect(`/user/recurring-task/${config.id}`)
  }

  async function addDatabaseVisualization() {
    'use server'
    if (!user) return
    const config = await createDatabaseVisualization.invoke({ userId: user.userId })
    redirect(`/user/database-visualization/${config.id}`)
  }

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="w-full border-b border-opacity-80 my-5" />
        <div className="flex items-center justify-between font-bold">
          <p className="text-lg">
            {user.notionAccess ? '✅ Connected to Notion' : '❌ Not connected to Notion'}
          </p>
          <Button
            color="blue"
            href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code&owner=user"
          >
            {user.notionAccess ? 'Re-connect Notion' : 'Connect Notion'}
          </Button>
        </div>
        <div className="w-full border-b border-opacity-80 my-5" />
        <h1 className="text-2xl font-bold mb-2">
          {user.recurringTasks.length === 0 ? 'No Recurring Tasks Yet' : 'Recurring Tasks'}
        </h1>
        {user.recurringTasks.length > 0 && (
          <ul className="list-disc pl-6">
            {user.recurringTasks.map((config) => {
              const details = [
                Object.values(config.settings.properties || {}).find(
                  (el): el is TitlePropertyValue => el.type === 'title'
                )?.title[0].plain_text,
                getDatabaseName(config.settings.databaseId),
                config.settings.frequency,
              ].filter(Boolean)

              return (
                <li className="mb-1" key={config.id}>
                  <Link
                    href={`/user/recurring-task/${config.id}`}
                    className="border-b border-link text-link hover:border-black hover:text-black"
                  >
                    {!config.isActive && '[disabled]'}{' '}
                    {details.length ? details.join(', ') : <i>Not configured yet</i>}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
        <form action={addRecurringTask}>
          <Button className="self-end mt-10" color="green" type="submit">
            Add recurring task
          </Button>
        </form>

        <div className="w-full border-b border-opacity-80 my-5" />

        <h1 className="text-2xl font-bold mb-2">
          {user.databaseVisualizations.length === 0
            ? 'No Database Visualizations Yet'
            : 'Database Visualizations'}
        </h1>
        {user.databaseVisualizations.length > 0 && (
          <ul className="list-disc pl-6">
            {user.databaseVisualizations.map((config) => {
              const database = getDatabase(config.settings.databaseId)
              const details = [
                getDatabaseName(config.settings.databaseId),
                getPropertyName(database, config.settings, 'xAxis'),
                getPropertyName(database, config.settings, 'yAxis'),
              ].filter(Boolean)

              return (
                <li className="mb-1" key={config.id}>
                  <Link
                    href={`/user/database-visualization/${config.id}`}
                    className="border-b border-link text-link hover:border-black hover:text-black"
                  >
                    {details.length ? details.join(', ') : <i>Not configured yet</i>}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
        <form action={addDatabaseVisualization}>
          <Button className="self-end mt-10" color="green" type="submit">
            Add database visualization
          </Button>
        </form>
        <div className="w-full border-b border-opacity-80 my-5" />
        <div className="flex items-center justify-around">
          <DeleteAccountButton />
          <Button
            color="yellow"
            href="mailto:jwieben@hey.com?subject=Bug report: Notion tools"
            isExternal
          >
            Report bug 🐛
          </Button>
        </div>
      </div>
    </div>
  )

  function getDatabase(databaseId: string | undefined): Database | undefined {
    return databases?.find((db) => db.id === databaseId)
  }

  function getDatabaseName(databaseId: string | undefined): string | undefined {
    return getDatabase(databaseId)?.title[0].plain_text
  }

  function getPropertyName(db: Database | undefined, settings: any, fieldName: string) {
    return Object.entries(db?.properties || {}).find(
      ([, val]) => val.id === settings[fieldName]
    )?.[0]
  }
}

export default UserPage
