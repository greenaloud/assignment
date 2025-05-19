import {
  FilterQuery,
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

export abstract class BaseRepository<T, TDocument extends HydratedDocument<T>> {
  constructor(protected readonly model: Model<T>) {}

  async create(partial: Partial<T>): Promise<TDocument> {
    const createdDocument = new this.model(partial);
    const savedDocument = await createdDocument.save();

    return savedDocument as TDocument;
  }

  async createMany(partials: Partial<T>[]): Promise<TDocument[]> {
    const createdDocuments = await this.model.insertMany(partials);

    return createdDocuments as TDocument[];
  }

  async findById(
    id: string,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<TDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const document = await this.model.findById(id, projection, options).exec();

    return document as TDocument | null;
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOne(filter, projection, options)
      .exec();

    return document as TDocument | null;
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ): Promise<TDocument | null> {
    const updatedDocument = await this.model
      .findOneAndUpdate(filter, update, options)
      .exec();

    return updatedDocument as TDocument | null;
  }

  async find(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<TDocument[]> {
    const documents = await this.model.find(filter, projection, options).exec();
    return documents as TDocument[];
  }

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
