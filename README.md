# Quickbase Code Pages Developer Lab

A hands-on Quickbase API developer lab built from real, working Code Pages — from first record retrieval through querying, CRUD operations, schema discovery, relationships, and dynamic schema creation.

This project began as a personal training project for learning Quickbase development one concept at a time. It has grown into a structured collection of tutorials, working Code Page examples, and practical Quickbase developer utilities.

The goal is not to hide Quickbase behind large abstractions.

The goal is to see what Quickbase is doing.

## Live Project

**Tutorial Site**

https://quickbase-api-tan.vercel.app/

**GitHub Repository**

https://github.com/dariansweb/Quickbase-API

---

# Two Parts of the Project

The project now has two complementary areas:

```text
Quickbase API Developer Lab
│
├── Tutorials
│   └── Learn how the Quickbase APIs work
│
└── QB Tools
    └── Use practical utilities built from those lessons
```

## Tutorials

The tutorials build Quickbase API knowledge progressively through small, working examples.

Each lesson focuses primarily on a Quickbase concept rather than general JavaScript instruction.

The examples intentionally expose things such as:

- REST endpoints
- HTTP methods
- request headers
- JSON payloads
- Quickbase responses
- App DBIDs
- Table DBIDs
- Field IDs
- Record IDs
- query criteria
- pagination
- schema metadata
- relationships
- reference fields
- lookup fields

Students are expected to have a reasonable understanding of JavaScript, including functions, objects, arrays, `fetch()`, promises, and `async` / `await`.

## QB Tools

The lessons explain the machinery.

**QB Tools uses the machinery.**

The `/qbtools` area contains practical Quickbase developer utilities that grew out of discoveries made while building the tutorials.

These tools are intended to make Quickbase API behavior easier to inspect, understand, and experiment with.

As the project grows, additional utilities may be added here.

---

# Learning Path

The lab begins with a very small `People` table and progressively moves deeper into the Quickbase APIs.

| Lesson | Topic |
| --- | --- |
| **1A** | Read Records with the XML API |
| **1B** | Read Records with the REST API |
| **2** | Client-Side Sorting |
| **3** | Server-Side Searching with Quickbase Query Criteria |
| **4** | Quickbase Query Operators |
| **5** | Add Records |
| **6** | Edit Records |
| **7** | Delete Records |
| **8** | Pagination |
| **9** | Quickbase Schema Explorer |
| **10** | Dynamic Schema Creation |
| **Capstone** | Quickbase REST API Developer Review |

The progression looks roughly like this:

```text
Records
   ↓
Queries
   ↓
CRUD
   ↓
Pagination
   ↓
Schema Discovery
   ↓
Dynamic Schema Creation
   ↓
Capstone Review
```

The early lessons work primarily with records.

The later lessons begin examining Quickbase itself.

---

# What the Lab Covers

## XML and REST APIs

The project begins by reading the same Quickbase records using two different APIs.

### Lesson 1A

```text
Quickbase
    ↓
XML API
    ↓
XML
    ↓
DOMParser
    ↓
JavaScript
    ↓
HTML
```

### Lesson 1B

```text
Quickbase
    ↓
REST API
    ↓
JSON
    ↓
JavaScript
    ↓
HTML
```

This provides a practical comparison between the legacy Quickbase XML API and the modern RESTful JSON API.

---

## Querying Quickbase

Later lessons introduce Quickbase query behavior, including:

- server-side searching
- query criteria
- query operators
- filtering
- pagination
- `top`
- `skip`

Rather than downloading everything and letting JavaScript decide what records matter, the lessons progressively move more responsibility to Quickbase.

---

## CRUD Operations

The lab builds a complete record lifecycle:

```text
READ
  ↓
ADD
  ↓
EDIT
  ↓
DELETE
```

The student can observe the request sent to Quickbase, the returned JSON, and the identifiers involved in each operation.

---

# Quickbase Identifiers

Understanding Quickbase identifiers becomes increasingly important as the lab progresses.

The major identifiers include:

```text
App DBID
Table DBID
Field ID
Record ID#
Relationship ID
```

These identifiers connect API operations together.

For example:

```text
Create Table
     ↓
Quickbase returns Table DBID
     ↓
Create Field in that table
     ↓
Quickbase returns Field ID
     ↓
Use those identifiers in later requests
```

A major principle of the later lessons is:

> Never guess an identifier when Quickbase can return or discover it.

---

# Field IDs Belong to Tables

Field IDs are not globally unique throughout an entire Quickbase application.

Different tables can legitimately contain the same Field ID.

For example:

```text
Departments
Department Name → FID 6

People
Name → FID 6

Tasks
Task Name → FID 6
```

These are three different fields.

A Field ID has meaning within the context of its table.

Conceptually:

```text
Departments / FID 6
People      / FID 6
Tasks       / FID 6
```

This is why later examples work with both Table DBIDs and Field IDs.

---

# Schema Discovery

Lesson 9 moves beyond record operations and begins inspecting Quickbase application metadata.

The **Quickbase Schema Explorer** dynamically discovers the current application and can inspect:

- application tables
- Table DBIDs
- table metadata
- fields
- Field IDs
- field properties
- relationships
- parent tables
- child tables
- reference fields
- lookup fields
- raw Quickbase JSON

This eliminates much of the hard-coded schema information used by the earlier training examples.

The progression becomes:

```text
EARLY LESSONS

Known Table DBID
Known Field IDs
       ↓
Make API request
```

and eventually:

```text
LATER LESSONS

Discover tables
       ↓
Discover fields
       ↓
Discover relationships
       ↓
Capture DBIDs and FIDs
       ↓
Use discovered metadata
```

---

# Dynamic Schema Creation

Lesson 10 reverses what Lesson 9 accomplished.

Lesson 9 asks:

> What schema already exists?

Lesson 10 asks:

> Can JavaScript tell Quickbase what schema to create?

Starting with the existing `People` training table, the lesson dynamically builds:

```text
Departments
     ↓
   People
     ↓
   Tasks
```

The REST API is used to create:

### Departments

```text
Department Name
Location
```

### Tasks

```text
Task Name
Due Date
Status
```

### Relationships

```text
Departments → People
People → Tasks
```

Returned Table DBIDs, Field IDs, and relationship metadata are captured and used by subsequent requests.

---

# Quickbase Creates Schema Too

One of the most important discoveries in the later lessons is that our JavaScript does not explicitly create every physical field that appears in the finished application.

## Creating a Table

Our API request may ask Quickbase to create:

```text
Departments
```

Quickbase also provides its normal system fields, including:

```text
Date Created
Date Modified
Record ID#
Record Owner
Last Modified By
```

Our code did not separately create those fields.

Quickbase did.

## Creating a Relationship

Our code may request:

```text
Departments → People
```

and request a reference field named:

```text
Related Department
```

while identifying parent fields to use as lookups.

Quickbase then constructs the supporting relationship schema.

The finished child table may contain fields such as:

```text
Related Department
Department Name
Department - Location
```

Those fields should not be confused with ordinary fields that our code created separately using the Fields API.

This distinction is a major theme of the schema lessons:

```text
WHAT OUR REQUEST EXPLICITLY CREATES

vs.

WHAT QUICKBASE CREATES TO SUPPORT THE REQUEST
```

---

# Relationship Perspective

Quickbase relationship metadata exposed another important behavior during development.

Consider:

```text
Departments
     ↓
   People
```

`Departments` is the parent.

`People` is the child.

The reference field lives on the child:

```text
People
└── Related Department
```

The Quickbase relationship endpoint presents relationship metadata from this child-side perspective.

As a result, inspecting the relationship schema for `People` can reveal:

```text
Parent: Departments
Child: People
Reference: Related Department
Lookups:
  Department Name
  Department - Location
```

while inspecting the parent table may return no relationships from that endpoint.

That does **not** mean the parent is unrelated.

It reflects how Quickbase exposes relationship metadata through the child table containing the reference field.

---

# Quickbase as the Source of Truth

The later Code Pages do not rely entirely on temporary JavaScript state.

For example, the Dynamic Schema Creation page can inspect Quickbase when it loads:

```text
Load Code Page
      ↓
Discover App DBID
      ↓
Get Tables
      ↓
Find People
Find Departments
Find Tasks
      ↓
Get Fields
      ↓
Get Relationships
      ↓
Reconstruct Lesson State
      ↓
Determine Completed Steps
      ↓
Enable Next Valid Action
```

This allows the page to resume from the actual Quickbase application state after a reload.

The browser does not decide what exists.

**Quickbase does.**

---

# QB Tools

Practical developer utilities created from the concepts explored in the lab are being collected under:

```text
/qbtools
```

These tools are separate from the sequential lessons.

The lessons explain individual concepts.

QB Tools combines those concepts into utilities that can be useful while developing or examining Quickbase applications.

## Schema Explorer

The Schema Explorer grew directly out of Lesson 9.

It can dynamically inspect:

- tables
- Table DBIDs
- table schema
- fields
- Field IDs
- relationships
- parent and child tables
- reference fields
- lookup fields
- raw JSON

It also provides additional teaching context around Quickbase's child-oriented relationship metadata.

## Live Analyzer

The Live Analyzer is intended as a broader developer utility and capstone exploration of the Quickbase REST API.

Its goal is to connect concepts such as:

```text
REQUEST
   ↓
ENDPOINT
   ↓
IDENTIFIERS
   ↓
QUICKBASE
   ↓
RESPONSE
   ↓
METADATA
```

Rather than hiding API behavior, the analyzer is intended to make that behavior visible.

Additional QB Tools may be added as the project develops.

---

# Getting Started

Before beginning the early lessons, create a small Quickbase table named:

```text
People
```

Add these fields:

| Field | Type |
| --- | --- |
| Name | Text |
| Age | Numeric |
| Favorite Color | Text |

Quickbase will also provide its normal system fields, including `Record ID#`.

Add a few sample records so the API lessons have something to retrieve.

For example:

| Name | Age | Favorite Color |
| --- | ---: | --- |
| Alice | 32 | Blue |
| Marcus | 41 | Green |
| Olivia | 27 | Purple |

The exact sample values do not matter.

What matters is that the `People` table contains records with values in those three fields.

---

# Your Field IDs Will Probably Be Different

The early tutorial examples use Field IDs from the original training table.

For example:

```text
Record ID#       → Field ID 3
Name             → Field ID 6
Age              → Field ID 7
Favorite Color   → Field ID 8
```

Your Quickbase table may assign different Field IDs.

Always use the Field IDs from your own table when adapting the early examples.

You will also have your own Table DBID.

For example:

```javascript
const TABLE_DBID = "YOUR_TABLE_DBID";
```

Later lessons demonstrate how these identifiers can be discovered dynamically rather than permanently hard-coded.

---

# Code Pages and Authentication

Many examples in this project are designed to run as Quickbase Code Pages within a signed-in Quickbase session.

Different Quickbase APIs and operations may have different authentication requirements.

The project intentionally exposes authentication behavior when it is relevant to the lesson rather than hiding it behind an abstraction.

Some examples use application-token placeholders where required.

Later Code Page examples also use Quickbase temporary authorization obtained from the signed-in Quickbase environment.

Always verify current authentication requirements against official Quickbase documentation.

---

# Security

Do not commit Quickbase User Tokens, private credentials, temporary authorization values, or other sensitive information to a public repository.

Training files should contain placeholders or empty configuration values where appropriate.

For example:

```javascript
const APP_TOKEN = "";
```

or:

```javascript
const APP_TOKEN = "YOUR_APPLICATION_TOKEN";
```

Never embed a permanent Quickbase User Token in public browser-side JavaScript.

Temporary authorization values should be requested at runtime rather than copied into source files.

Anyone adapting these examples is responsible for evaluating the security requirements of their own Quickbase environment.

---

# Educational Code

The examples in this repository are primarily intended for learning and experimentation.

They should not automatically be treated as production-ready code.

Some examples intentionally favor:

- readability
- visible API behavior
- explicit requests
- explicit responses
- raw JSON
- incremental development

over:

- abstraction
- reusable libraries
- framework architecture
- production optimization

This is intentional.

The project is about understanding what Quickbase is doing.

Anyone adapting the code for production use is responsible for appropriate testing, security review, error handling, architecture, and maintenance.

---

# About This Project

This repository began as a personal learning project.

I created it to improve my own understanding of Quickbase development and to keep a structured record of the lessons, experiments, mistakes, discoveries, and working examples I encounter while learning.

It is essentially a developer notebook that happens to be public.

As the project developed, the examples progressed from retrieving records to examining and dynamically modifying Quickbase application schema.

The material reflects my understanding at the time each lesson is written.

As I learn more, explanations and examples may be revised or corrected.

---

# Independent Project

This website, repository, source code, tutorials, commentary, utilities, and examples are independently created materials.

I am not affiliated with, employed by, sponsored by, endorsed by, or representing Quickbase, Inc.

Nothing in this repository should be interpreted as:

- official Quickbase documentation
- official Quickbase training material
- official technical guidance
- an endorsement by Quickbase
- a statement made on behalf of Quickbase

Official Quickbase documentation should always be used to verify current:

- API behavior
- authentication requirements
- security guidance
- supported features
- platform limits

Quickbase product names, terminology, trademarks, and related intellectual property belong to their respective owners.

---

# Contributions Welcome

Although this began as a personal training log, the project is public so others can follow along, experiment with the examples, correct mistakes, suggest better approaches, or improve the material.

Constructive contributions are welcome.

GitHub:

https://github.com/dariansweb/Quickbase-API

---

# License

This project is released under **The Unlicense**.

You are free to copy, modify, publish, use, compile, sell, distribute, remix, rewrite, or otherwise do whatever you want with the code and tutorial material in this repository.

Attribution is not required.

If something here helps you, take it and use it.

See the `LICENSE` file for the full license text.

---

# Disclaimer

This project is provided for educational purposes on an **"as is"** basis.

No warranty is made regarding correctness, completeness, fitness for a particular purpose, security, or continued compatibility with Quickbase.

Anyone using or adapting the examples is responsible for testing them within their own Quickbase environment.

---

## Quickbase Code Pages Developer Lab

**Learn the API. Inspect the response. Understand what Quickbase did.**