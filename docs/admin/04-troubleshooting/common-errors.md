# Common errors

Messages you will see in Admin, and what to do.

## Master Table

| Message | Cause | What to do |
|---------|--------|------------|
| Lab / Designation already exists! | Duplicate name (ignores case) | Use the existing row or a different name |
| Fill the field! | Empty name | Type a name |
| Lab name cannot be empty | Rename with blank | Type a name |
| Lab deleted / Designation deleted successfully | Confirmed delete | If this was a mistake, recreate the name (ids will be new) |
| Full access enabled/disabled… | Toggle saved | Expected |

## Employee Registration

| Message | Cause | What to do |
|---------|--------|------------|
| Please fill all fields | Missing username, password, role, designation, or labs | Complete the form |
| Username already exists | Duplicate username | Pick another; usernames are unique ignoring case |
| Lab Assistant must be assigned to exactly one lab | 0 or 2+ labs | Leave exactly one |
| Please select a valid designation | Designation not a real Master Table id | Re-select from the list; add designations first |
| Registered Successfully | Login created | Next: assign projects |
| User updated successfully | Edit saved | If username changed, check employee assignment |
| Failed to Register / Failed to update user | Server/network | Retry; read the toast |

## Project Management

| Message | Cause | What to do |
|---------|--------|------------|
| Project added successfully | Created | OK |
| Project code already exists | Duplicate code | New unique code |
| Project inactivated | Soft-deactivated | Stop using it for new work |
| Failed to inactivate project | Server | Retry |
| No projects to export | Empty filtered list | Clear search |

## Employee Project Management

| Message | Cause | What to do |
|---------|--------|------------|
| Employee added successfully | Assignment created | OK |
| Employee ID already exist | Duplicate emp_id | New ID |
| Employee marked as inactive | Soft-deactivated assignment | OK |
| Failed to update Employee status | Server | Retry |
| No users available (username dropdown) | No login with that lab+role | Register first; match lab and role |

## Password Reset / Change Password

| Message | Cause | What to do |
|---------|--------|------------|
| Please enter a new password | Blank | Type a password |
| Password reset successfully! | Admin reset saved | User uses new password |
| Password changed successfully! | Self-service saved | Same |
| User not found | Username missing on server | Check login exists |
| An error occurred / Something went wrong | Server | Retry |

## Login page

| Message | Cause | What to do |
|---------|--------|------------|
| Please enter username / password | Empty | Fill both |
| Username or password incorrect | No match | See [login-and-passwords.md](login-and-passwords.md) |
| You are blocked | Login inactive | Not the employee inactive button |
| Something went wrong. Please contact support | Role not recognised | Check role on the login record |

## Related

- [FAQ](faq.md)
- Module docs in [01-modules](../01-modules/master-table.md)
