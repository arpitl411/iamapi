import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'db-schema/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePassword } from 'src/common/helpers/hash.helper';
import { serialize } from 'src/common/helpers/serialize.helper';
import { getPaginationOptions } from 'src/common/helpers/pagination.helper';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ServiceResponse<UserResponseDto>> {
    // Check for duplicate email before hitting DB constraint
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      active: true,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${savedUser.email}`);

    return {
      message: 'User created successfully',
      data: serialize(UserResponseDto, savedUser),
    };
  }

  async getAllUsers(
    pagination?: PaginationOptions,
  ): Promise<ServiceResponse<UserResponseDto[]>> {
    const { skip, take } = getPaginationOptions(
      pagination ?? { page: 1, limit: 10 },
    );

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take,
    });

    return {
      message: 'Users fetched successfully',
      data: serialize(UserResponseDto, users),
      meta: {
        page: pagination?.page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getById(id: number): Promise<ServiceResponse<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: serialize(UserResponseDto, user),
    };
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`User updated: id=${id}`);

    return {
      message: 'User updated successfully',
      data: serialize(UserResponseDto, updatedUser),
    };
  }

  async deleteUser(id: number): Promise<ServiceResponse<null>> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User deleted: id=${id}`);
    return { message: 'User deleted successfully', data: null };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<ServiceResponse<{ token: string; user: UserResponseDto }>> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);
    this.logger.log(`User logged in: ${loginDto.email}`);

    return {
      message: 'Login successful',
      data: {
        token,
        user: serialize(UserResponseDto, user),
      },
    };
  }

  // Private — only used internally by login(). Never call from controller.
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, active: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
