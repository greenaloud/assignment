import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/models/user.schema';
import { Role } from '../../roles/models/role.schema';
import { SystemRole } from '@app/common/permissions/roles';
import { PermissionType } from '@app/common/permissions/permissions';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async seed() {
    await this.seedRoles();
    await this.seedUsers();
    this.logger.log('Seeding completed');
  }

  async seedRoles() {
    const count = await this.roleModel.countDocuments();

    if (count === 0) {
      this.logger.log('Seeding roles...');

      const roles = [
        {
          name: SystemRole.USER,
          description: '일반 사용자',
          permissions: [],
        },
        {
          name: SystemRole.OPERATOR,
          description: '운영자',
          permissions: [
            PermissionType.EVENT_READ,
            PermissionType.EVENT_WRITE,
            PermissionType.EVENT_DELETE,
            PermissionType.REWARD_CLAIM_READ,
          ],
        },
        {
          name: SystemRole.AUDITOR,
          description: '감사자',
          permissions: [PermissionType.REWARD_CLAIM_READ],
        },
        {
          name: SystemRole.ADMIN,
          description: '관리자',
          permissions: Object.values(PermissionType),
        },
      ];

      await this.roleModel.insertMany(roles);
      this.logger.log('Roles seeded successfully');
    }
  }

  async seedUsers() {
    const count = await this.userModel.countDocuments();

    if (count === 0) {
      this.logger.log('Seeding users...');

      const roles = await this.roleModel.find();

      if (roles.length === 0) {
        throw new Error('Roles not found. Run role seed first.');
      }

      // 비밀번호 해싱
      const salt = await bcrypt.genSalt();
      const adminPassword = await bcrypt.hash('admin123', salt);
      const operatorPassword = await bcrypt.hash('operator123', salt);
      const auditorPassword = await bcrypt.hash('auditor123', salt);
      const userPassword = await bcrypt.hash('user123', salt);

      const users = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: adminPassword,
          role: roles.find((r) => r.name === SystemRole.ADMIN)._id,
        },
        {
          username: 'operator',
          email: 'operator@example.com',
          password: operatorPassword,
          role: roles.find((r) => r.name === SystemRole.OPERATOR)._id,
        },
        {
          username: 'auditor',
          email: 'auditor@example.com',
          password: auditorPassword,
          role: roles.find((r) => r.name === SystemRole.AUDITOR)._id,
        },
        {
          username: 'user',
          email: 'user@example.com',
          password: userPassword,
          role: roles.find((r) => r.name === SystemRole.USER)._id,
        },
      ];

      await this.userModel.insertMany(users);
      this.logger.log('Users seeded successfully');
    }
  }
}
