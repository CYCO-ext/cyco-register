import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { loadEnvFile } from 'node:process';

async function bootstrap() {
  try {
    loadEnvFile();
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('GlobalExceptionFilter');
  app.use((err: Error, req: any, res: any, next: any) => {
    logger.error(`Unhandled Exception: ${err.message}`, err.stack);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
