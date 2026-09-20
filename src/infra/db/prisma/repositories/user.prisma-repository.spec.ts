import { UserRepositoryImpl } from './user.prisma-repository';

describe('UserRepositoryImpl.getRoleByEmail', () => {
  const prisma = {
    tbl_user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns DELIVERYMAN when the user has a deliveryman profile', async () => {
    prisma.tbl_user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'driver@example.com',
      tbl_generator: [],
      tbl_waste_collector: [],
      tbl_deliveryman: [{ id: 'deliveryman-id' }],
    });
    const repository = new UserRepositoryImpl(prisma as any);

    const role = await repository.getRoleByEmail('driver@example.com');

    expect(prisma.tbl_user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'driver@example.com',
      },
      include: {
        tbl_generator: true,
        tbl_waste_collector: true,
        tbl_deliveryman: true,
      },
    });
    expect(role).toBe('DELIVERYMAN');
  });
});
