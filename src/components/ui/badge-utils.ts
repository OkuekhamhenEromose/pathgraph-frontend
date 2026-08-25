export type BadgeVariant = "neutral" | "teal" | "coral" | "ic" | "mgmt";

/** A track name like "Individual Contributor" / "Engineering Management" maps to a line color. */
export function trackVariant(trackName?: string | null): BadgeVariant {
  if (!trackName) return "neutral";

  return /manage|management|leadership/i.test(trackName)
    ? "mgmt"
    : "ic";
}
