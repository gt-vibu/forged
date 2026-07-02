import { UserModel, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  public async exists(email: string): Promise<boolean> {
    const count = await this.count({ email });
    return count > 0;
  }
}
