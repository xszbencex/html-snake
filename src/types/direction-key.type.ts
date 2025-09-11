export const DirectionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'] as const;

export type DirectionKey = (typeof DirectionKeys)[number];
