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
import { Button } from '../../../infrastructure/components/button'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user } = useUser()

  const toolConfig = user?.toolConfigs.find((config) => config.id === id)
  const tool = tools?.find((tool) => tool.id === toolConfig?.toolId)

  async function handleSubmit(config: IToolConfig): Promise<void> {
    if (!toolConfig) return
    if (!ToolConfig._isExecutable(config)) {
      alert('Config is incomplete.')
      return
    }

    await updateToolConfig(toolConfig.id, config)
    mutate('/api/users/me')
  }

  async function onEnable(): Promise<void> {
    if (!toolConfig) return
    await updateToolConfig(toolConfig.id, { isActive: true })
    mutate('/api/users/me')
  }

  async function onDisable(): Promise<void> {
    if (!toolConfig) return
    await updateToolConfig(toolConfig.id, { isActive: false })
    mutate('/api/users/me')
  }

  async function handleTestRunClick() {
    await runToolConfig(id as string)
  }

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {tool && toolConfig && (
          <>
            <h1 className="text-4xl font-bold">{tool.name}</h1>
            <div className="w-full border-b border-opacity-80 my-5" />
            {toolConfig.isActive ? (
              <div className="flex items-center justify-between font-bold">
                <p className="text-lg">✅ Enabled</p>
                <Button color="red" onClick={onDisable}>
                  Disable
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between font-bold">
                <p className="text-lg">❌ Disabled</p>
                <Button color="green" onClick={onEnable}>
                  Enable
                </Button>
              </div>
            )}
            <ToolConfigForm initialValues={toolConfig} onSubmit={handleSubmit} />

            <button onClick={handleTestRunClick}>Test Run</button>
          </>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
