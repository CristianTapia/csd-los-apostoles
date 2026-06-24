export const USER_ROLES = ["superadmin", "tenant_owner", "tenant_admin", "member"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const CLUB_ADMIN_ROLES: UserRole[] = ["tenant_owner", "tenant_admin"];
