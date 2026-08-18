# Employee Project Management

**Sidebar:** Employee Project Management  
**URL:** `/employee_manage`  
**Screen title:** Employee management

## What this screen is for

Link a **login username** to an **employee ID**, one lab, a role, and one or more **projects**. This is the assignment researchers, managers, and lab assistants need so request/issue forms know their projects.

This is **not** the login creator. Register the user first.

## Who should use it

Admin only.

## What you see

- **Assign employee** in the header.
- Search by employee ID, username, name, project, lab, designation.
- Table: Employee ID, Name, Username, Project code, Project name, Lab, Designation, Status, Actions.
- Active vs Inactive badge.
- Inactivate (user-slash) for active rows.

Name in the table comes from the login display name when available; **Username** is `emp_name` and must match the login username.

## Assign employee

Button: **Assign employee**.

Fill in this order (username stays disabled until lab + role are set):

| Field | Notes |
|-------|--------|
| Employee ID | Unique. Duplicate → “Employee ID already exist.” |
| Lab | Must exist in Master Table. |
| Role | Must match the user’s login role. Options come from distinct roles in the system. |
| Username | Dropdown of login users who already have **that lab and that role**. Empty until lab + role are chosen. Placeholder: “Select lab and role first” or “No users available”. |
| Projects | Multi-select of **active** projects. Ctrl/Cmd-click for several. |

Toast: “Employee added successfully”.

### Why the username list is empty

The API only returns users who:

1. Already have a **login**, and
2. Are in the **lab** you picked, and
3. Have the **role** you picked.

If you registered them to Lab A as Researcher, you will not see them when you pick Lab B or Manager.

## Inactivate an employee

Confirm modal → “Employee marked as inactive”. Status badge becomes Inactive. The slash button is hidden for already inactive rows.

This is **not** the same as blocking login. They may still sign in. To stop login, that would require deactivating the login record (not exposed as a button on Registration). See [deactivate-user.md](../02-workflows/deactivate-user.md).

## Edit

An update modal exists in the codebase but the main workflow for new admins is **Assign** + **Inactivate**. Prefer assigning correctly the first time. If projects must change, use the update flow if your build shows an edit action; otherwise inactivate and create a new assignment only if your process allows it (employee ID cannot be reused).

## What this does *not* do

- Does not create passwords or login accounts.
- Does not create projects or labs.
- Does not by itself block login.

## After you save

The username on this record is what request forms look up (`emp_name` = login `user_name`). Researchers without this record see “You have no projects assigned.”

## Common mistakes

| Mistake | Result |
|---------|--------|
| Register only, never assign | Login works; request form blocked |
| Wrong lab/role in the modal | Username dropdown empty |
| Username spelling differs from login | Forms cannot find the employee |
| Only inactive projects | Nothing to select |

## Related

- [Assign projects workflow](../02-workflows/assign-projects.md)
- [Onboard a new user](../02-workflows/onboard-new-user.md)
- [Data relationships](../03-reference/data-relationships.md)
- [Missing items or projects](../04-troubleshooting/missing-items-or-projects.md)
