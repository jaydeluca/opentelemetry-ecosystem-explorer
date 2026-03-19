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
import type { BadgeInfo } from "../utils/badge-info";
import { TargetBadges, TelemetryBadges } from "./instrumentation-badges";

interface QuickInfoCardProps {
  instrumentation: InstrumentationData;
  badges: BadgeInfo;
}

export function QuickInfoCard({ instrumentation, badges }: QuickInfoCardProps) {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-6 md:p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instrumentation.minimum_java_version && (
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-2">Java Version</dt>
            <dd>
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20"
                aria-label={`Requires Java ${instrumentation.minimum_java_version} or later`}
              >
                Java {instrumentation.minimum_java_version}+
              </span>
            </dd>
          </div>
        )}

        {instrumentation.features && instrumentation.features.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-muted-foreground mb-2">Features</dt>
            <dd className="flex flex-wrap gap-2">
              {instrumentation.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/50 border border-border text-muted-foreground"
                  aria-label={`Feature: ${feature}`}
                >
                  {feature}
                </span>
              ))}
            </dd>
          </div>
        )}

        <div>
          <dt className="text-sm font-medium text-muted-foreground mb-2">Target Types</dt>
          <dd className="flex flex-wrap gap-2">
            <TargetBadges badges={badges} size="default" />
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-muted-foreground mb-2">Telemetry Types</dt>
          <dd className="flex flex-wrap gap-2">
            <TelemetryBadges badges={badges} size="default" />
          </dd>
        </div>
      </div>
    </div>
  );
}
