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
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import Markdown from "react-markdown";
import type { InstrumentationData } from "@/types/javaagent";

interface StandaloneLibraryTabProps {
  instrumentation: InstrumentationData;
  version: string;
}

export function StandaloneLibraryTab({ instrumentation, version }: StandaloneLibraryTabProps) {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      setError(null);

      try {
        const readmeUrl = `/data/javaagent/${version}/${instrumentation.name}/README.md`;
        const response = await fetch(readmeUrl);

        if (!response.ok) {
          throw new Error("Failed to load README");
        }

        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [instrumentation.name, version]);

  return (
    <div className="space-y-4">
      {instrumentation.library_link && (
        <div>
          <a
            href={instrumentation.library_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            aria-label="View library on Maven Central (opens in new tab)"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View on Maven Central
          </a>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-4">
          <p className="font-medium">Failed to load README</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {markdownContent && !loading && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown>{markdownContent}</Markdown>
        </div>
      )}
    </div>
  );
}
