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
import { AvailabilityCard } from "./availability-card";
import { TelemetryCard } from "./telemetry-card";
import { InfoFeatureCard } from "./info-feature-card";
import { JavaIcon } from "@/components/icons/java-icon";
import { TagIcon } from "@/components/icons/tag-icon";

interface QuickInfoCardProps {
  instrumentation: InstrumentationData;
  badges: BadgeInfo;
}

export function QuickInfoCard({ instrumentation, badges }: QuickInfoCardProps) {
  return (
    <div className="-mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AvailabilityCard
        hasJavaAgentTarget={badges.hasJavaAgentTarget}
        hasLibraryTarget={badges.hasLibraryTarget}
      />

      <TelemetryCard instrumentation={instrumentation} />

      {instrumentation.minimum_java_version && (
        <InfoFeatureCard icon={<JavaIcon className="h-5 w-5 text-primary" />} label="Java Version">
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
            aria-label={`Requires Java ${instrumentation.minimum_java_version} or later`}
          >
            Java {instrumentation.minimum_java_version}+
          </span>
        </InfoFeatureCard>
      )}

      {instrumentation.features && instrumentation.features.length > 0 && (
        <InfoFeatureCard icon={<TagIcon className="h-5 w-5 text-primary" />} label="Features">
          <div className="flex flex-wrap gap-2">
            {instrumentation.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/50 border border-border text-muted-foreground"
                aria-label={`Feature: ${feature}`}
              >
                {feature}
              </span>
            ))}
          </div>
        </InfoFeatureCard>
      )}
    </div>
  );
}
