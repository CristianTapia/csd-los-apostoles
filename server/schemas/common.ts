import { z } from "zod";
import { CLUB_STATUSES, MATCH_STATUSES, MEMBER_STATUSES, PAYMENT_STATUSES } from "@/lib/domain/status";
import { USER_ROLES } from "@/lib/domain/roles";

export const uuidSchema = z.string().uuid();
export const nonEmptyTextSchema = z.string().trim().min(1);

export const userRoleSchema = z.enum(USER_ROLES);
export const clubStatusSchema = z.enum(CLUB_STATUSES);
export const memberStatusSchema = z.enum(MEMBER_STATUSES);
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export const matchStatusSchema = z.enum(MATCH_STATUSES);
