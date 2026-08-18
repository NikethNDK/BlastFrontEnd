# Employee Registration

**Sidebar:** Employee Registration  
**URL:** `/register`

## What this screen is for

Create and edit **login accounts**: username, password (on create only), display name, **role**, **designation**, and **labs**.

This is **not** where you assign projects. After you register someone, go to **Employee Project Management**.

## Who should use it

Admin only.

## What you see

- Search, sort, pagination.
- Table of users: username, name, role, designation, labs, actions.
- **Add user** opens the create modal.
- **Edit** (pencil) opens the edit modal. Edit has **no password field**.

## Add a user

Required:

| Field | Notes |
|-------|--------|
| Username | Unique, case-insensitive. Duplicate shows “Username already exists”. |
| Password | Required on create. Stored as **plain text**. |
| Role | Manager, Lab Assistant, or Researcher only. **Not Admin.** |
| Designation | From Master Table. |
| Labs | At least one. Lab Assistant must have **exactly one**. |

Optional: **Name** (display name).

Toasts: “Registered Successfully” or “Failed to Register” / “Username already exists” / “Please fill all fields.” / “Lab Assistant must be assigned to exactly one lab.” / “Please select a valid designation.”

### Lab Assistant lab rule

The lab control becomes **single-select**. If they somehow have zero or more than one lab, save is blocked.

Managers and Researchers can have multiple labs.

## Edit a user

You can change username, name, role, designation, and labs. You **cannot** change password here.

If you change username, it must not collide with another user.

After a username change, the **employee assignment** still uses the old username until you fix it in Employee Project Management. Prefer not renaming usernames that already have project assignments.

## What this does *not* do

- Does not assign projects.
- Does not set employee ID.
- Does not reset password (use [Password Reset](password-reset.md)).
- Does not create Admin users.
- Does not deactivate login (`is_active`). There is no block/unblock control on this screen.

## After you save

Give the person username + password. Then:

1. [Assign projects](../02-workflows/assign-projects.md)
2. If they forgot the password later → [Password Reset](password-reset.md)

## Common mistakes

| Mistake | Result |
|---------|--------|
| Stop after registration | User logs in but request/issue has no projects |
| Username ≠ what you type later in Assign employee | Assign employee dropdown empty or wrong person |
| Lab Assistant with several labs | Save blocked |
| Trying to set password on Edit | Field is not there |

## Related

- [Onboard a new user](../02-workflows/onboard-new-user.md)
- [Employee Project Management](employee-project-management.md)
- [Password Reset](password-reset.md)
- [Screens and fields](../03-reference/screens-and-fields.md)
