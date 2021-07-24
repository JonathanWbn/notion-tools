import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { FunctionComponent } from 'react'
import {
  addToolToUser,
  deleteUser,
  useDatabases,
  useTools,
  useUser,
} from '../../infrastructure/api-client'
import { Button } from '../../infrastructure/components/button'
import router from 'next/router'

const User: FunctionComponent = () => {
  const { user } = useUser()
  const { tools } = useTools()
  const { databases } = useDatabases()

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {user && (
          <>
            <div className="w-full border-b border-opacity-80 my-5" />
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
            <div className="w-full border-b border-opacity-80 my-5" />
            <h1 className="text-2xl font-bold mb-2">Tools</h1>
            <ul className="list-disc pl-6">
              {user.toolConfigs.map((config) => {
                const tool = tools?.find((tool) => tool.id === config.toolId)
                if (!tool) return null
                const details = [
                  databases?.find((db) => db.id === config.settings.databaseId)?.title[0]
                    .plain_text,
                  config.settings.frequency,
                ].filter(Boolean)

                return (
                  <li className="mb-1" key={config.id}>
                    <Link href={`/user/config/${config.id}`}>
                      <a className="border-b border-link text-link hover:border-black hover:text-black">
                        {!config.isActive && '[disabled]'} <b>{tool.name}</b>{' '}
                        {details.length ? `(${details.join(', ')})` : ''}
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Button
              className="self-end mt-10"
              color="green"
              onClick={async () => {
                if (tools) {
                  const config = await addToolToUser(tools[0].id)
                  router.push(`/user/config/${config.id}`)
                }
              }}
            >
              Add recurring task
            </Button>
            <div className="w-full border-b border-opacity-80 my-5" />
            <div className="flex items-center justify-around">
              <Button
                color="red"
                onClick={async () => {
                  if (tools) {
                    await deleteUser()
                    location.href = 'https://notion-tools.io/api/auth/logout'
                  }
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
          </>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
