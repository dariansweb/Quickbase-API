# Quickbase Code Pages Developer Lab

A hands-on developer training project for learning how to work with **Quickbase Code Pages, APIs, JavaScript, and Quickbase application objects** through real working examples.

This repository accompanies an evolving Quickbase tutorial application built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Quickbase Code Pages
* Quickbase legacy XML API
* Quickbase RESTful API

The purpose of this project is not to build a production application.

The purpose is to understand **how Quickbase development actually works in code**.

---

## What This Lab Teaches

The lessons assume that the developer already understands HTML, CSS, JavaScript, and normal browser development.

The emphasis is instead on Quickbase-specific concepts such as:

* Application structure
* Table DBIDs
* Field IDs
* Record IDs
* Application Tokens
* Signed-in Quickbase sessions
* Quickbase API operations
* XML request bodies
* REST JSON requests
* API headers
* Quickbase error responses
* Record parsing
* Relationships
* CRUD operations

The goal is not simply to make an API request succeed.

The goal is to understand **what every Quickbase reference in the code points to and why Quickbase requires it**.

---

# Learning Philosophy

Each lesson introduces only one major new concept.

Previous working examples remain intact so that different Quickbase techniques can be compared directly.

The general progression is:

```text
Understand the Quickbase object
        ↓
Identify how Quickbase references it
        ↓
Build the API request
        ↓
Inspect the Quickbase response
        ↓
Use the returned records in JavaScript
```

The project deliberately avoids hiding Quickbase behavior behind large libraries during the early lessons.

We want to see what Quickbase is actually doing.

---

# Lesson Roadmap

## Lesson 1A — Read Records with XML API ✅

Read records from a Quickbase People table using the legacy XML API.

Topics include:

* Table DBID
* Field IDs
* `API_DoQuery`
* `QUICKBASE-ACTION`
* Application Token
* Signed-in browser session
* `<clist>`
* `<slist>`
* Structured XML
* `<record>`
* `<f id="">`
* `errcode`
* `errtext`
* `errdetail`
* `DOMParser`

Working example:

```text
PeoplePage_xml.html
```

---

## Lesson 1B — Read Records with REST API

Read the exact same People table using the modern Quickbase RESTful API.

This lesson will allow a direct comparison between:

```text
Legacy XML API
```

and:

```text
Modern REST API
```

without changing the underlying Quickbase data.

---

## Lesson 2 — Client-Side Sorting

Sort records already returned to the browser.

---

## Lesson 3 — Client-Side Searching

Search the loaded Quickbase records using JavaScript.

---

## Lesson 4 — Client-Side Filtering

Filter records using selected field values and conditions.

---

## Lesson 5 — Add Records

Create Quickbase records from a Code Page.

---

## Lesson 6 — Edit Records

Modify existing Quickbase records.

---

## Lesson 7 — Delete Records

Delete Quickbase records and properly interpret the API response.

---

## Lesson 8 — Pagination

Retrieve and display larger datasets in manageable groups.

---

## Lesson 9 — Relationships

Work with Quickbase parent and child table relationships through code.

---

## Lesson 10 — Reusable JavaScript Library

Extract the patterns developed throughout the previous lessons into reusable Quickbase JavaScript utilities.

---

# Lesson 1A — The Central Concept

A Quickbase developer sees human-readable objects in the application:

```text
People

Record ID#
Name
Age
Favorite Color
```

The API often works with persistent Quickbase identifiers instead:

```text
People              → Table DBID

Record ID#          → Field ID 3
Name                → Field ID 6
Age                 → Field ID 7
Favorite Color      → Field ID 8
```

The JavaScript might therefore contain:

```javascript
const TABLE_DBID = "YOUR_TABLE_DBID";

const FIELD_IDS = {
  recordId: 3,
  name: 6,
  age: 7,
  favoriteColor: 8,
};
```

The JavaScript property:

```javascript
name
```

is chosen by the developer.

The value:

```javascript
6
```

is the actual Quickbase Field ID.

That distinction is fundamental to understanding Quickbase API development.

---

# Legacy XML API Example

A simplified Quickbase XML request looks like:

```xml
<qdbapi>
  <apptoken>YOUR_APPLICATION_TOKEN</apptoken>
  <fmt>structured</fmt>
  <clist>3.6.7.8</clist>
  <slist>6</slist>
  <options>sortorder-A</options>
</qdbapi>
```

It is sent to the table using a request similar to:

```javascript
const response = await fetch(`/db/${TABLE_DBID}`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/xml",
    "QUICKBASE-ACTION": "API_DoQuery",
  },
  body: requestBody,
});
```

Several different Quickbase concepts are represented here.

### `/db/${TABLE_DBID}`

Identifies the Quickbase table that should receive the request.

### `QUICKBASE-ACTION`

Identifies the legacy Quickbase API operation.

For Lesson 1A:

```text
API_DoQuery
```

means that Quickbase should query records from the targeted table.

### `credentials: "include"`

Allows the request to operate through the existing signed-in Quickbase browser session.

Quickbase can therefore evaluate the request according to the permissions of the current user.

### Application Token

The Application Token satisfies an additional API requirement configured for the Quickbase application.

An Application Token is **not** a User Token.

Do not embed Quickbase User Tokens in client-side browser JavaScript.

---

# Structured XML

When the request contains:

```xml
<fmt>structured</fmt>
```

Quickbase can return field data resembling:

```xml
<record>
  <f id="3">1</f>
  <f id="6">Alice</f>
  <f id="7">32</f>
  <f id="8">Blue</f>
</record>
```

The field identifier reconnects the XML value to the Quickbase field:

```text
<f id="6">Alice</f>

        ↓

Field ID 6

        ↓

Name
```

JavaScript can therefore locate the field using:

```javascript
record.querySelector(`f[id="${fieldId}"]`);
```

---

# Quickbase Error Handling

The legacy XML API can return Quickbase-specific error information even when the HTTP request itself succeeds.

Important XML elements include:

```xml
<errcode>
<errtext>
<errdetail>
```

An `errcode` of `0` indicates that the Quickbase API operation succeeded.

This means applications should distinguish between:

```text
HTTP error
```

and:

```text
Quickbase API error
```

They are separate layers.

---

# Application Structure

The tutorial website uses the Next.js App Router.

Current structure:

```text
app/
├── globals.css
├── layout.tsx
├── not-found.tsx
├── page.tsx
└── lessons/
    ├── layout.tsx
    ├── page.tsx
    └── 1a/
        └── page.tsx
```

`/lessons` acts as the Table of Contents.

Individual lessons use routes such as:

```text
/lessons/1a
/lessons/1b
/lessons/2
```

---

# Running the Tutorial Site

Clone the repository:

```bash
git clone https://github.com/dariansweb/Quickbase-API.git
```

Enter the project directory:

```bash
cd Quickbase-API
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Security

Do not commit real Quickbase credentials or User Tokens to this repository.

Tutorial code should use placeholders such as:

```javascript
const APP_TOKEN = "YOUR_APPLICATION_TOKEN";
```

and:

```javascript
const TABLE_DBID = "YOUR_TABLE_DBID";
```

where appropriate.

If you fork this repository to experiment with your own Quickbase application, verify that sensitive credentials are not included before committing or pushing changes.

---

# Contributions Are Welcome ❤️

This project is intentionally being built in public.

If you are a Quickbase developer, administrator, builder, JavaScript developer, API developer, or simply learning alongside the project, contributions are welcome.

You can help by:

* Improving explanations
* Correcting Quickbase terminology
* Improving code comments
* Suggesting additional examples
* Reporting mistakes
* Proposing new developer exercises
* Improving accessibility
* Improving TypeScript or React code
* Testing lessons against Quickbase
* Opening issues when something is unclear

The guiding rule is simple:

> Keep the examples understandable and teach one Quickbase concept at a time.

---

# Repository

GitHub:

https://github.com/dariansweb/Quickbase-API

---

# Disclaimer

This is an independent educational project created for learning Quickbase development techniques.

It is not official Quickbase documentation and is not a replacement for the official Quickbase API documentation.

Quickbase product names and related terminology belong to their respective owners.
