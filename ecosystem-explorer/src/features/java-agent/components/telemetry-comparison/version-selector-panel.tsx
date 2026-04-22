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
  fromVersion: string;
  toVersion: string;
  onFromVersionChange: (version: string) => void;
  onToVersionChange: (version: string) => void;
  whenCondition: string;
  onWhenConditionChange: (when: string) => void;
  availableConditions: string[];
}

export function VersionSelectorPanel({
  versions,
  fromVersion,
  toVersion,
  onFromVersionChange,
  onToVersionChange,
  whenCondition,
  onWhenConditionChange,
  availableConditions,
}: VersionSelectorPanelProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-6 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 shadow-sm">
        {/* Info banner */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 border border-secondary/20 w-fit">
          <Info className="h-4 w-4 text-secondary" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground/90">
            Compare telemetry between two releases
          </span>
        </div>

        {/* Version selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From version selector */}
          <div className="space-y-3">
            <label
              htmlFor="from-version-select"
              className="block rounded-md bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 w-fit"
            >
              From
            </label>
            <select
              id="from-version-select"
              value={fromVersion}
              onChange={(e) => onFromVersionChange(e.target.value)}
              className="w-full cursor-pointer rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              {versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} {v.is_latest ? "(latest)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* To version selector */}
          <div className="space-y-3">
            <label
              htmlFor="to-version-select"
              className="block rounded-md bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 w-fit"
            >
              To
            </label>
            <select
              id="to-version-select"
              value={toVersion}
              onChange={(e) => onToVersionChange(e.target.value)}
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

        {availableConditions.length > 1 && (
          <div className="space-y-3">
            <label
              htmlFor="when-condition-select"
              className="block rounded-md bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 w-fit"
            >
              Configuration
            </label>
            <select
              id="when-condition-select"
              value={whenCondition}
              onChange={(e) => onWhenConditionChange(e.target.value)}
              className="w-full cursor-pointer rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              {availableConditions.map((c) => (
                <option key={c} value={c}>
                  {c === "default" ? "Default" : c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
