import { UserRepository } from "../repositories/user.repository";
import { UserRole } from "../constants/index";
import { hashPassword } from "../utils/security";
import { Logger } from "../config/logger";

export const seedSuperAdmin = async (): Promise<void> => {
  try {
    const userRepository = new UserRepository();
    const adminEmail = "admin@company.com";

    // Check if any Super Admin exists or this email exists
    const adminExists = await userRepository.findByEmail(adminEmail);

    if (adminExists) {
      Logger.info("Super Admin seeding skipped: Super Admin already exists.");
      return;
    }

    const defaultPassword = "Admin@12345";
    const passwordHash = await hashPassword(defaultPassword);

    await userRepository.create({
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    });

    Logger.info("Super Admin seeded successfully.");
  } catch (error: any) {
    Logger.error(`Error seeding Super Admin: ${error.message}`);
  }
};
