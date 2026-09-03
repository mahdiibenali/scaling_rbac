import { Permission } from "../rbac/permission";
import { UserRole, hasPermission } from "../rbac/roles";

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: string;
    permission?: Permission;
    children?: NavigationItem[];
    badge?: number;
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
    {
        id: 'agents-group',
        label: 'Agents',
        href: '/agents',
        icon: 'agent',
        permission: Permission.READ_AGENT,
        children: [
            {
                id: 'select-agent',
                label: 'Select Agent',
                href: '/agents/select',
                permission: Permission.READ_AGENT,
            },
            {
                id: 'create-agent',
                label: 'Create Agent',
                href: '/agents/create',
                permission: Permission.CREATE_AGENT,
            },
            {
                id: 'manage-agent',
                label: 'Manage Agents',
                href: '/agents/manage',
                permission: Permission.UPDATE_AGENT,
            },
            {
                id: 'delete-agent',
                label: 'Decommission Agent',
                href: '/agents/delete',
                permission: Permission.DELETE_AGENT,
            },
        ],
    },
    {
        id: 'teams-group',
        label: 'Teams',
        href: '/teams',
        icon: 'team',
        permission: Permission.READ_TEAM,
        children: [
            {
                id: 'view-teams',
                label: 'All Teams',
                href: '/teams',
                permission: Permission.READ_TEAM,
            },
            {
                id: 'create-team',
                label: 'Create Team',
                href: '/teams/create',
                permission: Permission.CREATE_TEAM,
            },
            {
                id: 'update-team',
                label: 'Update Team',
                href: '/teams/update',
                permission: Permission.UPDATE_TEAM,
            },
            {
                id: 'delete-team',
                label: 'Delete Team',
                href: '/teams/delete',
                permission: Permission.DELETE_TEAM,
            },
        ],
    },
    {
        id: 'battles-group',
        label: 'Battles',
        href: '/battles',
        icon: 'battle',
        permission: Permission.READ_BATTLE,
        children: [
            {
                id: 'battle-results',
                label: 'Battle Results',
                href: '/battles/results',
                permission: Permission.READ_BATTLE,
            },
            {
                id: 'create-battle',
                label: 'Start Battle',
                href: '/battles/create',
                permission: Permission.CREATE_BATTLE,
            },
            {
                id: 'update-battle',
                label: 'Update Battle',
                href: '/battles/update',
                permission: Permission.UPDATE_BATTLE,
            },
            {
                id: 'delete-battle',
                label: 'Delete Battle',
                href: '/battles/delete',
                permission: Permission.DELETE_BATTLE,
            },
        ],
    },
];

/**
 * Recursively filters navigation items based on the user's role and permissions
 */
export function getFilteredNavigation(items: NavigationItem[], role: UserRole): NavigationItem[] {
    return items
        .filter((item) => {
            if (!item.permission) return true;
            return hasPermission(role, item.permission);
        })
        .map((item) => {
            if (!item.children || item.children.length === 0) {
                return item;
            }
            const filteredChildren = getFilteredNavigation(item.children, role);
            return {
                ...item,
                children: filteredChildren,
            };
        })
        .filter((item) => {
            // If it had children originally but now all children were filtered out, only keep if it has a direct href
            if (item.children && item.children.length === 0 && !item.permission) {
                return false;
            }
            return true;
        });
}