import User from "../modules/users/user.model.js";
import Role from "../modules/roles/role.model.js";

/**
 * Production-grade Idempotent System Initializer
 * Ensures essential system roles and the initial Super Admin account exist
 * on server boot without polluting runtime request controllers.
 */
export async function initSystemDatabase() {
  try {
    const existingAdmin = await User.findOne({ roleName: "SUPER_ADMIN" });
    if (existingAdmin) {
      return;
    }

    console.log("⚙️ [System Init] No Super Admin detected. Initializing default system roles & admin account...");

    let superAdminRole = await Role.findOne({ name: "SUPER_ADMIN" });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: "SUPER_ADMIN",
        description: "Super Administrator with full system access",
        status: "active",
        isSystemRole: true,
      });
    }

    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";

    await User.create({
      name: "System Super Admin",
      email: adminEmail.toLowerCase(),
      username: "superadmin",
      password: adminPassword,
      roleName: "SUPER_ADMIN",
      roleId: superAdminRole._id,
      department: "Administration",
      designation: "Hospital Administrator",
      employeeId: "ADM-1001",
      phone: "+91 98765 10000",
      status: "active",
      emailVerified: "Verified",
      loginAccess: "Allowed",
      isProfileComplete: true,
      isVerified: true,
      authProvider: "local",
    });

    console.log(`✅ [System Init] Default Super Admin initialized successfully (${adminEmail}).`);
  } catch (error) {
    console.error("⚠️ [System Init Error]: Failed to initialize system admin:", error.message);
  }
}
