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
import { LinkCard } from "./link-card";
import { LinkIcon } from "@/components/icons/link-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { BookOpenIcon } from "@/components/icons/book-open-icon";

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
    <section className="space-y-4">
      <SectionHeader icon={<LinkIcon className="h-5 w-5" />} title="Links" />
      <div className="grid gap-3">
        {instrumentation.source_path && (
          <LinkCard
            href={`${GITHUB_BASE_URL}/${instrumentation.source_path}`}
            icon={<GithubIcon className="h-5 w-5" />}
            label="Source Code"
            description="View the instrumentation source code on GitHub"
          />
        )}
        {instrumentation.library_link && (
          <LinkCard
            href={instrumentation.library_link}
            icon={<BookOpenIcon className="h-5 w-5" />}
            label="Library Documentation"
            description="Read the official library documentation"
          />
        )}
      </div>
    </section>
  );
}
