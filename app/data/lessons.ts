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
      "Read People records using API_DoQuery, fetch(), the Quickbase session, an Application Token, XML, and DOMParser.",
    status: "complete",
    link: "/lessons/1a",
    workingExample: "PeoplePage_xml.html",
  },
  {
    number: "1B",
    title: "Read Records with REST API",
    description:
      "Read the exact same People table using the modern Quickbase RESTful JSON API.",
    status: "complete",
    link: "/lessons/1b",
    workingExample: "PeoplePage_rest.html",
  },
  {
    number: "2",
    title: "Client-Side Sorting",
    description:
      "Sort records already loaded into the browser without sending another request to Quickbase.",
    status: "complete",
    link: "/lessons/2",
    nextObjective:
      "Add client-side sorting to records already returned from Quickbase.",
    workingExample: "PeoplePage_sort.html",
  },
  {
    number: "3",
    title: "Client-Side Searching",
    description:
      "Search the records displayed by the Code Page using JavaScript.",
    status: "next",
    link: "/lessons/3",
  },
  {
    number: "4",
    title: "Client-Side Filtering",
    description:
      "Filter the displayed dataset using specific field values and conditions.",
    status: "upcoming",
    link: "/lessons/4",
  },
  {
    number: "5",
    title: "Add Records",
    description: "Create new Quickbase records from a Code Page.",
    status: "upcoming",
    link: "/lessons/5",
  },
  {
    number: "6",
    title: "Edit Records",
    description:
      "Update existing Quickbase records from the training application.",
    status: "upcoming",
    link: "/lessons/6",
  },
  {
    number: "7",
    title: "Delete Records",
    description:
      "Delete Quickbase records and properly handle the resulting API response.",
    status: "upcoming",
    link: "/lessons/7",
  },
  {
    number: "8",
    title: "Pagination",
    description: "Request and display larger datasets in manageable pages.",
    status: "upcoming",
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
