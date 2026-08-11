export type LessonStatus = "complete" | "next" | "upcoming";

export type Lesson = {
  number: string;
  title: string;
  description: string;
  status: LessonStatus;
  link: string;
  workingExample?: string;
  nextObjective?: string;
};

export const lessons: Lesson[] = [
  {
    number: "1A",
    title: "Read Records with XML API",
    description:
      "Learn how Quickbase tables, Field IDs, Application Tokens, API_DoQuery, and structured XML work together to retrieve People records.",
    status: "complete",
    link: "/lessons/1a",
    workingExample: "PeoplePage_xml.html",
  },
  {
    number: "1B",
    title: "Read Records with REST API",
    description:
      "Query the same People table with the Quickbase REST API and learn how temporary authorization, JSON requests, Field IDs, and REST responses replace the XML workflow.",
    status: "complete",
    link: "/lessons/1b",
    workingExample: "PeoplePage_rest.html",
  },
  {
    number: "2",
    title: "Control Returned Data with Client-Side Sorting",
    description:
      "Retain Quickbase records in JavaScript, manipulate the client-side dataset, and re-render it without sending another request to Quickbase.",
    status: "complete",
    link: "/lessons/2",
    workingExample: "PeoplePage_sort.html",
  },
  {
    number: "3",
    title: "Query Quickbase with Search Criteria",
    description:
      "Build a REST where expression and send it to Quickbase so only records matching the requested criteria are returned.",
    status: "complete",
    link: "/lessons/3",
    workingExample: "PeoplePage_search.html",
  },
  {
    number: "4",
    title: "Quickbase Query Operators",
    description:
      "Explore Quickbase query operators beyond EX and learn how different comparisons control which records the REST API returns.",
    status: "complete",
    link: "/lessons/4",
    nextObjective:
      "Use different Quickbase query operators with the People fields and observe how each operator changes the records returned.",
  },
  {
    number: "5",
    title: "Add Records",
    description:
      "Begin the CRUD workflow by sending People field values to the Quickbase REST API and creating a new record.",
    status: "complete",
    link: "/lessons/5",
    workingExample: "PeoplePage_add.html",
    nextObjective:
      "Create a new People record with Name, Age, and Favorite Color, then query Quickbase again to confirm the record was created.",
  },
  {
    number: "6",
    title: "Edit Records",
    description:
      "Continue the CRUD workflow by identifying an existing People record and sending updated field values to Quickbase.",
    status: "complete",
    link: "/lessons/6",
  },
  {
    number: "7",
    title: "Delete Records",
    description:
      "Complete the CRUD workflow by identifying an existing People record, deleting it through the Quickbase REST API, and confirming the result.",
    status: "complete",
    link: "/lessons/7",
  },
  {
    number: "8",
    title: "Pagination",
    description: "Request and display larger datasets in manageable pages.",
    status: "next",
    link: "/lessons/8",
  },
  {
    number: "9",
    title: "Relationships",
    description:
      "Work with Quickbase parent-child relationships through the API.",
    status: "upcoming",
    link: "/lessons/9",
  },
  {
    number: "10",
    title: "Reusable JavaScript Library",
    description:
      "Extract the patterns learned throughout the lab into reusable Quickbase development utilities.",
    status: "upcoming",
    link: "/lessons/10",
  },
];
