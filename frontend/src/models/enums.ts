export const CATEGORY = {
  Drivers: 'Drivers',
  Teams: 'Teams',
  Track: 'Track',
} as const;

export type CATEGORY = typeof CATEGORY[keyof typeof CATEGORY];