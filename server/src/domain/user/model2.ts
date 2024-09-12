import { PrismaClient, user as PrismaUser, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserModel {
  [key: string]: any;

  private constructor(private _user: PrismaUser) {
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          // If the property exists on the User instance, return it
          return target[prop as keyof UserModel];
        }
        // Otherwise, return the property from the _user object
        return target._user[prop as keyof PrismaUser];
      },
    });
  }

  static async init(params: Prisma.userCreateInput): Promise<UserModel> {
    const userData = {
      ...params,
      bio: { 关于我: "", 我的理想型: "" },
    };

    userData.loginToken = jwt.sign(
      userData.phoneNumber ?? userData.wechatOpenId,
      process.env.API_USER_TOKEN_SECRET
    );

    const user = await prisma.user.create({ data: userData });
    return new UserModel(user);
  }

  static async findById(id: string): Promise<UserModel | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? new UserModel(user) : null;
  }

  static async findByAccessToken(
    loginToken: string
  ): Promise<UserModel | null> {
    const user = await prisma.user.findUnique({ where: { loginToken } });
    return user ? new UserModel(user) : null;
  }

  get hasValidProfile(): boolean {
    return Boolean(this.age && this.gender && this.name && this.jobTitle);
  }

  verifyLoginToken(token: string): boolean {
    try {
      const payload = jwt.verify(token, process.env.API_USER_TOKEN_SECRET);
      return payload === this.phoneNumber;
    } catch {
      return false;
    }
  }

  async update(params: Prisma.userUpdateInput): Promise<UserModel> {
    const updatedUser = await prisma.user.update({
      where: { id: this.id },
      data: {
        ...params,
        bio: params.bio ? params.bio : this.bio,
      },
    });
    this._user = updatedUser;
    return this;
  }

  // Method to get the raw Prisma User object if needed
  getPrismaUser(): PrismaUser {
    return this._user;
  }
}

