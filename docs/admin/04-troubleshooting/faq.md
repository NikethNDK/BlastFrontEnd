# FAQ

Short answers. Follow the link when you need steps.

## Setup and screens

**What does Admin do?**  
Configure labs, designations, logins, projects, project assignments, and password resets. Not day-to-day stock. → [what-admin-can-do.md](../00-overview/what-admin-can-do.md)

**Where do I start?**  
[first-week-checklist.md](../00-overview/first-week-checklist.md) and [README](../README.md).

**Why are there two “employee” screens?**  
Registration = **login**. Employee Project Management = **projects**. You need both. → [data-relationships.md](../03-reference/data-relationships.md)

**Can I create another Admin?**  
Not from Employee Registration. Roles there are Manager, Lab Assistant, Researcher only.

**What is Full access?**  
A lab switch. On = Blast + DNA Repository for users of that lab. Off = inventory-only apps. Admin always has full access. → [master-table.md](../01-modules/master-table.md#full-access)

**Role vs designation?**  
Role = which app. Designation = job title list. → [glossary.md](../00-overview/glossary.md)

## People

**I registered someone and they still can’t request items.**  
Assign projects. → [onboard-new-user.md](../02-workflows/onboard-new-user.md)

**Assign employee shows no usernames.**  
Pick the same lab and role as on their login. Register first.

**Lab Assistant must have one lab.**  
Yes. Managers and Researchers may have several.

**Does inactivating an employee block login?**  
No. → [deactivate-user.md](../02-workflows/deactivate-user.md)

**Can I change password on Edit user?**  
No. Use Password Reset.

## Projects and stock

**Can I change a project code?**  
No. Rename the **name** only.

**What does inactivate project do?**  
Hides it from new assignment lists (`deleted = 1`).

**Researcher has projects but no items.**  
No received stock (or stock is 0) for those projects / master type. Lab Assistant must receive items. Search cannot invent rows. → [missing-items-or-projects.md](missing-items-or-projects.md)

**Why must they pick a manager before a project on Request?**  
The project list is the overlap of researcher and manager assignments.

## Passwords

**Are passwords hashed?**  
No. Plain text by design.

**Reset succeeded but login fails.**  
They are typing the old password, a typo, or the wrong username. → [login-and-passwords.md](login-and-passwords.md)

**Who can change their own password?**  
Manager, Lab Assistant, Researcher (Change Password). Admin resets others on Password Reset.

## Access

**They don’t see Blast / DNA.**  
Turn Full access On for at least one of their labs, or they are on the restricted app.

**They see the wrong workspace (Manager vs Lab).**  
Wrong **role** on the login. Edit user in Employee Registration.

## Related

- [Find your question](../README.md#find-your-question)
- [Common errors](common-errors.md)
