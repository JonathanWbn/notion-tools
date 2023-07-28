import { Spinner } from '../../../../components/icons'

export default function LoadingPage() {
  return (
    <div className="flex align-center justify-center">
      <Spinner className="animate-spin" />
    </div>
  )
}
