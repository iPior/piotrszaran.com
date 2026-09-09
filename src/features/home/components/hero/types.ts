export interface ProfileField {
  key: string;
  value: string;
}

/**
 * A technology or topic that is actively being learned. Rendered as a marker,
 * name and one-line description so it reads as in-progress rather than as a
 * claim on the stack cells above it.
 */
export interface LearningTopic {
  name: string;
  description: string;
  /** Built-in glyph, used for topics that have no brand logo. */
  glyph?: 'algorithm';
}

export type SocialIcon = 'github' | 'linkedin' | 'x' | 'email' | 'website';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}
