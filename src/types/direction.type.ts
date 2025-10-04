export const DIRECTIONS = ['UP', 'DOWN', 'RIGHT', 'LEFT'] as const;

export type Direction = (typeof DIRECTIONS)[number];
