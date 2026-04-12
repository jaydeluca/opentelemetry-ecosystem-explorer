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

import { Info } from "lucide-react";
import type { VersionInfo } from "@/types/javaagent";

interface VersionSelectorPanelProps {
  versions: VersionInfo[];
  baseVersion: string;
  comparisonVersion: string;
  onBaseVersionChange: (version: string) => void;
  onComparisonVersionChange: (version: string) => void;
}

export function VersionSelectorPanel({
  versions,
  baseVersion,
  comparisonVersion,
  onBaseVersionChange,
  onComparisonVersionChange,
}: VersionSelectorPanelProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-6 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 shadow-sm">
        {/* Info banner */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 border border-secondary/20 w-fit">
          <Info className="h-4 w-4 text-secondary" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground/90">
            Compare default telemetry between two versions
          </span>
        </div>

        {/* Version selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base version selector */}
          <div className="space-y-3">
            <label
              htmlFor="base-version-select"
              className="block rounded-md bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 w-fit"
            >
              Base Version
            </label>
            <select
              id="base-version-select"
              value={baseVersion}
              onChange={(e) => onBaseVersionChange(e.target.value)}
              className="w-full cursor-pointer rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              {versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} {v.is_latest ? "(latest)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison version selector */}
          <div className="space-y-3">
            <label
              htmlFor="comparison-version-select"
              className="block rounded-md bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 w-fit"
            >
              Comparison Version
            </label>
            <select
              id="comparison-version-select"
              value={comparisonVersion}
              onChange={(e) => onComparisonVersionChange(e.target.value)}
              className="w-full cursor-pointer rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              {versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} {v.is_latest ? "(latest)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
