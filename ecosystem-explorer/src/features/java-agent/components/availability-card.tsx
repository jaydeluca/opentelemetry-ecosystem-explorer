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
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { PackageIcon } from "@/components/icons/package-icon";

interface AvailabilityCardProps {
  hasJavaAgentTarget: boolean;
  hasLibraryTarget: boolean;
}

export function AvailabilityCard({ hasJavaAgentTarget, hasLibraryTarget }: AvailabilityCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-md hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded bg-primary/10">
          <PackageIcon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Availability
        </h3>
      </div>
      <div className="space-y-2">
        {hasJavaAgentTarget && (
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-foreground">Bundled in Java Agent</span>
          </div>
        )}
        {hasLibraryTarget && (
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-foreground">Standalone Library</span>
          </div>
        )}
        {!hasJavaAgentTarget && !hasLibraryTarget && (
          <p className="text-sm text-muted-foreground">No availability information</p>
        )}
      </div>
    </div>
  );
}
