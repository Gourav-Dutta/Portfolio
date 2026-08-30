import { db } from "../src/prisma/db.ts";
import {z} from 'zod'


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


async function getData(req, res){
  try{
    const users = await db.orm.public.User
    .select("id", "name")
    .all();
    return res.status(200).json({
      msg: 'Data get',
      data: users
    })
  }catch (error) {
    console.error("Error creating user:", error);

    return res.status(500).json({
      msg: "Failed to get user",
    });
  }
}



const userSchema = z.object({
  name: z.string().min(1, "Providing your name is a must"),
  
})


export {
  testDatabase as test,
  getData as getUsers
};



