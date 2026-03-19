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
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "@/components/ui/back-button";
import { useVersions, useInstrumentation } from "@/hooks/use-javaagent-data";
import { getInstrumentationDisplayName } from "./utils/format";
import { getBadgeInfo } from "./utils/badge-info";
import { QuickInfoCard } from "./components/quick-info-card";
import { DetailTabs } from "./components/detail-tabs";
import { JavaInstrumentationIcon } from "@/components/icons/java-instrumentation-icon";

export function InstrumentationDetailPage() {
  const { version, name } = useParams<{ version: string; name: string }>();
  const navigate = useNavigate();

  const { data: versionsData, loading: versionsLoading } = useVersions();

  const shouldFetchInstrumentation = version !== "latest";
  const {
    data: instrumentation,
    loading: instrumentationLoading,
    error,
  } = useInstrumentation(
    shouldFetchInstrumentation ? (name ?? "") : "",
    shouldFetchInstrumentation ? (version ?? "") : ""
  );

  const loading = versionsLoading || instrumentationLoading;

  useEffect(() => {
    if (version === "latest" && versionsData) {
      const latestVersion = versionsData.versions.find((v) => v.is_latest)?.version;
      if (latestVersion && name) {
        navigate(`/java-agent/instrumentation/${latestVersion}/${name}`, { replace: true });
      }
    }
  }, [version, name, versionsData, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="text-lg font-medium">Loading instrumentation...</div>
            <div className="text-sm text-muted-foreground">This may take a moment</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !instrumentation) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <BackButton />
        <div className="mt-6 p-6 border border-red-500/50 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
          <h3 className="font-semibold mb-2">Error loading instrumentation</h3>
          <p className="text-sm">{error?.message || "Instrumentation not found"}</p>
        </div>
      </div>
    );
  }

  const displayName = getInstrumentationDisplayName(instrumentation);
  const showRawName =
    instrumentation.display_name && instrumentation.display_name !== instrumentation.name;
  const badges = getBadgeInfo(instrumentation);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-card via-background to-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <BackButton />
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <JavaInstrumentationIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">{displayName}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Version
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/30 shadow-sm">
                  {version}
                </span>
              </div>
              {showRawName && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Name:</span>{" "}
                  <code className="px-2 py-1 bg-muted/30 rounded text-foreground font-mono text-xs">
                    {instrumentation.name}
                  </code>
                </div>
              )}
            </div>

            {instrumentation.description && (
              <p className="text-base text-muted-foreground max-w-4xl">
                {instrumentation.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <QuickInfoCard instrumentation={instrumentation} badges={badges} />

        <div className="mt-8">
          <DetailTabs instrumentation={instrumentation} version={version ?? ""} />
        </div>
      </div>
    </div>
  );
}
