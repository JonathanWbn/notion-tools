import { getSession, UserProfile as _UserProfile } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

interface UserProfile extends _UserProfile {
  sub: string
}

export const getUserFromSession = (req: NextApiRequest, res: NextApiResponse): UserProfile => {
  const { user } = getSession(req, res) || {}

  if (!user) {
    throw new Error('No user found in session.')
  }

  return user as UserProfile
}
