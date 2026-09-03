import { Permission } from "./permission";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        ...Object.values(Permission)
    ],

    [UserRole.USER]: [
        Permission.CREATE_AGENT,
        Permission.READ_AGENT,
        Permission.UPDATE_AGENT,
        Permission.DELETE_AGENT,
        Permission.CREATE_TEAM,
        Permission.READ_TEAM,
        Permission.UPDATE_TEAM,
        Permission.DELETE_TEAM,
        Permission.READ_BATTLE,
    ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    return permissions.includes(permission);
}
