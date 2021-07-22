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

  const toolConfig = user.toolConfigs.find((config) => config.id === id)
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

    await updateToolConfig((toolConfig as IToolConfig).id, config)
    mutate('/api/users/me')
  }

  async function handleTestRunClick() {
    await runToolConfig(id as string)
  }

  return (
    <>
      <h1>Tool: {tool.name}</h1>
      <ToolConfigForm initialValues={toolConfig} onSubmit={handleSubmit} />
      <button onClick={handleTestRunClick}>Test Run</button>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
