import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto): Promise<UserDocument> {
    return await this.usersRepository.findOne(getUserDto);
  }
}
