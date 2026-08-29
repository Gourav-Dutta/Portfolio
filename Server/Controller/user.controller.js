import { db } from "../src/prisma/db.ts";

async function testDatabase(req, res) {
  try {
    const user = await db.orm.public.User.create({
      name: "Gourav Dutta",
      email: "gourav@example.com",
      phone: "9876543210",
      passwordHash: "test-password-hash",
    });

    console.log("Query run");
    console.log(user);

    return res.status(201).json({
      msg: "User inserted successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    return res.status(500).json({
      msg: "Failed to create user",
    });
  }
}

export {
  testDatabase as test
};