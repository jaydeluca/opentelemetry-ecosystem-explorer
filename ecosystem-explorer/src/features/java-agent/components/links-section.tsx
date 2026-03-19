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
import { ExternalLink } from "lucide-react";
import type { InstrumentationData } from "@/types/javaagent";

interface LinksSectionProps {
  instrumentation: InstrumentationData;
}

const GITHUB_BASE_URL =
  "https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation";

export function LinksSection({ instrumentation }: LinksSectionProps) {
  const hasLinks = instrumentation.source_path || instrumentation.library_link;

  if (!hasLinks) {
    return null;
  }

  return (
    <section className="py-4">
      <h3 className="text-lg font-semibold mb-3">Links</h3>
      <div className="flex flex-wrap gap-4">
        {instrumentation.source_path && (
          <a
            href={`${GITHUB_BASE_URL}/${instrumentation.source_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
            aria-label="View source code on GitHub (opens in new tab)"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Source Code
          </a>
        )}
        {instrumentation.library_link && (
          <a
            href={instrumentation.library_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
            aria-label="View library documentation (opens in new tab)"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Library
          </a>
        )}
      </div>
    </section>
  );
}
