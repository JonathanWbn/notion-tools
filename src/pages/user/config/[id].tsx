import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent, useEffect, useState } from 'react'
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

type SavingState = 'INITIAL' | 'SAVING' | 'SAVED'
type TestingState = 'INITIAL' | 'TESTING' | 'TESTED' | 'FAILED'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user } = useUser()
  const [savingState, setSaving] = useState<SavingState>('INITIAL')
  const [testingState, setTesting] = useState<TestingState>('INITIAL')

  useEffect(() => {
    if (savingState === 'SAVED') {
      const timeout = setTimeout(() => setSaving('INITIAL'), 2000)
      return () => clearTimeout(timeout)
    }
  }, [savingState])

  useEffect(() => {
    if (testingState === 'TESTED' || testingState === 'FAILED') {
      const timeout = setTimeout(() => setTesting('INITIAL'), 1000)
      return () => clearTimeout(timeout)
    }
  }, [testingState])

  const toolConfig = user?.toolConfigs.find((config) => config.id === id)
  const tool = tools?.find((tool) => tool.id === toolConfig?.toolId)

  async function handleSubmit(settings: IToolConfig['settings']): Promise<void> {
    if (!toolConfig) return
    setSaving('SAVING')
    await updateToolConfig(toolConfig.id, { settings })
    await mutate('/api/users/me')
    setSaving('SAVED')
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
    setTesting('TESTING')
    try {
      await runToolConfig(id as string)
      setTesting('TESTED')
    } catch {
      setTesting('FAILED')
    }
  }

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        {tool && toolConfig && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">{tool.name}</h1>
              {savingState === 'SAVING' && (
                <p className="flex items-center text-gray-500">
                  <Spinner className="animate-spin mr-1" /> Saving...
                </p>
              )}
              {savingState === 'SAVED' && (
                <p className="flex items-center text-gray-500">
                  <Circle className="mr-1" /> Saved.
                </p>
              )}
            </div>
            <div className="w-full border-b border-opacity-80 my-5" />
            <ToolConfigForm initialValues={toolConfig.settings} onAutoSave={handleSubmit} />
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
            <div className="flex items-center justify-between mt-5">
              <p className="text-lg font-bold">
                {ToolConfig._isExecutable(toolConfig)
                  ? '✅ Is complete'
                  : '❌ Incomplete configuration'}
              </p>
              {ToolConfig._isExecutable(toolConfig) ? (
                <Button
                  className="self-end"
                  color={
                    testingState === 'TESTED'
                      ? 'green'
                      : testingState === 'FAILED'
                      ? 'red'
                      : 'yellow'
                  }
                  onClick={handleTestRunClick}
                  disabled={testingState !== 'INITIAL'}
                >
                  {testingState === 'TESTING'
                    ? 'In progress...'
                    : testingState === 'TESTED'
                    ? 'Success'
                    : testingState === 'FAILED'
                    ? 'Not successful'
                    : 'Test'}
                </Button>
              ) : (
                <p className="font-thin">Select a database and frequency.</p>
              )}
            </div>
            <div className="w-full border-b border-opacity-80 my-5" />
          </>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User

function Spinner({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  )
}

function Circle({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}
