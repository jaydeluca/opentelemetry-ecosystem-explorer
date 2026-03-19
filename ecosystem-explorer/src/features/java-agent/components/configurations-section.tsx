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
import { SectionHeader } from "./section-header";
import { ConfigurationIcon } from "@/components/icons/configuration-icon";

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
    <section className="space-y-4">
      <SectionHeader icon={<ConfigurationIcon className="h-5 w-5" />} title="Configurations" />

      {/* Desktop table view (≥768px) */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-border shadow-md">
        <table className="w-full border-collapse">
          <caption className="sr-only">Configuration options</caption>
          <thead>
            <tr className="bg-surface border-b border-border">
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Default
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {instrumentation.configurations.map((config, index) => (
              <tr key={index} className="hover:bg-surface transition-colors">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded text-foreground">
                    {config.name}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{config.description}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {config.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-foreground">
                    {formatDefaultValue(config.default)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view (<768px) */}
      <div className="md:hidden space-y-3">
        {instrumentation.configurations.map((config, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-3 bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Name
                </dt>
                <dd>
                  <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded text-foreground">
                    {config.name}
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Description
                </dt>
                <dd className="text-sm text-muted-foreground">{config.description}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Type
                  </dt>
                  <dd>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {config.type}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Default
                  </dt>
                  <dd className="font-mono text-sm text-foreground">
                    {formatDefaultValue(config.default)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
