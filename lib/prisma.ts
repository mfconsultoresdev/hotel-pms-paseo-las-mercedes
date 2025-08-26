
// Mock Prisma client for build time
class MockPrismaClient {
  constructor() {
    // Mock constructor that does nothing
  }
  
  // Add mock methods that might be called during build
  $connect() { return Promise.resolve() }
  $disconnect() { return Promise.resolve() }
  $queryRaw() { return Promise.resolve([]) }
  $executeRaw() { return Promise.resolve(0) }
  $transaction() { return Promise.resolve([]) }
  
  // Mock all model methods
  user = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  room = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  reservation = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  guest = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  invoice = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  payment = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  staff = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  schedule = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  service = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  notification = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  communication = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  attendance = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  template = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  tax = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  inventory = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  housekeeping = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  floor = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  roomType = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  paymentMethod = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let prisma: any

// Check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'

if (isBuildTime) {
  // During build time, use mock client
  prisma = new MockPrismaClient()
} else {
  // During runtime, use real client
  if (globalForPrisma.prisma) {
    prisma = globalForPrisma.prisma
  } else {
    try {
      const { PrismaClient } = require('@prisma/client')
      prisma = new PrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma
      }
    } catch (error) {
      // Fallback to mock if Prisma is not available
      prisma = new MockPrismaClient()
    }
  }
}

export { prisma }
