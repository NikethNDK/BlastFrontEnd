# Roles matrix

## After login: which app?

| Role | Full access (any assigned lab On, or Admin) | Restricted (all labs Off) |
|------|---------------------------------------------|---------------------------|
| Admin | Admin workspace (five sidebar items) | Same (Admin always full) |
| Manager | ManagerApp + Blast/DNA join routes | ManagerAccessApp |
| Lab Assistant | LabApp + Blast/DNA | Care / inventory-only lab app |
| Researcher | ResearcherApp + Blast/DNA | ResearcherAccessApp |

Unknown role → error toast, stay logged out of a workspace.

## Admin sidebar

| Item | Admin |
|------|--------|
| Master Table | Yes |
| Employee Registration | Yes |
| Project Management | Yes |
| Employee Project Management | Yes |
| Password Reset | Yes |
| Inventory receive/issue | No |
| Researcher Request | No |

## Manager (typical menus)

| Item | Restricted | Full access extra |
|------|------------|-------------------|
| Dashboard | Yes | Yes |
| Request Notification | Yes | Yes |
| Return Notification | Yes | Yes |
| Change Password | Yes | Yes |
| DNA / BLAST home | No | Yes |

## Lab Assistant (typical menus)

| Item | Typical |
|------|---------|
| Inventory View | Yes |
| Add Received / Issued / Returned | Yes |
| Data tables | Yes |
| Add New Data (catalog) | Yes |
| Change Password | Yes |
| DNA / BLAST | If full access |

## Researcher (typical menus)

| Item | Typical |
|------|---------|
| Inventory View | Yes |
| Request | Yes — needs employee projects + stock |
| Confirm Items | Yes |
| Change Password | Yes |
| DNA / BLAST | If full access |

## Creation and lab count

| Role | Create from Registration | Labs on login |
|------|--------------------------|---------------|
| Admin | No | n/a |
| Manager | Yes | One or more |
| Lab Assistant | Yes | Exactly one |
| Researcher | Yes | One or more |

## Related

- [Roles and access](../00-overview/roles-and-access.md)
- [What admin can do](../00-overview/what-admin-can-do.md)
