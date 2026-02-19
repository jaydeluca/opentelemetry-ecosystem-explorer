import type { InstrumentationData } from "@/types/javaagent";

export function getInstrumentationDisplayName(instrumentation: InstrumentationData): string {
  if (instrumentation.display_name) {
    return instrumentation.display_name;
  }

  let name = instrumentation.name;

  name = name.replace(/-\d+\.\d+.*$/, "");

  name = name.replace(/-/g, " ");

  name = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return name;
}
