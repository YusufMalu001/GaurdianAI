// Mocked Prisma Client for Hackathon Demo without DB connection
class MockPrismaClient {
  user = {
    findUnique: async () => null,
    create: async ({ data }: any) => ({
      id: 'mock-uuid-1234',
      ...data,
    }),
  };
  trustedContact = {
    findMany: async () => [],
    count: async () => 0,
    create: async ({ data }: any) => ({ id: 'mock-contact-123', ...data }),
    update: async ({ data }: any) => ({ id: 'mock-contact-123', ...data }),
    delete: async () => ({}),
  };
  incident = {
    findMany: async () => [],
    create: async ({ data }: any) => ({ id: 'mock-incident-123', ...data }),
  };
  sOSEvent = {
    create: async ({ data }: any) => ({ id: 'mock-sos-123', ...data }),
    update: async ({ data }: any) => ({ id: 'mock-sos-123', ...data }),
  };
  liveTrackingSession = {
    create: async ({ data }: any) => ({ id: 'mock-session-123', ...data }),
    updateMany: async () => ({}),
  };
  emergencyNotification = {
    create: async ({ data }: any) => ({ id: 'mock-notif-123', ...data }),
  };
  $disconnect = async () => {};
  $queryRaw = async () => [{ 1: 1 }];
}

export const prisma = new MockPrismaClient() as any;
export default prisma;
