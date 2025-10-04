export const Player1Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const;
export const Player2Keys = ['w', 'a', 's', 'd'] as const;
export const DirectionKeys = [...Player1Keys, ...Player2Keys] as const;

export type Player1Key = (typeof Player1Keys)[number];
export type Player2Key = (typeof Player2Keys)[number];
export type DirectionKey = (typeof DirectionKeys)[number];
