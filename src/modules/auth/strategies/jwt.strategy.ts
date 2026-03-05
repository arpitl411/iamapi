import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from 'db-schema/user.entity';
import { JWT_STRATEGY } from 'src/common/constants/app.constants';
import {
  AuthenticatedUser,
  JwtPayload,
} from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    // Fail fast at startup if JWT_SECRET is not set
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Verify the user still exists and is active on every request
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, active: true },
      select: ['id', 'email', 'uuid'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
      uuid: user.uuid,
    };
  }
}
