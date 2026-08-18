# Data relationships

If a form is empty, a relationship is usually missing. This is the map.

## Picture

```text
Lab  (Master Table)
  └── Full access On/Off
        │
        ▼
Login account  (Employee Registration)
  username + password + role + designation + labs[]
        │
        │  username must equal emp_name
        ▼
Employee assignment  (Employee Project Management)
  employee ID + emp_name + lab + role + project codes[]
        │
        ▼
Project  (Project Management)
  project_code + project_name + active/inactive
        │
        ▼
Inventory stock  (Lab Assistant receive)
  items with project_code + quantity
        │
        ▼
Researcher Request / Lab Issue
```

## Two records per working user

| Record | Created on | Key field | Holds |
|--------|------------|-----------|--------|
| Login | Employee Registration | `user_name` | Password, role, labs, designation, display name |
| Employee | Employee Project Management | `emp_id` + `emp_name` | Projects |

`emp_name` **must match** `user_name` (the Assign employee dropdown is built that way).

## What each process reads

| User action | Relies on |
|-------------|-----------|
| Log in | Login username + password + login active |
| See Blast/DNA | Login labs → at least one lab Full access On (or Admin) |
| Researcher request: project list | Employee assignment projects ∩ manager’s employee projects ∩ active projects |
| Researcher request: item list | Received inventory with stock, matching researcher’s assigned projects (and master type) |
| Lab Assistant on request form | Login users with Lab Assistant role in that lab and the selected project |
| Assign employee username list | Logins with selected lab **and** role |

## Full access calculation

- Admin role → always full access.
- Else: if any of the user’s labs has `full_access = true` → full access.

## Inactive flags

| Flag | Where | Effect |
|------|--------|--------|
| Project `deleted = 1` | Project Management inactivate | Hidden from new assignment lists |
| Employee inactive | Employee Project Management | Treated as not active for project-based lists |
| Login `is_active = false` | Not a Registration button | Login: “You are blocked” |

## Related

- [Glossary](../00-overview/glossary.md)
- [Missing items or projects](../04-troubleshooting/missing-items-or-projects.md)
- [Onboard a new user](../02-workflows/onboard-new-user.md)
