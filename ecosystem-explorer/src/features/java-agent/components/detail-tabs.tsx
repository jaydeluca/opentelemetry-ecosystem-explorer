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
import * as Tabs from "@radix-ui/react-tabs";
import type { InstrumentationData } from "@/types/javaagent";
import { LinksSection } from "./links-section";
import { SemanticConventionsSection } from "./semantic-conventions-section";
import { TargetVersionsSection } from "./target-versions-section";
import { ConfigurationsSection } from "./configurations-section";
import { TelemetrySection } from "./telemetry-section";
import { StandaloneLibraryTab } from "./standalone-library-tab";
import { InfoIcon } from "@/components/icons/info-icon";
import { PackageIcon } from "@/components/icons/package-icon";

interface DetailTabsProps {
  instrumentation: InstrumentationData;
  version: string;
}

export function DetailTabs({ instrumentation, version }: DetailTabsProps) {
  return (
    <Tabs.Root defaultValue="details" className="w-full">
      <div className="bg-surface/50 rounded-t-lg border border-b-0 border-border p-1 backdrop-blur-sm">
        <Tabs.List className="flex gap-1" aria-label="Instrumentation details">
          <Tabs.Trigger
            value="details"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all data-[state=active]:shadow-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-surface/50"
          >
            <InfoIcon className="h-4 w-4" />
            Details
          </Tabs.Trigger>
          {instrumentation.has_standalone_library && (
            <Tabs.Trigger
              value="library"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all data-[state=active]:shadow-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-surface/50"
            >
              <PackageIcon className="h-4 w-4" />
              Standalone Library
            </Tabs.Trigger>
          )}
        </Tabs.List>
      </div>

      <div className="bg-surface/30 border border-border rounded-b-lg p-6">
        <Tabs.Content value="details">
          <div className="space-y-8">
            <LinksSection instrumentation={instrumentation} />
            <SemanticConventionsSection instrumentation={instrumentation} />
            <TargetVersionsSection instrumentation={instrumentation} />
            <ConfigurationsSection instrumentation={instrumentation} />
            <TelemetrySection instrumentation={instrumentation} />
          </div>
        </Tabs.Content>

        {instrumentation.has_standalone_library && (
          <Tabs.Content value="library">
            <StandaloneLibraryTab instrumentation={instrumentation} version={version} />
          </Tabs.Content>
        )}
      </div>
    </Tabs.Root>
  );
}
