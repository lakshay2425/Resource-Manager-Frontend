export const PLAN_COMPARISON_ROWS = [
  { feature: 'Resources', free: 'Up to 200', pro: 'Unlimited', type: 'text' },
  { feature: 'Collections', free: 'Up to 20', pro: 'Unlimited', type: 'text' },
  { feature: 'Public collections', free: true, pro: true, type: 'bool' },
  { feature: 'Dynamic OG meta preview', free: true, pro: true, type: 'bool' },
  { feature: 'Document management', free: 'Up to 2', pro: 'Up to 10', type: 'text' },
  { feature: 'Collection analytics', free: false, pro: true, type: 'bool' },
  { feature: 'Priority support', free: false, pro: true, type: 'bool' },
];

export const FREE_PLAN_HIGHLIGHTS = [
  'Up to 20 collections',
  'Up to 200 resources',
  'No collection analytics',
  'No priority support',
];

export const PRO_PLAN_HIGHLIGHTS = [
  'Unlimited collections',
  'Unlimited resources',
  'Collection analytics',
  'Priority support',
];
