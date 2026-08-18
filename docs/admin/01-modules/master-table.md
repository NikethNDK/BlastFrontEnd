# Master Table

**Sidebar:** Master Table  
**URL:** `/master_table`  
**Screen title:** Lab & designation form

## What this screen is for

This is the list of **labs** and **designations** used everywhere else. Employee Registration cannot assign a lab or title that does not exist here.

Create labs and designations **before** users.

## Who should use it

Admin only.

## What you see

1. Dropdown **Select Option**: Lab or Designation.
2. After you pick one: a name field and **Save**.
3. A table of existing rows.

Until you select Lab or Designation, the table is empty by design.

## Labs

### Add a lab

1. Select **Lab**.
2. Enter **Lab Name**.
3. Click **Save**.
4. Toast: “Lab added successfully!”

Rules:

- Name is required (empty Save shows “Fill the field!”).
- Duplicate names are blocked, ignoring case and extra spaces (“DNA Lab” vs “dna lab”).
- Toast: “Lab already exists!”

### Rename a lab

1. Click the **edit** (pencil) icon.
2. Change the name. Enter to save, Escape to cancel.
3. Confirm with the check icon, or cancel with the X.
4. Empty name → “Lab name cannot be empty”. Duplicate → “Lab already exists!”
5. Toast: “Lab renamed successfully!”

Designations cannot be renamed from this screen (no edit icon). Delete and re-add if you must change a title.

### Full access

Each lab has a **Full access** switch (On / Off).

| Switch | Meaning |
|--------|---------|
| **On** | Users assigned to this lab get Blast + DNA Repository as well as inventory (for their role). |
| **Off** | Inventory-only (restricted app) unless they also belong to another lab that is On. |

Toasts:

- On → “Full access enabled (Blast + Repository)”
- Off → “Full access disabled (Inventory only)”

Admin always has full access regardless of this switch.

A user with **multiple labs** is full access if **any** of those labs is On.

### Delete a lab

Trash icon → “Lab deleted successfully!”

Do not delete a lab that still has users or stock if you can avoid it. Prefer renaming. If delete fails, the toast shows the server error.

## Designations

Designation is a **job title**, not a role. Roles are Manager / Lab Assistant / Researcher. Designation is the extra label (for example “Senior Scientist”).

### Add

1. Select **Designation**.
2. Enter the title.
3. Save. Same duplicate and empty rules as labs.

### Delete

Trash icon → “Designation deleted successfully!”

There is no rename and no Full access column for designations.

## What this does *not* do

- Does not create login accounts.
- Does not assign people to labs (that is Employee Registration).
- Does not create projects.

## Common mistakes

| Mistake | Result |
|---------|--------|
| Create users before labs | Registration has an empty lab dropdown |
| Confusing designation with role | Wrong mental model; role still controls the app |
| Turning Full access Off and expecting Blast | Users lose Blast/DNA |
| Deleting a lab still in use | Users/forms can break |

## Related

- [Set up a new lab](../02-workflows/set-up-a-new-lab.md)
- [Roles and access](../00-overview/roles-and-access.md)
- [Screens and fields](../03-reference/screens-and-fields.md)
