import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { FunctionComponent } from 'react'
import { useUser } from '../../infrastructure/client/api-client'
import { NotionConnect } from '../../infrastructure/client/components/notion-connect'
import { UserToolConfigs } from '../../infrastructure/client/components/user-tool-configs'

const User: FunctionComponent = () => {
  const { auth0user } = useUser()

  if (!auth0user) return <h1>loading...</h1>

  return (
    <>
      <h1>Profile: {auth0user.name}</h1>
      <NotionConnect />
      <UserToolConfigs />
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
