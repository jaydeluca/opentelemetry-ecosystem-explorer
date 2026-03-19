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

interface TargetVersionsSectionProps {
  instrumentation: InstrumentationData;
}

export function TargetVersionsSection({ instrumentation }: TargetVersionsSectionProps) {
  const hasVersionInfo =
    (instrumentation.javaagent_target_versions &&
      instrumentation.javaagent_target_versions.length > 0) ||
    instrumentation.minimum_java_version;

  if (!hasVersionInfo) {
    return null;
  }

  return (
    <section className="py-4">
      <h3 className="text-lg font-semibold mb-3">Target Versions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instrumentation.javaagent_target_versions &&
          instrumentation.javaagent_target_versions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Javaagent Target Versions
              </h4>
              <ul className="space-y-1">
                {instrumentation.javaagent_target_versions.map((version, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                    <span className="mr-2 text-primary">•</span>
                    <span className="font-mono text-foreground">{version}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {instrumentation.minimum_java_version && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Minimum Java Version</h4>
            <p className="text-sm">
              <span className="font-mono text-foreground">
                Java {instrumentation.minimum_java_version}+
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
