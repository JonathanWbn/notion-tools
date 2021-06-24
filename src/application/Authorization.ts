export interface Authorization {
  assertIsAllowedToCreateUsers(): Promise<void>
}
