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
import router from 'next/router'

const User: FunctionComponent = () => {
  const { user } = useUser()
  const { tools } = useTools()
  const { databases } = useDatabases()

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {user && (
          <>
            <div className="w-full border-b border-opacity-80 my-5" />
            {user.notionAccess ? (
              <div className="flex items-center justify-between font-bold">
                <p className="text-lg">✅ Connected to Notion</p>
                <a
                  className="bg-green-200 py-1 px-8 bg-lightBlue float-right border-blue text-blue hover:text-darkBlue"
                  href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code"
                >
                  <span className="border-b border-darkBlue text-current font-medium">
                    Re-connect Notion
                  </span>
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between font-bold">
                <p className="text-lg">❌ Not connected to Notion</p>
                <a
                  className="bg-green-200 py-1 px-8 bg-lightBlue float-right border-blue text-blue hover:text-darkBlue"
                  href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code"
                >
                  <span className="border-b border-darkBlue text-current font-medium">
                    Re-connect Notion
                  </span>
                </a>
              </div>
            )}
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
            <button
              className="bg-green-200 py-1 px-8 mt-6 bg-lightGreen float-right border-green text-green hover:text-darkGreen"
              onClick={async () => {
                if (tools) {
                  const config = await addToolToUser(tools[0].id)
                  router.push(`/user/config/${config.id}`)
                }
              }}
            >
              <span className="border-b border-darkGreen text-current font-medium">
                Add recurring task
              </span>
            </button>
            <div className="w-full border-b border-opacity-80 mt-20 mb-5" />
            <div className="flex items-center justify-around">
              <button
                className="bg-red-200 py-1 px-8 mt-6 bg-lightRed border-red text-red hover:text-darkRed"
                onClick={async () => {
                  if (tools) {
                    await deleteUser()
                    location.href = 'https://notion-tools.io/api/auth/logout'
                  }
                }}
              >
                <span className="border-b border-darkRed text-current font-medium">
                  Delete account
                </span>
              </button>
              <a
                className="bg-red-200 py-1 px-8 mt-6 bg-lightYellow border-yellow text-yellow hover:text-darkYellow"
                href="mailto:jwieben@hey.com?subject=Bug report: Notion tools"
                target="_blank"
                rel="noreferrer"
              >
                <span className="border-b border-darkYellow text-current font-medium">
                  Report bug 🐛
                </span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
