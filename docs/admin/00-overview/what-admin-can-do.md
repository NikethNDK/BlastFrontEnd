# What admin can do

## Purpose of the Admin role

Admin configures the **people, labs, designations, and projects** that the rest of the lab uses. Admin does not receive stock, issue items, or approve researcher requests. Those jobs belong to Lab Assistant, Manager, and Researcher.

After login, Admin sees a sidebar with five items. That is the whole admin workspace.

## What you can do

| Capability | Where |
|------------|--------|
| Create, rename, and delete **labs** | Master Table |
| Turn **Full access** (Blast + DNA Repository) on or off per lab | Master Table |
| Create and delete **designations** (job titles) | Master Table |
| Create **login accounts** for Manager, Lab Assistant, Researcher | Employee Registration |
| Edit username, display name, role, labs, designation | Employee Registration |
| Create **projects** (code + name) | Project Management |
| Rename a project (code cannot change) | Project Management |
| Inactivate a project | Project Management |
| Export the project list to Excel | Project Management |
| Assign a registered user to **projects** (employee record) | Employee Project Management |
| Mark an employee assignment inactive | Employee Project Management |
| Set a new password for any user | Password Reset |

## What you cannot do from Admin

- Create another **Admin** account from Employee Registration. The role dropdown only has Manager, Lab Assistant, and Researcher. Admin accounts are special and already exist in the system.
- Change a user’s password from Employee Registration (edit user has no password field). Use **Password Reset**.
- Receive, issue, or return inventory.
- Approve researcher requests (that is Manager).
- Confirm issued items (that is Researcher).
- Add master catalog items (that is Lab Assistant — Add New Data).

## How login decides what someone sees

1. User enters **username** and **password** on the login page.
2. The account must exist and must not be blocked (`is_active`).
3. **Role** picks the workspace: Admin, Manager, Lab Assistant, or Researcher.
4. **Full access** is true if the user is Admin, **or** if **any** of their assigned labs has Full access turned on.
5. Full access users also get Blast / DNA Repository entry points. Restricted users get inventory-only (or manager request) apps.

See [roles-and-access.md](roles-and-access.md).

## Order of setup (always this order)

1. Labs and designations (Master Table)
2. Projects (Project Management)
3. Login accounts (Employee Registration)
4. Project assignment (Employee Project Management)
5. Tell the person their username and password

Skipping a step is the usual reason a new user “doesn’t work.” See [first-week-checklist.md](first-week-checklist.md).

## Related

- [Roles and access](roles-and-access.md)
- [Data relationships](../03-reference/data-relationships.md)
- [Admin screens](../README.md#admin-screens-modules)
