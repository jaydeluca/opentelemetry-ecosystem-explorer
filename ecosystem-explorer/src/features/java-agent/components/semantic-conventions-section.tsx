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
import { TagIcon } from "@/components/icons/tag-icon";

interface SemanticConventionsSectionProps {
  instrumentation: InstrumentationData;
}

export function SemanticConventionsSection({ instrumentation }: SemanticConventionsSectionProps) {
  if (!instrumentation.semantic_conventions || instrumentation.semantic_conventions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <SectionHeader icon={<TagIcon className="h-5 w-5" />} title="Semantic Conventions" />
      <div className="flex flex-wrap gap-3">
        {instrumentation.semantic_conventions.map((convention) => (
          <span
            key={convention}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 text-primary shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
            aria-label={`Semantic convention: ${convention}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {convention}
          </span>
        ))}
      </div>
    </section>
  );
}
