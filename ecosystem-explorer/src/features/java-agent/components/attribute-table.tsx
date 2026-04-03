/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Attribute } from "@/types/javaagent";

interface AttributeTableProps {
  attributes: Attribute[];
}

export function AttributeTable({ attributes }: AttributeTableProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div
      role="table"
      aria-label="Attributes"
      className="overflow-hidden rounded-lg border border-border/30"
    >
      {/* Table Header */}
      <div role="row" className="grid grid-cols-12 gap-4 bg-white/5 p-3">
        <div
          role="columnheader"
          className="col-span-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Key
        </div>
        <div
          role="columnheader"
          className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Type
        </div>
      </div>

      {/* Table Rows */}
      {attributes.map((attr, index) => (
        <div
          key={index}
          role="row"
          className={`attribute-row grid grid-cols-12 p-4 items-center ${
            index % 2 === 1 ? "bg-white/[0.02]" : ""
          }`}
        >
          <div role="cell" className="col-span-8 font-mono text-sm md:text-[12px]">
            {attr.name}
          </div>
          <div role="cell" className="col-span-4">
            <span className="col-span-4 inline-block w-fit rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground bg-slate-800">
              {attr.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
