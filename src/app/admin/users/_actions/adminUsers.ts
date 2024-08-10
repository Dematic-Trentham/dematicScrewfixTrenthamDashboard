"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAllUsers() {
  const users = await prisma.user.findMany();

  //strip out sensitive data
  users.forEach((user: { password: any }) => {
    delete user.password;
  });

  return users;
}

export async function getAUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  //strip out sensitive data
  delete user.password;

  return user;
}

export async function updateUser(id: number, data: any) {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });

  //strip out sensitive data
  delete user.password;

  return user;
}

export async function deleteUser(id: number) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  //strip out sensitive data
  delete user.password;

  return user;
}
