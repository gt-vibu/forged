import { Document, Model, UpdateQuery, FilterQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  public async create(item: any): Promise<T> {
    const createdItem = new this.model(item);
    return createdItem.save();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  public async find(
    filter: FilterQuery<T> = {},
    options: {
      sort?: any;
      limit?: number;
      skip?: number;
      populate?: string | string[];
    } = {}
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((p) => {
          query = query.populate(p) as any;
        });
      } else {
        query = query.populate(options.populate) as any;
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query.exec();
  }

  public async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true, runValidators: true }).exec();
  }

  public async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  public async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
