import { Spinner } from '../../infrastructure/components/icons'

export default function LoadingPage() {
  return (
    <div className="flex align-center justify-center">
      <Spinner className="animate-spin" />
    </div>
  )
}
