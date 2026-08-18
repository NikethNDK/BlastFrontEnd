# Password Reset

**Sidebar:** Password Reset  
**URL:** `/password_reset`

## What this screen is for

Admin sets a **new password** for an existing login. Use this when someone forgets their password, or when you must force a new one.

Passwords are stored as **plain text**. The value you type is the value they must type at login. Nothing is hashed.

## Who should use it

Admin only. Other roles use **Change Password** in their own sidebar (self-service, username locked to the logged-in account).

## What you see

- Search by username, name, role, designation, lab.
- Table: username, name, role, designation, **key** icon to reset.
- Modal: shows the user, **New password** field (show/hide), Cancel / Reset password.

## How to reset

1. Find the user (search if needed).
2. Click the key icon.
3. Enter the new password. Empty value → “Please enter a new password.”
4. **Reset password**.
5. Toast: “Password reset successfully!”
6. Tell the user the new password. The old password stops working immediately.

If the request fails: “An error occurred. Please try again later.”

## What this does *not* do

- Does not create users (Employee Registration).
- Does not change role, labs, or projects.
- Does not log the user out of an already open browser session by itself; they need the new password next time they sign in.
- Does not email the password. You must tell them.

## Self-service vs admin reset

| Who | Screen | Username |
|-----|--------|----------|
| Admin resetting anyone | Password Reset | You pick the user |
| Manager / Lab Assistant / Researcher | Change Password | Filled from session, read-only |

Both save plain text. After either, login uses the new password.

## Common mistakes

| Mistake | Result |
|---------|--------|
| User still types the old password | Login fails |
| Typo when telling them the new password | Login fails |
| Expecting Edit user to change password | No password field there |

## Related

- [Reset login workflow](../02-workflows/reset-login.md)
- [Login and passwords](../04-troubleshooting/login-and-passwords.md)
- [Employee Registration](employee-registration.md)
