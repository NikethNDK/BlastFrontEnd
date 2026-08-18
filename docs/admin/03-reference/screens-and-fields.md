# Screens and fields

Field-level reference for Admin screens. For “how to do the job”, use the module and workflow files.

## Master Table (`/master_table`)

| Control | Required | Rules |
|---------|----------|--------|
| Select Option | Yes to work | Lab or Designation |
| Lab / Designation Name | Yes to save | Trimmed; unique ignoring case |
| Full access (lab only) | — | Switch; On = Blast + Repository for users of that lab |
| Rename (lab only) | Yes if saving | Non-empty, unique |
| Delete | — | Trash icon |

## Employee Registration — Add user (`/register`)

| Field | Required | Rules |
|-------|----------|--------|
| Username | Yes | Unique ignoring case |
| Name | No | Display only |
| Password | Yes | Plain text; create only |
| Role | Yes | Manager, Lab Assistant, Researcher |
| Designation | Yes | From Master Table ids |
| Labs | Yes | ≥1; Lab Assistant exactly 1 |

## Employee Registration — Edit user

Same as add **except no password**. Username change must stay unique.

## Project Management — Add (`/admin/project_manage`)

| Field | Required | Rules |
|-------|----------|--------|
| Project code | Yes | Unique; immutable |
| Project name | Yes | Editable later |

## Project Management — Edit

| Field | Required | Rules |
|-------|----------|--------|
| Project code | — | Read-only |
| Project name | Yes | |

Inactivate: confirm modal; sets inactive flag.

## Assign employee (`/employee_manage`)

| Field | Required | Rules |
|-------|----------|--------|
| Employee ID | Yes | Unique |
| Lab | Yes | Unlocks username with role |
| Role | Yes | Must match login |
| Username | Yes | Logins with that lab+role |
| Projects | Yes | Multi-select; active projects only |

## Password Reset (`/password_reset`)

| Field | Required | Rules |
|-------|----------|--------|
| New password | Yes | Trim; plain text stored |

## Related

- Module files in [01-modules](../01-modules/master-table.md)
- [Glossary](../00-overview/glossary.md)
