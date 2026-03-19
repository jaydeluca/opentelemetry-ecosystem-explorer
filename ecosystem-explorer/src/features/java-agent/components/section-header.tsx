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
import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ icon, title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      {action}
    </div>
  );
}
