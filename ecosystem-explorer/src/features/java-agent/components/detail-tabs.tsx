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

interface DetailTabsProps {
  instrumentation: InstrumentationData;
  version: string;
}

export function DetailTabs({ instrumentation, version }: DetailTabsProps) {
  return (
    <Tabs.Root defaultValue="details" className="w-full">
      <Tabs.List className="flex gap-6 border-b border-border" aria-label="Instrumentation details">
        <Tabs.Trigger
          value="details"
          className="px-1 py-3 text-sm font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
        >
          Details
        </Tabs.Trigger>
        {instrumentation.has_standalone_library && (
          <Tabs.Trigger
            value="library"
            className="px-1 py-3 text-sm font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
          >
            Standalone Library
          </Tabs.Trigger>
        )}
      </Tabs.List>

      <Tabs.Content value="details" className="pt-6">
        <div className="space-y-6">
          <LinksSection instrumentation={instrumentation} />
          <SemanticConventionsSection instrumentation={instrumentation} />
          <TargetVersionsSection instrumentation={instrumentation} />
          <ConfigurationsSection instrumentation={instrumentation} />
          <TelemetrySection instrumentation={instrumentation} />
        </div>
      </Tabs.Content>

      {instrumentation.has_standalone_library && (
        <Tabs.Content value="library" className="pt-6">
          <StandaloneLibraryTab instrumentation={instrumentation} version={version} />
        </Tabs.Content>
      )}
    </Tabs.Root>
  );
}
