import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAdapter } from './../src/infra/cryptography/user/jwt.adapter';
import { UserRepositoryImpl } from './../src/infra/db/prisma/repositories/user.prisma-repository';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAdapter)
      .useValue({
        verify: (token: string) => {
          if (token !== 'valid-token') throw new Error('invalid token');
          return { id: 'generator-profile' };
        },
      })
      .overrideProvider(UserRepositoryImpl)
      .useValue({
        resolveAuthenticatedIdentity: async (profileId: string) =>
          profileId === 'generator-profile'
            ? { userId: 'user-1', role: 'GENERATOR', generatorId: profileId }
            : null,
      });
    const moduleFixture: TestingModule = await moduleBuilder.compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello OI!');
  });

  it('/session/me (GET) resolves a generator from the persisted profile', () => {
    return request(app.getHttpServer())
      .get('/session/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect({
        userId: 'user-1',
        role: 'GENERATOR',
        generatorId: 'generator-profile',
      });
  });

  it('/session/me (GET) rejects an expired or invalid token', () => {
    return request(app.getHttpServer())
      .get('/session/me')
      .set('Authorization', 'Bearer expired-token')
      .expect(401);
  });
});
