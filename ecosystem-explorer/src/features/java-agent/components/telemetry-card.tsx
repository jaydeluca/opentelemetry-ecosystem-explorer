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
import { ActivityIcon } from "@/components/icons/activity-icon";
import { BarChartIcon } from "@/components/icons/bar-chart-icon";
import { NetworkIcon } from "@/components/icons/network-icon";

interface TelemetryCardProps {
  instrumentation: InstrumentationData;
}

export function TelemetryCard({ instrumentation }: TelemetryCardProps) {
  const metricsCount =
    instrumentation.telemetry?.reduce((count, t) => count + (t.metrics?.length || 0), 0) || 0;
  const spansCount =
    instrumentation.telemetry?.reduce((count, t) => count + (t.spans?.length || 0), 0) || 0;

  return (
    <div className="rounded-lg border border-border bg-surface shadow-md hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded bg-primary/10">
          <ActivityIcon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Telemetry
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <BarChartIcon className="h-4 w-4 text-green-400" />
            <span className="text-2xl font-bold text-green-400">{metricsCount}</span>
          </div>
          <span className="text-xs text-muted-foreground">Metrics</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <NetworkIcon className="h-4 w-4 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">{spansCount}</span>
          </div>
          <span className="text-xs text-muted-foreground">Spans</span>
        </div>
      </div>
    </div>
  );
}
