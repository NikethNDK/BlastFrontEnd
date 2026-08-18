# Onboard a new user

End-to-end job: a new Manager, Lab Assistant, or Researcher can log in and do their work.

## Before you start

- [ ] Lab exists in Master Table (and Full access set correctly).
- [ ] Designation exists.
- [ ] At least one **active** project exists if they will request or issue against projects.

## Steps (do not swap 3 and 4)

### 1. Master data (if missing)

[Master Table](../01-modules/master-table.md) → lab + designation.  
[Project Management](../01-modules/project-management.md) → project code + name.

### 2. Create the login

[Employee Registration](../01-modules/employee-registration.md) → Add user.

- Username they will type at login.
- Password they will type at login (plain text).
- Role: Manager **or** Lab Assistant **or** Researcher.
- Designation and labs.

Lab Assistant: **one** lab only.

### 3. Assign projects

[Employee Project Management](../01-modules/employee-project-management.md) → Assign employee.

- New unique Employee ID.
- **Same lab and role** as the login, then pick **username** from the dropdown.
- Select one or more active projects.

### 4. Hand over credentials

Give them username + password. They log in on the same app URL you use.

### 5. Spot-check

| Role | You should see |
|------|----------------|
| Lab Assistant | Inventory menus; Blast/DNA if lab Full access is On |
| Researcher | Inventory, Request, Confirm Items; request form not stuck on “no projects assigned” |
| Manager | Dashboard and notifications |

If Request still says no projects: assignment missing, username mismatch, or employee inactive. See [missing-items-or-projects.md](../04-troubleshooting/missing-items-or-projects.md).

Empty **item** lists on Request can be normal until Lab Assistant has **received stock** for those projects.

## Related

- [First-week checklist](../00-overview/first-week-checklist.md)
- [Assign projects](assign-projects.md)
- [Set up a new lab](set-up-a-new-lab.md)
