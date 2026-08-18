# First-week checklist

Use this when you are the new admin and the system is empty, or when you add a new lab. Tick in order. Do not skip.

## Before anyone else logs in

- [ ] You can log in as **Admin** with the current admin username and password.
- [ ] You know which **labs** exist in real life and which should have Blast / DNA (Full access On).
- [ ] You have a list of **designations** (job titles) people should pick.
- [ ] You have **project codes and names** that will be used for stock.

## Day 1 — Master data

1. Open **Master Table**.
2. Select **Lab**. Add every lab name. Names cannot duplicate (case-insensitive).
3. For each lab that should use Blast + DNA Repository, turn **Full access** On.
4. Select **Designation**. Add every job title.
5. Open **Project Management**. Add each project (**code** + **name**). Codes cannot be changed later.

Details: [Master Table](../01-modules/master-table.md), [Project Management](../01-modules/project-management.md), [Set up a new lab](../02-workflows/set-up-a-new-lab.md).

## Day 1 — People

For each Manager, Lab Assistant, and Researcher:

1. **Employee Registration** → Add user (username, password, role, designation, labs).
2. **Employee Project Management** → Assign employee (employee ID, lab, role, username, projects).
3. Write down username and password to give them. Passwords are stored as plain text; you can also reset later.

Details: [Onboard a new user](../02-workflows/onboard-new-user.md).

## Day 1 — Prove it works

- [ ] Log out. Log in as a **Lab Assistant**. You should see inventory menus (and Blast home if their lab has Full access).
- [ ] Log in as a **Researcher**. Request form should list **their** projects after a manager is selected, and items that exist in received stock for those projects. Empty lists usually mean missing employee assignment or no stock yet — that is expected on a brand-new system.
- [ ] Log in as a **Manager**. Request / return notification menus should appear.
- [ ] Reset a test password on **Password Reset**, log out, log in with the new password.

## Weekly habits

- Create the login **before** assigning projects. The username dropdown in Assign employee only lists users who already have that lab + role.
- Inactivate projects you no longer use instead of leaving them in every dropdown.
- Use Password Reset when someone forgets a password. Do not try to set it on Edit user.
- Do not delete a lab that still has users if you can avoid it.

## If something fails

| Symptom | Checklist |
|---------|-----------|
| Cannot create user | Labs and designations exist; username unique; Lab Assistant has one lab |
| Username missing in Assign employee | Login exists; you picked the **same lab and role** as on the login |
| Researcher has no projects | Employee assignment exists and is not inactive; projects are active |
| Password works in your head but not at login | Use the exact stored password; see [login-and-passwords.md](../04-troubleshooting/login-and-passwords.md) |
| No Blast / DNA | Full access On for at least one of their labs |

## Related

- [What admin can do](what-admin-can-do.md)
- [FAQ](../04-troubleshooting/faq.md)
