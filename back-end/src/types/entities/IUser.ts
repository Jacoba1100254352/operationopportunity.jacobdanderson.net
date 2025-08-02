// src/types/entities/IUser.ts
import type { Types } from "mongoose";
import type { IBaseUser } from "../abstractions/BaseUser.js";

export interface IUser extends IBaseUser {
	age: string;
	state: string;
	tutor?: Types.ObjectId;
	editUsers: boolean;
	role: string; // e.g. "user"
}
