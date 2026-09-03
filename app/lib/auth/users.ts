import { UserRole } from "../rbac/roles";



export interface UserAccount {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export const USER_DB:
    UserAccount[] = [
        {
            id: "mba_admin",
            name: "System Administrator",
            email: "admin@rbac.com",
            password: "admin123",
            role: UserRole.ADMIN,
        },
        {
            id: "mba_user",
            name: "System User",
            email: "user@rbac.com",
            password: "user123",
            role: UserRole.USER,
        },
    ];

export function authenticate(email: string, password: string): UserAccount | null {
    const foundUser = USER_DB.find(
        (u) =>
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    return foundUser || null;
}