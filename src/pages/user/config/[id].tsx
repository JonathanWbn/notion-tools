import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { mutate } from 'swr'
import { IToolConfig, ToolConfig } from '../../../domain/User'
import {
  runToolConfig,
  updateToolConfig,
  useTools,
  useUser,
} from '../../../infrastructure/api-client'
import { ToolConfigForm } from '../../../infrastructure/components/tool-config-form'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user } = useUser()

  if (!tools || !user) return <h1>loading...</h1>

  const toolConfig = user.toolConfigs.find((config) => config.id === id) as IToolConfig
  if (!toolConfig) {
    return <h1>No config found.</h1>
  }
  const tool = tools.find((tool) => tool.id === toolConfig.toolId)
  if (!tool) {
    return <h1>No tool found.</h1>
  }

  async function handleSubmit(config: IToolConfig): Promise<void> {
    if (!ToolConfig._isExecutable(config)) {
      alert('Config is incomplete.')
      return
    }

    await updateToolConfig(toolConfig.id, config)
    mutate('/api/users/me')
  }

  async function onEnable(): Promise<void> {
    await updateToolConfig(toolConfig.id, { isActive: true })
    mutate('/api/users/me')
  }

  async function onDisable(): Promise<void> {
    await updateToolConfig(toolConfig.id, { isActive: false })
    mutate('/api/users/me')
  }

  async function handleTestRunClick() {
    await runToolConfig(id as string)
  }

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold">{tool.name}</h1>
        <div className="w-full border-b border-opacity-80 my-5" />
        {toolConfig.isActive ? (
          <div className="flex items-center justify-between font-bold">
            <p className="text-lg">✅ Enabled</p>
            <button
              className="bg-green-200 py-1 px-8 bg-lightRed float-right border-red text-red hover:text-darkRed"
              onClick={onDisable}
            >
              <span className="border-b border-darkRed text-current font-medium">Disable</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between font-bold">
            <p className="text-lg">❌ Disabled</p>
            <button
              className="bg-green-200 py-1 px-8 bg-lightGreen float-right border-green text-green hover:text-darkGreen"
              onClick={onEnable}
            >
              <span className="border-b border-darkGreen text-current font-medium">Enable</span>
            </button>
          </div>
        )}
        <ToolConfigForm initialValues={toolConfig} onSubmit={handleSubmit} />

        <button onClick={handleTestRunClick}>Test Run</button>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
