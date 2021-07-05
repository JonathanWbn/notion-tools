import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { mutate } from 'swr'
import { configIsComplete, ToolConfig } from '../../../domain/User'
import { updateToolConfig, useTools, useUser } from '../../../infrastructure/client/api-client'
import { ToolConfigForm } from '../../../infrastructure/client/components/tool-config-form'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user } = useUser()

  if (!tools || !user) return <h1>loading...</h1>

  const toolConfig = user.toolConfigs.find((config) => config.id === id)
  if (!toolConfig) {
    return <h1>No config found.</h1>
  }
  const tool = tools.find((tool) => tool.id === toolConfig.toolId)
  if (!tool) {
    return <h1>No tool found.</h1>
  }

  async function handleSubmit(config: ToolConfig): Promise<void> {
    if (!configIsComplete(config['config'])) {
      alert('Config is incomplete.')
      return
    }

    await updateToolConfig((toolConfig as ToolConfig).id, config)
    mutate('/api/users/me')
  }

  return (
    <>
      <h1>Tool: {tool.name}</h1>
      <ToolConfigForm initialValues={toolConfig} onSubmit={handleSubmit} />
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
