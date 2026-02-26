import { db } from "../config/firebase";
import bcrypt from "bcryptjs";

const seedSuperAdmin = async () => {
  try {
    const usersCollection = db.collection("users");

    const snapshot = await usersCollection
      .where("role", "==", "SUPER_ADMIN")
      .limit(1)
      .get();

    if (!snapshot.empty) {
      console.log("⚠ SUPER_ADMIN already exists. Skipping...");
      return;
    }

    const docRef = usersCollection.doc();
    const hashedPin = await bcrypt.hash("123456", 10);

    await docRef.set({
      id: docRef.id,
      name: "Super Admin",
      email: "superadmin@example.com",
      pin: hashedPin,
      role: "SUPER_ADMIN",
      tenantId: null,
      shopId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("SUPER_ADMIN created successfully");
  } catch (error) {
    console.error("Seeder Error:", error);
  }
};

(async () => {
  await seedSuperAdmin();
  process.exit();
})();
