import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  // @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.authService.GetAllUser();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authService.GetById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.UpdateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authService.DeleteUser(id);
  }

  @Post('verify')
  async verify(@Body() body: CreateUserDto) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );

    return {
      message: 'Credentials are valid',
      userId: user.id,
      
    };
  }
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }
}
