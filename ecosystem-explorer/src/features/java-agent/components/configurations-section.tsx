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
import type { InstrumentationData } from "@/types/javaagent";

interface ConfigurationsSectionProps {
  instrumentation: InstrumentationData;
}

function formatDefaultValue(value: string | boolean | number): string {
  if (typeof value === "boolean") {
    return value.toString();
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return value;
}

export function ConfigurationsSection({ instrumentation }: ConfigurationsSectionProps) {
  if (!instrumentation.configurations || instrumentation.configurations.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <h3 className="text-lg font-semibold mb-3">Configurations</h3>

      {/* Desktop table view (≥768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-border rounded-lg">
          <caption className="sr-only">Configuration options</caption>
          <thead>
            <tr className="bg-muted/50">
              <th
                scope="col"
                className="border border-border px-4 py-2 text-left text-sm font-semibold"
              >
                Name
              </th>
              <th
                scope="col"
                className="border border-border px-4 py-2 text-left text-sm font-semibold"
              >
                Description
              </th>
              <th
                scope="col"
                className="border border-border px-4 py-2 text-left text-sm font-semibold"
              >
                Type
              </th>
              <th
                scope="col"
                className="border border-border px-4 py-2 text-left text-sm font-semibold"
              >
                Default
              </th>
            </tr>
          </thead>
          <tbody>
            {instrumentation.configurations.map((config, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-colors">
                <td className="border border-border px-4 py-2 font-mono text-sm">{config.name}</td>
                <td className="border border-border px-4 py-2 text-sm">{config.description}</td>
                <td className="border border-border px-4 py-2 font-mono text-sm text-muted-foreground">
                  {config.type}
                </td>
                <td className="border border-border px-4 py-2 font-mono text-sm">
                  {formatDefaultValue(config.default)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view (<768px) */}
      <div className="md:hidden space-y-4">
        {instrumentation.configurations.map((config, index) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-2">
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Name</dt>
                <dd className="font-mono text-sm mt-1">{config.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm mt-1">{config.description}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Type</dt>
                  <dd className="font-mono text-sm text-muted-foreground mt-1">{config.type}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Default</dt>
                  <dd className="font-mono text-sm mt-1">{formatDefaultValue(config.default)}</dd>
                </div>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
