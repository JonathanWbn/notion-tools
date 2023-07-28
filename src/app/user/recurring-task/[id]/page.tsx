import { RecurringTaskView } from '../../../../infrastructure/components/recurring-task'
import { getUser } from '../../actions'
import { redirect } from 'next/navigation'

const RecurringTaskPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  const user = await getUser()

  if (!user) redirect('/')

  const recurringTask = user.recurringTasks.find((config) => config.id === id)

  if (!recurringTask) redirect('/')

  return (
    <div className="px-10 flex flex-col items-center">
      <RecurringTaskView recurringTask={recurringTask} />
    </div>
  )
}

export default RecurringTaskPage
