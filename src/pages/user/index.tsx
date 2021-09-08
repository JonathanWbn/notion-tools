import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { FunctionComponent } from 'react'
import {
  addDatabaseVisualization,
  addRecurringTask,
  deleteUser,
  useDatabases,
  useUser,
} from '../../infrastructure/api-client'
import { Button } from '../../infrastructure/components/button'
import router from 'next/router'
import { Spinner } from '../../infrastructure/components/icons'

const User: FunctionComponent = () => {
  const { user } = useUser()
  const { databases } = useDatabases()

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="w-full border-b border-opacity-80 my-5" />
        {user ? (
          <div className="flex items-center justify-between font-bold">
            <p className="text-lg">
              {user.notionAccess ? '✅ Connected to Notion' : '❌ Not connected to Notion'}
            </p>
            <Button
              color="blue"
              href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code"
            >
              {user.notionAccess ? 'Re-connect Notion' : 'Connect Notion'}
            </Button>
          </div>
        ) : (
          <Spinner className="animate-spin mx-auto" />
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-2">
              {user.recurringTasks.length > 0 ? 'Recurring Tasks' : 'No Recurring Tasks Yet'}
            </h1>
            {user.recurringTasks.length > 0 && (
              <ul className="list-disc pl-6">
                {user.recurringTasks.map((config) => {
                  const details = [
                    ...Object.values(config.settings.properties || {}).map(
                      (prop) => prop.type === 'title' && prop.title[0].plain_text
                    ),
                    databases?.find((db) => db.id === config.settings.databaseId)?.title[0]
                      .plain_text,
                    config.settings.frequency,
                  ].filter(Boolean)

                  return (
                    <li className="mb-1" key={config.id}>
                      <Link href={`/user/recurring-task/${config.id}`}>
                        <a className="border-b border-link text-link hover:border-black hover:text-black">
                          {!config.isActive && '[disabled]'}{' '}
                          {details.length ? details.join(', ') : <i>Not configured yet</i>}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <Button
              className="self-end mt-10"
              color="green"
              onClick={async () => {
                const config = await addRecurringTask()
                router.push(`/user/recurring-task/${config.id}`)
              }}
            >
              Add recurring task
            </Button>

            <div className="w-full border-b border-opacity-80 my-5" />

            <h1 className="text-2xl font-bold mb-2">
              {user.databaseVisualizations.length > 0
                ? 'Database Visualizations'
                : 'No Database Visualizations Yet'}
            </h1>
            {user.databaseVisualizations.length > 0 && (
              <ul className="list-disc pl-6">
                {user.databaseVisualizations.map((config) => {
                  return (
                    <li className="mb-1" key={config.id}>
                      <Link href={`/user/database-visualization/${config.id}`}>
                        <a className="border-b border-link text-link hover:border-black hover:text-black">
                          TODO
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <Button
              className="self-end mt-10"
              color="green"
              onClick={async () => {
                const config = await addDatabaseVisualization()
                router.push(`/user/database-visualization/${config.id}`)
              }}
            >
              Add database visualization
            </Button>
          </>
        ) : (
          <Spinner className="animate-spin mx-auto" />
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        {user ? (
          <div className="flex items-center justify-around">
            <Button
              color="red"
              onClick={async () => {
                await deleteUser()
                location.href = 'https://notion-tools.io/api/auth/logout'
              }}
            >
              Delete account
            </Button>
            <Button
              color="yellow"
              href="mailto:jwieben@hey.com?subject=Bug report: Notion tools"
              isExternal
            >
              Report bug 🐛
            </Button>
          </div>
        ) : (
          <Spinner className="animate-spin mx-auto" />
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
