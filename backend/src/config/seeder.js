import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./DbConnect.js";
import { RESOURCES, ACTIONS } from "../core/constants/permissions.js";
import { ROLES } from "../core/constants/roles.js";
import Permission from "../modules/permissions/permission.model.js";
import Role from "../modules/roles/role.model.js";
import User from "../modules/users/user.model.js";
import Department from "../modules/departments/department.model.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to database...");
    await connectDB();

    // 2. Generate and seed Permissions
    console.log("Seeding permissions...");
    const permissionOps = [];

    for (const resource of Object.values(RESOURCES)) {
      for (const action of Object.values(ACTIONS)) {
        const name = `${resource}:${action}`;
        permissionOps.push({
          updateOne: {
            filter: { resource, action },
            update: {
              $set: { name, resource, action },
              $setOnInsert: { description: `Allows ${action} action on ${resource} resource` }
            },
            upsert: true,
          },
        });
      }
    }

    if (permissionOps.length > 0) {
      const result = await Permission.bulkWrite(permissionOps);
      console.log(`Permissions seeded/updated. Matched: ${result.matchedCount}, Upserted: ${result.upsertedCount}`);
    }

    // Fetch all permission IDs for mapping
    const allPermissions = await Permission.find({});
    const allPermissionIds = allPermissions.map((p) => p._id);

    // 3. Seed System Roles
    console.log("Seeding system roles...");
    
    // Seed SUPER_ADMIN role with ALL permissions
    const superAdminRole = await Role.findOneAndUpdate(
      { name: ROLES.SUPER_ADMIN },
      {
        name: ROLES.SUPER_ADMIN,
        description: "Super Administrator with full access to all system resources",
        permissionIds: allPermissionIds,
        isSystemRole: true,
        status: "active",
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log("SUPER_ADMIN role created/updated with full permissions.");

    // Seed other system roles if they do not exist
    for (const roleName of Object.values(ROLES)) {
      if (roleName === ROLES.SUPER_ADMIN) continue;

      // We only insert if they don't already exist to avoid changing custom permission setups
      const roleExists = await Role.findOne({ name: roleName });
      if (!roleExists) {
        await Role.create({
          name: roleName,
          description: `${roleName.charAt(0) + roleName.slice(1).toLowerCase().replace("_", " ")} role`,
          permissionIds: [], // To be populated by admin later
          isSystemRole: true,
          status: "active",
        });
        console.log(`System role ${roleName} seeded.`);
      }
    }

    // 4. Seed Super Admin User
    console.log("Seeding Super Admin user...");
    const superAdminEmail = process.env.SUPERADMIN_EMAIL || "admin@gmail.com";
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD || "admin123";

    let superAdminUser = await User.findOne({ email: superAdminEmail });

    if (!superAdminUser) {
      superAdminUser = await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: superAdminPassword,
        roleId: superAdminRole._id,
        isVerified: true,
        status: "active",
      });
      console.log(`Super Admin user created successfully! (${superAdminEmail})`);
    } else {
      superAdminUser.roleId = superAdminRole._id;
      superAdminUser.password = superAdminPassword;
      superAdminUser.isVerified = true;
      superAdminUser.status = "active";
      await superAdminUser.save();
      console.log(`Super Admin user updated successfully! (${superAdminEmail})`);
    }

    // 5. Seed Initial Departments
    console.log("Seeding initial departments...");
    const initialDepartments = [
      { name: "Cardiology", code: "CARD", description: "Heart & Cardiovascular Care" },
      { name: "Neurology", code: "NEUR", description: "Brain & Nervous System Care" },
      { name: "Orthopedics", code: "ORTH", description: "Bone & Joint Healthcare" },
      { name: "Pediatrics", code: "PEDI", description: "Child & Infant Healthcare" },
      { name: "General Medicine", code: "GENM", description: "General & Primary Care" },
      { name: "Emergency Medicine", code: "EMER", description: "24/7 Emergency Care" },
      { name: "Dermatology", code: "DERM", description: "Skin & Cosmetology" },
      { name: "Radiology", code: "RADI", description: "Diagnostic Imaging & Radiology" },
    ];

    for (const dept of initialDepartments) {
      await Department.findOneAndUpdate(
        { code: dept.code },
        { ...dept, status: "active" },
        { upsert: true }
      );
    }
    console.log("Initial departments seeded.");

    console.log("Database seeding completed successfully! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
