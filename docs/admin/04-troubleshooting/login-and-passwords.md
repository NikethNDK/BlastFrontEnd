# Login and passwords

## How login works (admin-relevant)

1. User types username and password (spaces at the ends are trimmed).
2. Server checks the **login** record: same password **as stored** (plain text), account active.
3. If that fails → “The username or password you entered is incorrect.”
4. If the account exists but `is_active` is false → “You are blocked”.
5. Role then opens Admin / Manager / Lab Assistant / Researcher.
6. Unknown role → “Something went wrong. Please contact support.”

## Checklist when login fails

1. Username is the **login username**, not display name, not employee ID.
2. Password is the **current** one (after Password Reset or Change Password, the old one is dead).
3. Capitals and spelling match. Example: stored `Resaercher1234` is not `Researcher1234`.
4. Account is not blocked.
5. They are using the same app URL as the rest of the lab (wrong server = different database).

## After admin reset

Password Reset must succeed (“Password reset successfully!”). Then they log in with **that** new value.

Change Password (self-service) uses the session username automatically. They should not type a different username.

## “You are blocked”

Login record is inactive. Employee Project Management **inactive** is a different flag and does not produce this message by itself.

## Password storage

By design, passwords are **not hashed**. Admin Reset and Change Password both save the typed string. Do not expect a hashed value in the database.

## Related

- [Password Reset](../01-modules/password-reset.md)
- [Reset login workflow](../02-workflows/reset-login.md)
- [FAQ](faq.md)
