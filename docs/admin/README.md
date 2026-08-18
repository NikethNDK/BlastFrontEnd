# Admin handbook

This folder is the admin guide for the AIWC LIMS inventory app. Start here if you are a new admin, or if you need to find an answer without asking someone else.

**Last verified against:** current frontend Admin sidebar and screens (August 2026).

---

## How to use these docs

| You want… | Open |
|-----------|------|
| A map of the whole admin area | This file |
| What words mean (role vs designation, login vs employee) | [Glossary](00-overview/glossary.md) |
| What each role can see | [Roles and access](00-overview/roles-and-access.md) |
| What to do in week one | [First-week checklist](00-overview/first-week-checklist.md) |
| How a **screen** works | [Modules](#admin-screens-modules) |
| How to complete a **job** that uses several screens | [Workflows](#workflows-i-want-to) |
| Why something failed | [Troubleshooting](#troubleshooting) |

Do not read everything. Use the tables below, then follow links.

---

## Find your question

| If you want to… | Open |
|-----------------|------|
| Create a lab or designation | [Master Table](01-modules/master-table.md) |
| Turn Blast / DNA Repository on or off for a lab | [Master Table — Full access](01-modules/master-table.md#full-access) |
| Create a login (Manager, Lab Assistant, Researcher) | [Employee Registration](01-modules/employee-registration.md) |
| Change a user’s name, role, labs, or designation | [Employee Registration](01-modules/employee-registration.md#edit-a-user) |
| Create or rename a project | [Project Management](01-modules/project-management.md) |
| Stop people using a project | [Project Management — Inactivate](01-modules/project-management.md#inactivate-a-project) |
| Assign a person to projects | [Employee Project Management](01-modules/employee-project-management.md) |
| Reset someone’s password | [Password Reset](01-modules/password-reset.md) |
| Onboard a new person end to end | [Onboard a new user](02-workflows/onboard-new-user.md) |
| Set up a brand-new lab | [Set up a new lab](02-workflows/set-up-a-new-lab.md) |
| User cannot log in | [Login and passwords](04-troubleshooting/login-and-passwords.md) |
| Researcher request form has no items / no projects | [Missing items or projects](04-troubleshooting/missing-items-or-projects.md) |
| Username already exists / Lab Assistant lab error | [Common errors](04-troubleshooting/common-errors.md) |
| Any leftover “why?” | [FAQ](04-troubleshooting/faq.md) |

---

## Admin screens (modules)

These match the **Admin** sidebar exactly.

| Sidebar label | Path in the app | Doc |
|---------------|-----------------|-----|
| Master Table | `/master_table` | [master-table.md](01-modules/master-table.md) |
| Employee Registration | `/register` | [employee-registration.md](01-modules/employee-registration.md) |
| Project Management | `/admin/project_manage` (home) | [project-management.md](01-modules/project-management.md) |
| Employee Project Management | `/employee_manage` | [employee-project-management.md](01-modules/employee-project-management.md) |
| Password Reset | `/password_reset` | [password-reset.md](01-modules/password-reset.md) |

Admin **does not** manage day-to-day inventory (receive, issue, requests). That is Lab Assistant, Manager, and Researcher work. Admin sets up the people, labs, and projects those roles need.

---

## Workflows (“I want to…”)

| Job | Doc |
|-----|-----|
| Onboard a Manager / Lab Assistant / Researcher | [onboard-new-user.md](02-workflows/onboard-new-user.md) |
| Assign or change projects | [assign-projects.md](02-workflows/assign-projects.md) |
| Create a lab and everything it needs | [set-up-a-new-lab.md](02-workflows/set-up-a-new-lab.md) |
| Stop someone using the system | [deactivate-user.md](02-workflows/deactivate-user.md) |
| Give someone a new password | [reset-login.md](02-workflows/reset-login.md) |

---

## Reference

| Topic | Doc |
|-------|-----|
| Every field on every admin screen | [screens-and-fields.md](03-reference/screens-and-fields.md) |
| Role × screen × full-access matrix | [roles-matrix.md](03-reference/roles-matrix.md) |
| How login, employee, lab, and project connect | [data-relationships.md](03-reference/data-relationships.md) |

---

## Troubleshooting

| Topic | Doc |
|-------|-----|
| Login, passwords, “You are blocked” | [login-and-passwords.md](04-troubleshooting/login-and-passwords.md) |
| Empty dropdowns, no stock, no common projects | [missing-items-or-projects.md](04-troubleshooting/missing-items-or-projects.md) |
| Toasts and validation messages | [common-errors.md](04-troubleshooting/common-errors.md) |
| Short Q → A | [faq.md](04-troubleshooting/faq.md) |

---

## The one idea that prevents most confusion

Admin work uses **two different records** for the same person:

1. **Login** (Employee Registration) — username, password, role, labs, designation. This is what they type on the login page.
2. **Employee assignment** (Employee Project Management) — employee ID plus **which projects** they belong to.

If you only do step 1, they can log in but often **cannot request or issue items**. If you only do step 2, they have projects but **cannot log in**. Both are required for Managers, Lab Assistants, and Researchers.

Details: [data-relationships.md](03-reference/data-relationships.md).

---

## Suggested reading order for a new admin

1. [What admin can do](00-overview/what-admin-can-do.md)
2. [Glossary](00-overview/glossary.md)
3. [First-week checklist](00-overview/first-week-checklist.md)
4. The five module files, in sidebar order
5. [Onboard a new user](02-workflows/onboard-new-user.md)
6. Keep [FAQ](04-troubleshooting/faq.md) bookmarked
