# Deactivate a user

## Two different “off” switches

| What you want | What exists in Admin today |
|---------------|----------------------------|
| Stop them appearing as an active **employee** on projects | Employee Project Management → mark **inactive** |
| Stop them **logging in** | Login `is_active`. Registration UI does **not** expose a block button. If someone is “blocked” at login, the login record is inactive in the database. |

Inactivating an employee **does not** by itself show “You are blocked” on login.

## Mark employee inactive

1. Employee Project Management.
2. Find the row.
3. Slash icon → confirm.
4. Toast: “Employee marked as inactive”.
5. Status: Inactive.

Use this when they leave a project or the organisation, so assignment lists and request logic treat them as inactive (`is_active !== false` on employee lookups).

## If they must not log in

Use Password Reset only if you want them to keep the account with a new secret. There is no Admin “block user” control on Employee Registration in the current UI. Escalating a true login block may need a technical/database change. Do not delete labs or users casually.

## Related

- [Employee Project Management](../01-modules/employee-project-management.md)
- [Login and passwords](../04-troubleshooting/login-and-passwords.md)
