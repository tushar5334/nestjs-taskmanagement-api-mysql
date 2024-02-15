import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsUserAlreadyExistConstraint } from '../custome-validators/is-user-already-exist';
import { TypedEventEmitter } from '../event-emitter/typed-event-emitter.class';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: 3600 }
        };
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy, IsUserAlreadyExistConstraint, TypedEventEmitter],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
