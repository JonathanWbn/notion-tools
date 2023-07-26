import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, ctx: { params: {} }) =>
  handleLogin(req, ctx, {
    returnTo: '/user',
    authorizationParams: {
      screen_hint: 'signup',
    },
  })
