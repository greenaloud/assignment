import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from './models/user.schema';
import { RolesRepository } from '../roles/roles.repository';
import { SystemRole } from '@app/common/permissions/roles';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userRole = await this.rolesRepository.findOne({
      name: SystemRole.USER,
    });

    return await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      role: userRole,
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
