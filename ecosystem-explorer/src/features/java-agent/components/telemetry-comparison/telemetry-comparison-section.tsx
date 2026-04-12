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

import { AlertCircle, Loader2 } from "lucide-react";
import type { VersionInfo } from "@/types/javaagent";
import { useTelemetryComparison } from "../../hooks/use-telemetry-comparison";
import { VersionSelectorPanel } from "./version-selector-panel";
import { DiffResultsSection } from "./diff-results-section";

interface TelemetryComparisonSectionProps {
  instrumentationName: string;
  versions: VersionInfo[];
  currentVersion: string;
}

export function TelemetryComparisonSection({
  instrumentationName,
  versions,
  currentVersion,
}: TelemetryComparisonSectionProps) {
  // Find a comparison version (previous version or latest if current is not latest)
  const currentIndex = versions.findIndex((v) => v.version === currentVersion);
  const defaultComparisonVersion =
    currentIndex < versions.length - 1
      ? versions[currentIndex + 1].version
      : versions[0]?.version || currentVersion;

  const {
    baseVersion,
    comparisonVersion,
    setBaseVersion,
    setComparisonVersion,
    diffResult,
    loading,
    error,
    baseNotFound,
    comparisonNotFound,
  } = useTelemetryComparison(instrumentationName, currentVersion, defaultComparisonVersion);

  return (
    <div className="space-y-8">
      {/* Version selector panel */}
      <VersionSelectorPanel
        versions={versions}
        baseVersion={baseVersion}
        comparisonVersion={comparisonVersion}
        onBaseVersionChange={setBaseVersion}
        onComparisonVersionChange={setComparisonVersion}
      />

      {/* Loading state */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading comparison data...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-6 max-w-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-red-400">Comparison Error</p>
                <p className="text-sm text-red-400/80">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for missing versions */}
      {!loading && !error && (baseNotFound || comparisonNotFound) && (
        <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-yellow-400">Version Availability Note</p>
              {baseNotFound && (
                <p className="text-sm text-yellow-400/80">
                  The instrumentation was not available in version {baseVersion}.
                  {comparisonNotFound
                    ? ""
                    : " All telemetry from the comparison version is shown as added."}
                </p>
              )}
              {comparisonNotFound && !baseNotFound && (
                <p className="text-sm text-yellow-400/80">
                  The instrumentation was not available in version {comparisonVersion}. All
                  telemetry from the base version is shown as removed.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Same version warning */}
      {!loading && !error && baseVersion === comparisonVersion && (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-yellow-400">Same Version Selected</p>
                <p className="text-sm text-yellow-400/80">
                  Please select different versions to compare telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && diffResult && baseVersion !== comparisonVersion && (
        <DiffResultsSection diffResult={diffResult} />
      )}
    </div>
  );
}
