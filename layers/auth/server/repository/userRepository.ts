import prisma from '../../../base/server/utils/prisma'
import type { GitHubUser } from '../../shared/types/types'
import { seedDemoDataForUser } from './seedRepository'

export async function findUserByProviderId(providerId: string) {
  console.log('[findUserByProviderId]', providerId)
  return await prisma.user.findUnique({
    where: { providerId },
  })
}

export async function createUserFromGitHub(githubUser: GitHubUser) {
  return await prisma.user.create({
    data: {
      email: githubUser.email,
      name: githubUser.name || githubUser.login,
      provider: 'github',
      providerId: String(githubUser.id),
    },
  })
}

export async function findOrCreateUser(githubUser: GitHubUser) {
  const providerId = String(githubUser.id)

  // Try to find existing user
  let user = await findUserByProviderId(providerId)

  if (!user) {
    // Create new user if not found
    user = await createUserFromGitHub(githubUser)
    try {
      await seedDemoDataForUser(user.id)
    } catch (error) {
      console.error(
        'Could not seed demo data for user:',
        error
      )
    }
  }

  return user
}