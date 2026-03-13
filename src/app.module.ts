import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneratorModule } from './resources/generator/generator.module';
import { DeliverymanModule } from './resources/deliveryman/deliveryman.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './infra/error/prisma-client.exception-filter';
import { VehicleModule } from './resources/vehicle/vehicle.module';
import { WasteCollectorsModule } from './resources/waste-collectors/waste-collectors.module';
import { MaterialsModule } from './resources/materials/materials.module';
import { SessionModule } from './resources/session/session.module';

@Module({
  imports: [GeneratorModule, DeliverymanModule, VehicleModule, WasteCollectorsModule, MaterialsModule, SessionModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule { }
