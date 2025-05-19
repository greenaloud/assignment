import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends BaseRepository<User, UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
