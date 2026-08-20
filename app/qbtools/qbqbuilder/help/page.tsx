import type { ReactNode } from "react";

const tocItems = [
  ["application-context", "Application Context"],
  ["relationship-explorer", "Relationship Explorer"],
  ["visual-query-builder", "Visual Query Builder"],
  ["live-query-results", "Live Query Results"],
  ["query-jinja-tester", "Query & Jinja Tester"],
  ["workbench-analysis", "Workbench Analysis"],
] as const;

function CodeExample({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-4 font-mono text-sm leading-6 text-slate-100">
      {children}
    </pre>
  );
}

function Callout({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "purple" | "red";
}) {
  const tones = {
    blue: "border-blue-500 bg-blue-50 text-slate-700",
    green: "border-green-600 bg-green-50 text-slate-700",
    amber: "border-amber-500 bg-amber-50 text-slate-700",
    purple: "border-purple-500 bg-purple-50 text-slate-700",
    red: "border-red-600 bg-red-50 text-slate-700",
  } as const;

  return (
    <div
      className={`mt-5 rounded-r-xl border-l-4 p-4 leading-7 ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <strong className="block text-[#184a7b]">{title}</strong>
      <div className="mt-1 leading-6 text-slate-600">{children}</div>
    </div>
  );
}

function Section({
  id,
  title,
  lead,
  children,
}: {
  id?: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-2xl font-extrabold text-[#184a7b] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
        {lead}
      </p>
      {children}
      {id && (
        <a
          href="#top"
          className="mt-6 inline-block text-sm font-extrabold text-[#1f5c99] hover:underline"
        >
          ↑ Back to top
        </a>
      )}
    </section>
  );
}

function Subheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 text-lg font-extrabold text-slate-700">{children}</h3>
  );
}

function Benefit({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#31597a]">
        Real-life benefit
      </p>
      <p className="mt-2 leading-7 text-slate-600">{children}</p>
    </div>
  );
}

export default function QueryJinjaWorkbenchStudentGuidePage() {
  return (
    <main id="top" className="min-h-screen bg-slate-100 text-slate-800">
      <section className="bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-blue-100">
            Quickbase REST-API Utilities
          </p>

          <h1 className="mt-3 max-w-5xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Query &amp; Jinja Workbench — Student Guide
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-blue-50">
            This guide is for learning by doing. You do not need to memorize the
            Quickbase JSON API, and you do not need to understand every symbol
            before you begin. The Workbench is designed to show you what
            Quickbase is doing while you build, test, and run queries.
          </p>

          <div className="mt-6 max-w-4xl rounded-xl border border-white/20 bg-white/10 p-4 leading-7 text-blue-50">
            <strong className="text-white">
              The JSON API monster is mostly just a very picky messenger.
            </strong>{" "}
            You tell it what table to use, what records you want, and what
            fields to return. The Workbench helps you build that message safely
            and explains the parts as you go.
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav
            aria-label="Table of Contents"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1f5c99]">
              Student Guide
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#184a7b]">
              Table of Contents
            </h2>

            <ol className="mt-4 space-y-2 text-sm">
              {tocItems.map(([id, label], index) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 font-bold text-slate-700 hover:bg-blue-50 hover:text-[#1f5c99]"
                  >
                    {index + 1}. {label}
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
              Tip: the main Workbench sections can be expanded or collapsed.
              Keep only the parts you are using open.
            </p>
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <Section
            title="How to Learn With This Tool"
            lead="The best way to use the Workbench is to start small, change one thing at a time, and watch what happens. A good learning session might begin with one field, one operator, and one value. Then add another condition, try a relationship, run the query, and compare the result."
          >
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoCard title="Build">
                Choose tables, fields, operators, and values without typing the
                whole query by hand.
              </InfoCard>
              <InfoCard title="Explain">
                See which FIDs, relationship fields, and logical connectors are
                being used.
              </InfoCard>
              <InfoCard title="Run">
                Send valid one-table QBL to Quickbase and see real records come
                back.
              </InfoCard>
              <InfoCard title="Break It">
                Paste bad syntax or unusual Jinja and learn from the warnings
                instead of being afraid of mistakes.
              </InfoCard>
            </div>

            <Callout tone="green">
              <strong>A mistake is useful here.</strong> If a query fails, the
              goal is not to feel stuck. The goal is to see why it failed and
              fix one part at a time.
            </Callout>
          </Section>

          <Section
            id="application-context"
            title="1. Application Context"
            lead="Application Context is the starting point for everything else. It tells the Workbench which Quickbase app and table you are working with."
          >
            <Subheading>Why this matters</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Quickbase field numbers are called{" "}
              <strong className="text-[#184a7b]">FIDs</strong>. A FID only has
              meaning inside its own table. For example, FID 6 might be{" "}
              <em>Name</em> in People but <em>Task Name</em> in Tasks. The
              Workbench needs the table first so it knows what each FID means.
            </p>

            <Callout>
              <strong>Important:</strong> the Quickbase Table selected here
              controls Condition 1 in the Visual Query Builder and the starting
              table in the Relationship Explorer.
            </Callout>

            <Subheading>What happens behind the scenes</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              The Workbench reads the app schema and builds a cache of tables,
              fields, and relationships. You do not need to manage that cache
              yourself. It simply gives the rest of the tool enough information
              to make smart choices.
            </p>

            <Subheading>Try this</Subheading>
            <ol className="mt-3 list-decimal space-y-2 pl-6 leading-7 text-slate-600">
              <li>Select the People table.</li>
              <li>Look at the number of cached fields.</li>
              <li>Switch to Tasks.</li>
              <li>
                Notice that the field choices in the Visual Query Builder
                change.
              </li>
            </ol>

            <Benefit>
              In a real app, this helps prevent one of the most common API
              mistakes: sending a query with a FID that belongs to the wrong
              table.
            </Benefit>
          </Section>

          <Section
            id="relationship-explorer"
            title="2. Relationship Explorer"
            lead={
              <>
                The Relationship Explorer answers a simple question:{" "}
                <strong>How are these two tables connected?</strong>
              </>
            }
          >
            <Subheading>Why this matters</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Quickbase relationships can create reference, lookup, and summary
              fields. Those fields often let you query related information
              without doing a traditional SQL JOIN.
            </p>

            <CodeExample>{`People → Tasks
Related Person — FID 9
Person - Name — FID 10`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              In this example, Tasks stores the related People Record ID# in FID
              9, while FID 10 carries the person&apos;s name into Tasks as a
              lookup.
            </p>

            <Subheading>Direct path vs. multi-step path</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Some tables are directly related. Others are connected through
              another table.
            </p>

            <CodeExample>{`Departments → People → Tasks`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              The explorer finds the shortest relationship path so you can
              understand how the data travels through the app.
            </p>

            <Callout tone="amber">
              The Relationship Explorer does not replace the full Application
              Analyzer. It only shows the relationship information needed for
              the query you are trying to understand.
            </Callout>

            <Subheading>Try this</Subheading>
            <ol className="mt-3 list-decimal space-y-2 pl-6 leading-7 text-slate-600">
              <li>Set People as the main Quickbase Table.</li>
              <li>Open Relationship Explorer.</li>
              <li>Select Tasks as the related table.</li>
              <li>Find the path and locate the reference field.</li>
              <li>Then try Departments and compare the result.</li>
            </ol>

            <Benefit>
              When you inherit an unfamiliar app, this can help you answer,
              “Which field actually connects these records?” before you begin
              writing QBL.
            </Benefit>
          </Section>

          <Section
            id="visual-query-builder"
            title="3. Visual Query Builder"
            lead="The Visual Query Builder is where you create QBL without needing to type every brace, dot, quote, and operator by hand."
          >
            <Subheading>Start with one condition</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Choose a field, operator, and value. The Workbench turns those
              choices into Quickbase Query Language.
            </p>

            <CodeExample>{`Field: Name — FID 6
Operator: EX
Value: Alice

QBL:
{6.EX.'Alice'}`}</CodeExample>

            <Subheading>Add another condition</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Use <strong>Add Condition</strong> to combine filters with AND or
              OR.
            </p>

            <CodeExample>{`{6.EX.'Alice'}AND{7.GTE.'18'}`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              This means: Name equals Alice <strong>and</strong> Age is greater
              than or equal to 18.
            </p>

            <Subheading>Use related tables</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Added conditions can switch to another table. The builder then
              shows relationship path fields and normal fields from that related
              table.
            </p>

            <Callout tone="green">
              <strong>QBL Native</strong> means all selected conditions can
              still be expressed on one Quickbase table.
            </Callout>

            <Callout tone="amber">
              <strong>Cross-Table Query Plan Required</strong> means the
              selected conditions live on more than one table. Quickbase cannot
              combine those FIDs in one <code>records/query</code> request.
            </Callout>

            <Subheading>Example: a cross-table question</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Suppose you want People in Finance who also have Open Tasks.
            </p>

            <CodeExample>{`[People] {19.EX.'Finance'}
AND
[Tasks] {8.EX.'Open'}`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              The builder keeps those pieces separate and shows the relationship
              bridge instead of pretending they are one legal QBL query.
            </p>

            <Benefit>
              This helps you learn where Quickbase can solve the problem with
              QBL alone and where JavaScript may be needed later to coordinate
              more than one REST request.
            </Benefit>
          </Section>

          <Section
            id="live-query-results"
            title="4. Live Query Results"
            lead="Live Query Results is where your valid one-table QBL becomes a real JSON API request."
          >
            <Subheading>What the Workbench sends</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              A Quickbase records query normally needs three main ideas:
            </p>

            <CodeExample>{`from   = which table
where  = which records
select = which fields to return`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              The Workbench builds that request for you and shows the JSON so
              you can learn from it.
            </p>

            <Subheading>Fields to Return</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              The first time you run a query, the Workbench automatically
              selects Record ID# plus the fields used in the query. You can then
              add or remove fields and run it again.
            </p>

            <CodeExample>{`"select": [3, 10, 8]`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              That might mean: return Record ID#, Person - Name, and Status.
            </p>

            <Callout>
              This is not just hiding columns on the screen. Changing the
              checkboxes changes the actual JSON API <code>select</code> array
              sent to Quickbase.
            </Callout>

            <Subheading>What to watch for</Subheading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard title="HTTP Status 200">
                The request reached Quickbase successfully.
              </InfoCard>
              <InfoCard title="Records Returned">
                How many records matched the QBL.
              </InfoCard>
              <InfoCard title="Execution Time">
                How long the request took.
              </InfoCard>
              <InfoCard title="Request / Response JSON">
                The exact messages sent to and returned from Quickbase.
              </InfoCard>
            </div>

            <Subheading>Example relationship query</Subheading>
            <CodeExample>{`Tasks
{10.EX.'Mario'}AND{8.EX.'Open'}`}</CodeExample>

            <p className="mt-4 leading-7 text-slate-600">
              This can return Open Tasks where the Person - Name lookup equals
              Mario. Quickbase does the filtering. JavaScript only sends the
              request and displays the response.
            </p>

            <Benefit>
              You can test a query before using it in a larger application and
              learn exactly what Quickbase will return.
            </Benefit>
          </Section>

          <Section
            id="query-jinja-tester"
            title="5. Query & Jinja Tester"
            lead={
              <>
                The Tester is your safe place to paste code you already have and
                ask, <strong>“What is this doing?”</strong>
              </>
            }
          >
            <Subheading>Quickbase QBL</Subheading>
            <CodeExample>{`{6.EX.'Alice'}`}</CodeExample>
            <p className="mt-4 leading-7 text-slate-600">
              The Tester can identify the FID, operator, matching value, and
              field name from the live schema.
            </p>

            <Subheading>Pipelines Jinja</Subheading>
            <CodeExample>{`{{a.name | upper}}`}</CodeExample>
            <p className="mt-4 leading-7 text-slate-600">
              Jinja is used by Quickbase Pipelines to work with values from
              Pipeline steps and runtime helpers.
            </p>

            <Subheading>Hybrid Advanced Query</Subheading>
            <CodeExample>{`{6.EX.'{{a.customer_id}}'}`}</CodeExample>
            <p className="mt-4 leading-7 text-slate-600">
              This combines Quickbase query syntax on the outside with a Jinja
              value on the inside.
            </p>

            <Callout tone="purple">
              The Workbench can inspect Jinja and warn about known problems, but
              it is not the Pipelines runtime. A Jinja expression may still need
              to be tested inside Quickbase Pipelines.
            </Callout>

            <Subheading>Try breaking it</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              Paste malformed queries, lowercase connectors, unsupported Jinja
              statements, or incomplete braces. The goal is to learn what the
              error means.
            </p>

            <CodeExample>{`{6.EX.'Alice'}AND{7.GTE.'18'`}</CodeExample>

            <Benefit>
              When someone gives you an old query, a Pipeline filter, or code
              from another app, the Tester can help you understand it before you
              change it.
            </Benefit>
          </Section>

          <Section
            id="workbench-analysis"
            title="6. Workbench Analysis"
            lead="Workbench Analysis is the explanation layer. It turns the query into readable pieces and points out anything that deserves attention."
          >
            <Subheading>What you will see</Subheading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard title="Language Detection">
                Quickbase Query, Pipelines Jinja, or a hybrid of both.
              </InfoCard>
              <InfoCard title="Parsed Conditions">
                FID, field name, operator, value, and value type.
              </InfoCard>
              <InfoCard title="Query Structure">
                AND, OR, grouping, and plain-language logic.
              </InfoCard>
              <InfoCard title="Diagnostics">
                Warnings and errors when something looks wrong.
              </InfoCard>
            </div>

            <Subheading>Do not fear red warnings</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              A red message is not the Workbench yelling at you. It is telling
              you exactly which part needs attention. Read the message, look at
              the condition it points to, and fix one thing at a time.
            </p>

            <Callout tone="red">
              Example: <strong>UNTERMINATED_QUERY_CONDITION</strong> usually
              means a brace or quote is missing. The fix is often much smaller
              than the error message looks.
            </Callout>

            <Subheading>Copy Reports</Subheading>
            <p className="mt-2 leading-7 text-slate-600">
              The Workbench can copy a plain-text report, diagnostic JSON, or
              the analyzed input. This is useful when asking another developer
              for help because you can share exactly what the tool saw.
            </p>

            <Benefit>
              Instead of guessing why a query is wrong, you get a repeatable
              explanation that you can compare before and after a fix.
            </Benefit>
          </Section>

          <Section
            title="A Simple Learning Path"
            lead="If you are new to the JSON API, use the Workbench in this order:"
          >
            <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7 text-slate-600">
              <li>
                Choose a table in <strong>Application Context</strong>.
              </li>
              <li>
                Build one simple condition in{" "}
                <strong>Visual Query Builder</strong>.
              </li>
              <li>
                Run it in <strong>Live Query Results</strong>.
              </li>
              <li>Add one more condition and compare the QBL.</li>
              <li>Try a lookup or reference field from a relationship.</li>
              <li>
                Use <strong>Relationship Explorer</strong> when you are unsure
                how tables connect.
              </li>
              <li>
                Paste working and broken examples into{" "}
                <strong>Query &amp; Jinja Tester</strong>.
              </li>
              <li>
                Read <strong>Workbench Analysis</strong> until the syntax starts
                looking familiar.
              </li>
            </ol>

            <Callout tone="green">
              You do not need to become a JSON expert before using the API. Use
              the tool until the request and response patterns become familiar.
              The scary monster gets much smaller once you realize it mostly
              speaks in tables, fields, values, and rules.
            </Callout>
          </Section>

          <footer className="rounded-2xl bg-[#e9f1f7] px-5 py-5 text-center text-sm font-semibold text-slate-600">
            Quickbase REST-API Utilities — Query &amp; Jinja Workbench Student
            Guide
          </footer>
        </div>
      </div>
    </main>
  );
}
