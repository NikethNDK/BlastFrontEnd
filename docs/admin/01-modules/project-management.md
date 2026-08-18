# Project Management

**Sidebar:** Project Management  
**URL:** `/admin/project_manage` (also the Admin home `/`)

## What this screen is for

Create, search, sort, rename, export, and **inactivate** projects. Stock, requests, and employee assignments all use these project codes.

Create projects **before** assigning employees to them. Only **active** projects (`deleted = 0`) appear in the Assign employee project list.

## Who should use it

Admin. (There is also a project screen under some other roles; this doc is the Admin list.)

## What you see

- Counts: total / active / inactive.
- Search by project code or name.
- Sort by code or name.
- Table of projects with status.
- **Add project** in the page header.
- Row actions: edit (name), inactivate.
- Export to Excel (`project_data.xlsx`).

## Add a project

Fields:

| Field | Required | Notes |
|-------|----------|--------|
| Project code | Yes | Unique. **Cannot be changed later.** Example placeholder `PRJ-001`. |
| Project name | Yes | Can be edited later. |

Toasts: “Project added successfully” or the server error / “Project code already exists.”

## Edit a project

Opens **Edit project**. Code is read-only. You only change **project name**.

## Inactivate a project

Confirm in the modal. Status becomes inactive (`deleted = 1`). Toast: “Project inactivated”.

Inactive projects:

- Disappear from new employee project assignment (active filter).
- Should not be used for new researcher requests.

The UI does not offer a simple “reactivate” button on this screen. Treat inactivate as stopping new use.

## Export

Exports the **filtered/sorted** list. Empty list → “No projects to export”. Success → “Export started”.

## What this does *not* do

- Does not assign people to projects (Employee Project Management).
- Does not create inventory stock. Lab Assistant receives items **against** a project.
- Does not change project code.

## Common mistakes

| Mistake | Result |
|---------|--------|
| Assign employees before creating the project | Project missing from the multi-select |
| Reusing a code | “Project code already exists” |
| Inactivating a project still needed for requests | Empty project dropdowns for that code |

## Related

- [Assign projects](../02-workflows/assign-projects.md)
- [Employee Project Management](employee-project-management.md)
- [Missing items or projects](../04-troubleshooting/missing-items-or-projects.md)
