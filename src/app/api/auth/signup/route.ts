import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, ctx: { params: {} }) => {
  try {
    console.log('req is req', req instanceof Request)
    console.log('req has headers', req.headers)
    await handleLogin(req, ctx, {
      returnTo: '/user',
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  } catch (err) {
    console.log('err', err)
    return new Response(undefined, { status: 500 })
  }
}
