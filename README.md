# Quickbase Code Pages Developer Lab

A personal training project for learning Quickbase development through small, working examples.

The lab focuses on Quickbase Code Pages, the legacy XML API, the modern RESTful JSON API, and the Quickbase objects that appear in code such as table DBIDs, Field IDs, records, authentication, and API responses.

Live site:

https://quickbase-api-tan.vercel.app/

---

## Getting Started

Before beginning the lessons, create a small Quickbase table named:

```text
People
```

Add these fields:

| Field          | Type    |
| -------------- | ------- |
| Name           | Text    |
| Age            | Numeric |
| Favorite Color | Text    |

Quickbase will also provide the normal system fields, including `Record ID#`.

Add a few sample records so the API lessons have something to retrieve.

For example:

| Name   | Age | Favorite Color |
| ------ | --: | -------------- |
| Alice  |  32 | Blue           |
| Marcus |  41 | Green          |
| Olivia |  27 | Purple         |

The exact sample values do not matter.

What matters is that your `People` table contains records with values in those three fields.

---

## Your Field IDs Will Probably Be Different

The tutorial uses Field IDs from the original training table.

For example:

```text
Record ID#       → Field ID 3
Name             → Field ID 6
Age              → Field ID 7
Favorite Color   → Field ID 8
```

Your Quickbase table may assign different Field IDs.

Always use the Field IDs from your own table when adapting the examples.

You will also need your own table DBID:

```javascript
const TABLE_DBID = "YOUR_TABLE_DBID";
```

The lessons explain how Quickbase uses table DBIDs and Field IDs when making API requests.

---

## What the Lessons Cover

The project begins by reading records from the same `People` table in two different ways:

```text
Lesson 1A
Quickbase → XML API → XML → DOMParser → JavaScript → HTML
```

```text
Lesson 1B
Quickbase → REST API → JSON → JavaScript → HTML
```

Later lessons build on those working examples with sorting, searching, filtering, CRUD operations, pagination, relationships, and reusable JavaScript utilities.

The intent is to introduce one Quickbase concept at a time rather than hide the API behavior behind large abstractions.

---

# About This Project

This repository is a personal learning project.

I created it to improve my own understanding of Quickbase development and to keep a structured record of the lessons, experiments, mistakes, discoveries, and working examples I encounter while learning.

It is essentially a developer notebook that happens to be public.

The material reflects my understanding at the time each lesson is written. As I learn more, explanations and examples may be revised or corrected.

---

## Independent Project

This website, repository, source code, tutorials, commentary, and examples are independently created materials.

I am not affiliated with, employed by, sponsored by, endorsed by, or representing Quickbase, Inc.

Nothing in this repository should be interpreted as:

* official Quickbase documentation
* official Quickbase training material
* official technical guidance
* an endorsement by Quickbase
* a statement made on behalf of Quickbase

Official Quickbase documentation should always be used to verify current API behavior, authentication requirements, security guidance, supported features, and platform limits.

---

## Educational Code

The examples in this repository are primarily intended for learning and experimentation.

They should not automatically be treated as production-ready code.

Some examples intentionally favor clarity and visibility of Quickbase behavior over abstraction or production architecture.

Anyone adapting the code is responsible for testing it within their own Quickbase environment.

---

## Security

Do not commit Quickbase User Tokens, private credentials, or other sensitive values to a public repository.

Training examples should use placeholders such as:

```javascript
const APP_TOKEN = "YOUR_APPLICATION_TOKEN";
const TABLE_DBID = "YOUR_TABLE_DBID";
```

Never embed a Quickbase User Token in browser-side JavaScript.

---

## Contributions Welcome

Although this began as a personal training log, the project is public so others can follow along, correct mistakes, suggest better approaches, or improve the examples.

Constructive contributions are welcome.

GitHub:

https://github.com/dariansweb/Quickbase-API

---

## Disclaimer

This project is provided for educational purposes on an "as is" basis.

No warranty is made regarding correctness, completeness, fitness for a particular purpose, or continued compatibility with Quickbase.

Quickbase product names, terminology, trademarks, and related intellectual property belong to their respective owners.
