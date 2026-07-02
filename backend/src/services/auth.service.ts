import { UserRepository } from "../repositories/user.repository";
import { UserRole } from "../constants/index";
import { hashPassword, comparePassword, generateToken } from "../utils/security";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { IUser } from "../models/user.model";
import { UserPayload } from "../types/index";

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  public async register(name: string, email: string, password: string, role: UserRole = UserRole.USER): Promise<IUser> {
    // Check if email already exists
    const exists = await this.userRepository.exists(email);
    if (exists) {
      throw new ConflictError("Email already registered");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    return this.userRepository.create({
      name,
      email,
      passwordHash,
      role,
    });
  }

  public async login(email: string, password: string): Promise<{ token: string; user: UserPayload }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: UserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(payload);

    return { token, user: payload };
  }

  public async getUserById(id: string): Promise<UserPayload | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
