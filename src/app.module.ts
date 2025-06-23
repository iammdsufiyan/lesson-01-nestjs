import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule ,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import{UsersModule } from './users/users.module'
import { MyLoggerModule } from './my-logger/my-logger.module';
import { MyLoggerService } from './my-logger/my-logger.service';
import { User} from './users/users.entity/users.entity';
@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'NewPassword123',
      database: 'lessondb',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([{
      name:'short',
      ttl:1000,
      limit:3, 
    },
    {
      name : 'long',
      ttl: 60000,
      limit:100,
    }
  ]),
    UsersModule,
    MyLoggerModule,
  ],
 
  exports: [MyLoggerService],   
  controllers: [AppController],
  providers: [AppService ,MyLoggerService , {
    provide:APP_GUARD,
    useClass:ThrottlerGuard,
  }],
})
export class AppModule {}
