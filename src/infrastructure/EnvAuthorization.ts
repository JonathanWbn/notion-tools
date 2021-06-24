import { Authorization } from '../application/Authorization'

export class EnvAuthorization implements Authorization {
  constructor(private auth0Secret: string) {}

  public async assertIsAllowedToCreateUsers(): Promise<void> {
    if (process.env.AUTH0_SECRET !== this.auth0Secret) {
      throw new Error('UNAUTHORIZED')
    }
  }
}
