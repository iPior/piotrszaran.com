export interface ProfileField {
  key: string;
  value: string;
}

export type SocialIcon = 'github' | 'linkedin' | 'x' | 'email' | 'website';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}
