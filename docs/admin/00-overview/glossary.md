# Glossary

Use these words the way the app uses them. Mixing them up is the most common source of admin questions.

## People

| Term | Meaning |
|------|---------|
| **Username** | Login id (`user_name`). What they type on the login page. Must be unique (case-insensitive). |
| **Name** | Display name on the login record. Optional. Not used to log in. |
| **Role** | Access type: Admin, Manager, Lab Assistant, or Researcher. Controls which app they see after login. |
| **Designation** | Job title from Master Table (for example Scientist, Technician). Not the same as role. |
| **Login / login account** | Record created in **Employee Registration**. Holds username, password, role, labs, designation. |
| **Employee / employee assignment** | Record created in **Employee Project Management**. Holds employee ID, username, lab, role, and **projects**. |
| **Employee ID** | Unique id you invent when assigning projects (not the same as username). Cannot be reused. |
| **Requested by / Issued to** | Usually the researcher’s **username**, not their display name. |

## Places and access

| Term | Meaning |
|------|---------|
| **Lab** | A workspace (for example a named laboratory). Users are assigned to one or more labs. |
| **Full access** | A switch **on the lab**. If On, users of that lab get Blast + DNA Repository as well as inventory. If Off, inventory only. Admin always has full access. |
| **Restricted / access app** | User whose labs all have Full access Off. Manager, Lab Assistant, and Researcher each have a reduced app in that case. |

## Projects and stock

| Term | Meaning |
|------|---------|
| **Project code** | Unique short id (for example `PRJ-001`). Cannot be changed after create. |
| **Project name** | Human-readable project title. Can be edited. |
| **Active project** | `deleted = 0`. Appears in assignment and request dropdowns. |
| **Inactive project** | `deleted = 1`. Hidden from new assignments. Inactivate; do not expect a hard delete from the UI. |
| **Assigned projects** | Projects linked on the **employee** record. Researchers need this to request items. |
| **Master type** | Category of item (chemical, labware, etc.) used on receive/issue/request forms. |
| **Item code / item name** | Catalog identifiers. Request and issue forms search these. |
| **Stock** | Quantity available in received inventory for a project. Request form only lists items with usable stock. |

## Passwords and status

| Term | Meaning |
|------|---------|
| **Password** | Stored as **plain text** by design. Login compares the typed password to the stored value. Nothing is hashed. |
| **Password Reset** | Admin screen that sets a new password for a user. |
| **Change Password** | Screen for Manager / Lab Assistant / Researcher to change **their own** password. Username is filled from the session and is read-only. |
| **Login active** | Login record `is_active`. If false, login shows “You are blocked.” |
| **Employee inactive** | Employee assignment marked inactive. Different from login blocked. They may still log in unless the login is also deactivated. |

## Do not confuse

| This | Is not |
|------|--------|
| Role | Designation |
| Username | Display name |
| Login account | Employee assignment |
| Employee ID | Username |
| Inactivating a project | Deleting it from history |
| Inactivating an employee | Blocking their login |
| Full access | Admin role |

## Related

- [Data relationships](../03-reference/data-relationships.md)
- [Roles and access](roles-and-access.md)
