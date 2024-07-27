import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "./db.server";
import type { User } from "~/types";

type LoginForm = {
  email: string;
  password: string;
};


export async function createUser(userData: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}): Promise<User> {
  const passwordHash = await bcrypt.hash(userData.password, 10); //TODO: This hash might not be secure enough

  const user = await db.user.findUnique({ where: { email: userData.email } });
  if (user) throw new Error("A user with this email already");

  const createUserCommand = {
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    dateOfBirth: userData.dateOfBirth,
  }


  return db.user.create({
    data: {
      ...createUserCommand,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dateOfBirth: true,
    },
  });
}


export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, email };
}

export async function register({ email, password }: LoginForm) {
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { email, passwordHash } });

  return { id: user.id, email };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserId(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
