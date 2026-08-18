# Missing items or projects

Empty dropdowns on **Researcher Request** (and similar lab forms) are almost always missing data, not a broken search box.

## “You have no projects assigned”

The researcher’s **employee** record has no project codes, or there is no employee row whose `emp_name` matches their login username.

Fix: [Assign projects](../02-workflows/assign-projects.md).

## Project dropdown: “Select a manager first”

By design. They must pick **Manager** before project code/name.

## “No common projects between researcher and selected manager”

Intersection is empty.

- Researcher employee projects
- Manager employee projects
- Active projects only

Assign the manager to the same project (or pick a manager who already shares one).

## “No items available” / search finds nothing

Request items come from **received inventory** with stock &gt; 0, matching **master type**, and the researcher’s assigned projects.

Typical causes:

1. Lab Assistant has not received that item yet.
2. Stock is zero.
3. Wrong Master Type selected.
4. Item’s project is not one of the researcher’s assigned codes.
5. They searched before Master Type was chosen (lists rebuild when master type changes).

Item search matches **code and name**. If the list is truly empty, search cannot help until stock exists.

## Username empty in Assign employee

Lab + role do not match any login. Register first; pick the same lab and role as on the login.

## Lab Assistant empty on request form

No Lab Assistant login in that lab with the selected project on their employee assignment.

## Related

- [Data relationships](../03-reference/data-relationships.md)
- [Employee Project Management](../01-modules/employee-project-management.md)
- [FAQ](faq.md)
