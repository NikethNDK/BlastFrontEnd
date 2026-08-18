# Roles and access

## The four roles

| Role | Who it is for | Created by admin? |
|------|----------------|-------------------|
| **Admin** | System setup: labs, users, projects, passwords | Not from Employee Registration. Existing special account. |
| **Manager** | Approves researcher requests and returns | Yes |
| **Lab Assistant** | Inventory: receive, issue, return, catalog | Yes |
| **Researcher** | View inventory, request items, confirm issues | Yes |

## Full access vs restricted

**Full access is a property of a lab**, not of a person (except Admin, who always has it).

- Master Table → Lab → **Full access** switch.
- If **any** lab assigned to the user has Full access **On**, the user is treated as full access.
- Toast when you toggle: “Full access enabled (Blast + Repository)” or “Full access disabled (Inventory only)”.

| User | What they get |
|------|----------------|
| Admin | Always full admin workspace. No Blast menu in Admin; admin is setup only. |
| Manager + full access | Manager app **plus** Blast / DNA Repository home (`Join`). |
| Manager + restricted | Manager access app (dashboard, notifications, password). No Blast/DNA. |
| Lab Assistant + full access | Full lab inventory **plus** Blast / DNA. |
| Lab Assistant + restricted | Lab inventory / care app without the extra repository home. |
| Researcher + full access | Inventory, request, confirm **plus** Blast / DNA. |
| Researcher + restricted | Inventory, request, confirm only. |

If someone “should see Blast” but does not: check their **labs** in Employee Registration, then Full access on those labs in Master Table.

## What each non-admin role does in the lab

### Manager

- Dashboard
- **Request Notification** — pending researcher issues to approve
- **Return Notification** — pending returns
- Change Password
- With full access: DNA repository and BLAST comparison from the join/home routes

Managers used on a researcher request form must share at least one **assigned project** with that researcher. See [missing-items-or-projects.md](../04-troubleshooting/missing-items-or-projects.md).

### Lab Assistant

- Inventory view
- Add received / issued / returned items
- Received, issued, return data tables
- Add new catalog data
- Change Password
- Must be assigned to **exactly one lab** on the login record
- With full access: DNA / BLAST as well

Lab assistants on a researcher request are filtered by **lab and selected project**.

### Researcher

- Inventory view
- **Request** form (needs assigned projects + stock in those projects)
- **Confirm Items**
- Change Password
- With full access: DNA / BLAST

## Lab assignment rules

| Role | Labs on login |
|------|----------------|
| Manager | One or more |
| Researcher | One or more |
| Lab Assistant | **Exactly one** |
| Admin | Not created from this form |

## Related

- [Roles matrix](../03-reference/roles-matrix.md)
- [Master Table — Full access](../01-modules/master-table.md#full-access)
- [Employee Registration](../01-modules/employee-registration.md)
