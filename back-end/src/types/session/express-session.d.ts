// src/types/session/express-session.d.ts
// noinspection JSUnusedGlobalSymbols // THese are used/included by tsconfig.json

import type { IAdmin } from "./IAdmin";
import type { ITutor } from "./ITutor";
import type { IUser } from "./IUser";

/**
 * Extend express-session's SessionData interface
 */
declare module "express-session" {
	interface SessionData {
		adminID?: string;
		tutorID?: string;
		userID?: string;
	}
}

/**
 * Extend Express's Request interface to include currentAdmin, etc.
 */
declare global {
	namespace Express {
		interface Request {
			currentAdmin?: IAdmin;
			currentTutor?: ITutor;
			currentUser?: IUser;
		}
	}
}
