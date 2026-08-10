"use client";

import { useMemo, useState } from "react";

type FieldType = "text" | "number";

type QueryField = {
  id: number;
  name: string;
  type: FieldType;
  example: string;
};

type Operator = {
  code: string;
  name: string;
  shortDescription: string;
  bestFor: string;
};

const fields: QueryField[] = [
  {
    id: 8,
    name: "Favorite Color",
    type: "text",
    example: "Blue",
  },
  {
    id: 7,
    name: "Age",
    type: "number",
    example: "30",
  },
];

const operators: Operator[] = [
  {
    code: "EX",
    name: "Exact Match",
    shortDescription:
      "Compare the Quickbase field against the supplied value for an exact match.",
    bestFor: "Text or numeric equality",
  },
  {
    code: "XEX",
    name: "Not Exact Match",
    shortDescription:
      "Compare the field against a value while excluding exact matches.",
    bestFor: "Excluding one specific value",
  },
  {
    code: "CT",
    name: "Contains",
    shortDescription: "Test whether the field contains the supplied text.",
    bestFor: "Text searches",
  },
  {
    code: "GT",
    name: "Greater Than",
    shortDescription:
      "Return records whose field value is greater than the comparison value.",
    bestFor: "Numeric and ordered values",
  },
  {
    code: "GTE",
    name: "Greater Than or Equal",
    shortDescription:
      "Return records whose field value is greater than or equal to the comparison value.",
    bestFor: "Numeric and ordered values",
  },
  {
    code: "LT",
    name: "Less Than",
    shortDescription:
      "Return records whose field value is less than the comparison value.",
    bestFor: "Numeric and ordered values",
  },
  {
    code: "LTE",
    name: "Less Than or Equal",
    shortDescription:
      "Return records whose field value is less than or equal to the comparison value.",
    bestFor: "Numeric and ordered values",
  },
];

function getSuggestedOperator(fieldType: FieldType) {
  return fieldType === "number" ? "GT" : "EX";
}

export default function QueryOperatorLab() {
  const [fieldId, setFieldId] = useState(8);
  const [operatorCode, setOperatorCode] = useState("EX");
  const [comparisonValue, setComparisonValue] = useState("Blue");

  const selectedField =
    fields.find((field) => field.id === fieldId) ?? fields[0];

  const selectedOperator =
    operators.find((operator) => operator.code === operatorCode) ??
    operators[0];

  const formattedValue = useMemo(() => {
    const cleanValue = comparisonValue.trim();

    if (!cleanValue) {
      return selectedField.type === "text" ? "'value'" : "value";
    }

    return selectedField.type === "text" ? `'${cleanValue}'` : cleanValue;
  }, [comparisonValue, selectedField.type]);

  const queryCondition = `{${selectedField.id}.${selectedOperator.code}.${formattedValue}}`;

  function changeField(newFieldId: number) {
    const newField =
      fields.find((field) => field.id === newFieldId) ?? fields[0];

    setFieldId(newField.id);
    setComparisonValue(newField.example);
    setOperatorCode(getSuggestedOperator(newField.type));
  }

  function loadExample(
    nextFieldId: number,
    nextOperator: string,
    nextValue: string,
  ) {
    setFieldId(nextFieldId);
    setOperatorCode(nextOperator);
    setComparisonValue(nextValue);
  }

  return (
    <section className="mb-12 overflow-hidden rounded-xl border-2 border-[#1f5c99] bg-white shadow-sm">
      {/* ====================================================
          LAB HEADER
      ==================================================== */}

      <div className="bg-[#1f5c99] px-6 py-5 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.16em]">
          Interactive Query Language Lab
        </p>

        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
          Build a Quickbase Query Condition
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-white">
          Change the field, operator, and comparison value. React will assemble
          the same Quickbase query syntax used by the working Code Page.
        </p>
      </div>

      <div className="p-5 sm:p-6 lg:p-8">
        {/* ==================================================
            INPUTS
        ================================================== */}

        <div className="grid gap-5 lg:grid-cols-3">
          <div>
            <label htmlFor="field" className="mb-2 block font-bold">
              1. Quickbase Field
            </label>

            <select
              id="field"
              value={fieldId}
              onChange={(event) => changeField(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} — Field ID {field.id}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm">
              Type: <strong>{selectedField.type}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="operator" className="mb-2 block font-bold">
              2. Query Operator
            </label>

            <select
              id="operator"
              value={operatorCode}
              onChange={(event) => setOperatorCode(event.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
            >
              {operators.map((operator) => (
                <option key={operator.code} value={operator.code}>
                  {operator.code} — {operator.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm">{selectedOperator.name}</p>
          </div>

          <div>
            <label htmlFor="comparison" className="mb-2 block font-bold">
              3. Comparison Value
            </label>

            <input
              id="comparison"
              type={selectedField.type === "number" ? "number" : "text"}
              value={comparisonValue}
              onChange={(event) => setComparisonValue(event.target.value)}
              placeholder={`Example: ${selectedField.example}`}
              className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
            />

            <p className="mt-2 text-sm">
              {selectedField.type === "text"
                ? "Text is represented as a quoted value."
                : "Numeric values remain unquoted."}
            </p>
          </div>
        </div>

        {/* ==================================================
            GENERATED CONDITION
        ================================================== */}

        <div className="mt-8 rounded-xl bg-[#111827] p-5 text-white sm:p-6">
          <p className="text-sm font-bold uppercase tracking-widest">
            Generated Quickbase Condition
          </p>

          <code className="mt-4 block overflow-x-auto text-xl font-bold sm:text-2xl">
            {queryCondition}
          </code>
        </div>

        {/* ==================================================
            GRAMMAR BREAKDOWN
        ================================================== */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Field
            </p>

            <p className="mt-2 text-3xl font-bold">{selectedField.id}</p>

            <p className="mt-2">
              Quickbase Field ID for <strong>{selectedField.name}</strong>.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Operator
            </p>

            <p className="mt-2 text-3xl font-bold">{selectedOperator.code}</p>

            <p className="mt-2">
              <strong>{selectedOperator.name}</strong>
            </p>

            <p className="mt-2 text-sm">{selectedOperator.shortDescription}</p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Value
            </p>

            <p className="mt-2 break-all font-mono text-2xl font-bold">
              {formattedValue}
            </p>

            <p className="mt-2">Comparison value supplied to Quickbase.</p>
          </div>
        </div>

        {/* ==================================================
            CURRENT OPERATOR EXPLANATION
        ================================================== */}

        <div className="mt-6 rounded-lg border-l-4 border-[#1f5c99] bg-[#eaf3fb] p-5">
          <p className="font-bold">What does {selectedOperator.code} change?</p>

          <p className="mt-2">
            It changes <strong>how Quickbase compares</strong>{" "}
            {selectedField.name} against <code>{formattedValue}</code>.
          </p>

          <p className="mt-2">
            Best suited here for: <strong>{selectedOperator.bestFor}</strong>.
          </p>
        </div>

        {/* ==================================================
            GUIDED EXPERIMENT BUTTONS
        ================================================== */}

        <div className="mt-8">
          <h3 className="text-xl font-bold">Guided Experiments</h3>

          <p className="mt-2">
            Load one of the lesson examples and watch the grammar change.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => loadExample(8, "EX", "Blue")}
              className="rounded-lg border-2 border-[#1f5c99] px-4 py-4 text-left transition hover:bg-[#eaf3fb]"
            >
              <span className="block font-bold">Experiment 1</span>

              <span className="mt-1 block">Exact Favorite Color</span>

              <code className="mt-2 block text-sm">{"{8.EX.'Blue'}"}</code>
            </button>

            <button
              type="button"
              onClick={() => loadExample(8, "CT", "lu")}
              className="rounded-lg border-2 border-[#1f5c99] px-4 py-4 text-left transition hover:bg-[#eaf3fb]"
            >
              <span className="block font-bold">Experiment 2</span>

              <span className="mt-1 block">Text Contains</span>

              <code className="mt-2 block text-sm">{"{8.CT.'lu'}"}</code>
            </button>

            <button
              type="button"
              onClick={() => loadExample(7, "GT", "30")}
              className="rounded-lg border-2 border-[#1f5c99] px-4 py-4 text-left transition hover:bg-[#eaf3fb]"
            >
              <span className="block font-bold">Experiment 3</span>

              <span className="mt-1 block">Age Greater Than 30</span>

              <code className="mt-2 block text-sm">{"{7.GT.30}"}</code>
            </button>
          </div>
        </div>

        {/* ==================================================
            IMPORTANT BOUNDARY
        ================================================== */}

        <div className="mt-8 rounded-lg border-2 border-amber-600 bg-amber-50 p-5">
          <p className="font-bold">Teaching simulator only</p>

          <p className="mt-2">
            This React component does not contact Quickbase. It demonstrates how
            the query condition is assembled. The working{" "}
            <code>PeoplePage_operators.html</code> Code Page performs the actual
            REST request inside Quickbase.
          </p>
        </div>
      </div>
    </section>
  );
}
