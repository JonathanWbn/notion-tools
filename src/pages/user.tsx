import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { FunctionComponent } from 'react'

const User: FunctionComponent = () => {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return <h1>Profile: {user.name}</h1>
}

export const getServerSideProps = withPageAuthRequired()

export default User
