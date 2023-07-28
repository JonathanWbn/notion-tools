'use client'

import { useRouter } from 'next/navigation'
import { RecurringTask, isExecutable } from '../domain/RecurringTask'
import { useEffect, useState } from 'react'
import {
  deleteRecurringTask,
  runRecurringTask,
  updateRecurringTask,
} from '../infrastructure/api-client'
import { Circle, Spinner } from './icons'
import { RecurringTaskForm } from './recurring-task-form'
import { Button } from './button'

type SavingState = 'INITIAL' | 'SAVING' | 'SAVED'
type TestingState = 'INITIAL' | 'TESTING' | 'TESTED' | 'FAILED'

export const RecurringTaskView = ({ recurringTask }: { recurringTask: RecurringTask }) => {
  const router = useRouter()
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

  async function handleSubmit(settings: RecurringTask['settings']): Promise<void> {
    setSaving('SAVING')
    await updateRecurringTask(recurringTask.id, { settings })
    router.refresh()
    setSaving('SAVED')
  }

  async function onEnable(): Promise<void> {
    await updateRecurringTask(recurringTask.id, { isActive: true })
    router.refresh()
  }

  async function onDelete(): Promise<void> {
    const confirmed = confirm('Are you sure you want to delete this recurring task?')
    if (!confirmed) return

    await deleteRecurringTask(recurringTask.id)
    router.refresh()
    router.push('/user')
  }

  async function onDisable(): Promise<void> {
    await updateRecurringTask(recurringTask.id, { isActive: false })
    router.refresh()
  }

  async function handleTestRunClick() {
    setTesting('TESTING')
    try {
      await runRecurringTask(recurringTask.id)
      setTesting('TESTED')
    } catch {
      setTesting('FAILED')
    }
  }

  return (
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
          {isExecutable(recurringTask) ? '✅ Is complete' : '❌ Incomplete configuration'}
        </p>
        {isExecutable(recurringTask) ? (
          <Button
            className="self-end"
            color={
              testingState === 'TESTED' ? 'green' : testingState === 'FAILED' ? 'red' : 'yellow'
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
    </div>
  )
}
