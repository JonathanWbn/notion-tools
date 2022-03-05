import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent, useEffect, useState } from 'react'
import { mutate } from 'swr'
import {
  deleteRecurringTask,
  runRecurringTask,
  updateRecurringTask,
  useUser,
} from '../../../infrastructure/api-client'
import { RecurringTaskForm } from '../../../infrastructure/components/recurring-task-form'
import { Spinner, Circle } from '../../../infrastructure/components/icons'
import { Button } from '../../../infrastructure/components/button'
import { IRecurringTask, RecurringTask } from '../../../domain/RecurringTask'

type SavingState = 'INITIAL' | 'SAVING' | 'SAVED'
type TestingState = 'INITIAL' | 'TESTING' | 'TESTED' | 'FAILED'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
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

  const recurringTask = user?.recurringTasks.find((config) => config.id === id)

  async function handleSubmit(settings: IRecurringTask['settings']): Promise<void> {
    if (!recurringTask) return
    setSaving('SAVING')
    await updateRecurringTask(recurringTask.id, { settings })
    await mutate('/api/users/me')
    setSaving('SAVED')
  }

  async function onEnable(): Promise<void> {
    if (!recurringTask) return
    await updateRecurringTask(recurringTask.id, { isActive: true })
    mutate('/api/users/me')
  }

  async function onDelete(): Promise<void> {
    if (!recurringTask) return
    const confirmed = confirm('Are you sure you want to delete this recurring task?')
    if (!confirmed) return

    await deleteRecurringTask(recurringTask.id)
    await mutate('/api/users/me')
    router.push('/user')
  }

  async function onDisable(): Promise<void> {
    if (!recurringTask) return
    await updateRecurringTask(recurringTask.id, { isActive: false })
    mutate('/api/users/me')
  }

  async function handleTestRunClick() {
    setTesting('TESTING')
    try {
      await runRecurringTask(id as string)
      setTesting('TESTED')
    } catch {
      setTesting('FAILED')
    }
  }

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Recurring task</h1>
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
        {recurringTask ? (
          <>
            <RecurringTaskForm initialValues={recurringTask.settings} onAutoSave={handleSubmit} />
            <div className="w-full border-b border-opacity-80 my-5" />
            {recurringTask.isActive ? (
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
                {RecurringTask._isExecutable(recurringTask)
                  ? '✅ Is complete'
                  : '❌ Incomplete configuration'}
              </p>
              {RecurringTask._isExecutable(recurringTask) ? (
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
            <div className="flex justify-center mt-5">
              <Button color="red" onClick={onDelete}>
                Delete
              </Button>
            </div>
          </>
        ) : (
          <Spinner className="animate-spin mx-auto" />
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
