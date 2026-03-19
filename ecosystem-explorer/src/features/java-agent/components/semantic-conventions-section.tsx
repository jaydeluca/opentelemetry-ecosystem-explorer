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

interface SemanticConventionsSectionProps {
  instrumentation: InstrumentationData;
}

export function SemanticConventionsSection({ instrumentation }: SemanticConventionsSectionProps) {
  if (!instrumentation.semantic_conventions || instrumentation.semantic_conventions.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <h3 className="text-lg font-semibold mb-3">Semantic Conventions</h3>
      <div className="flex flex-wrap gap-2">
        {instrumentation.semantic_conventions.map((convention) => (
          <span
            key={convention}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-primary/10 border border-primary/30 text-primary"
            aria-label={`Semantic convention: ${convention}`}
          >
            {convention}
          </span>
        ))}
      </div>
    </section>
  );
}
