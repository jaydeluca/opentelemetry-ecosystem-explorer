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
import { PipelineIcon } from "@/components/icons/pipeline-icon";

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
    <section className="space-y-4">
      <SectionHeader icon={<PipelineIcon className="h-5 w-5" />} title="Target Versions" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instrumentation.javaagent_target_versions &&
          instrumentation.javaagent_target_versions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Javaagent Target Versions
              </h4>
              <ul className="space-y-2">
                {instrumentation.javaagent_target_versions.map((version, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-center gap-2 p-2 rounded bg-muted/20 border border-border"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-mono text-foreground">{version}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {instrumentation.minimum_java_version && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Minimum Java Version
            </h4>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="font-mono text-base text-blue-400 font-semibold">
                Java {instrumentation.minimum_java_version}+
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
