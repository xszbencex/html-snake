import { DirectionKey, DirectionKeys, Player1Key, Player1Keys, Player2Key, Player2Keys } from '../types/direction-key.type';

export const isDirectionKey = (key: string): key is DirectionKey => {
  return (DirectionKeys as readonly string[]).includes(key);
};

export const isPlayer1Key = (key: string): key is Player1Key => {
  return (Player1Keys as readonly string[]).includes(key);
};

export const isPlayer2Key = (key: string): key is Player2Key => {
  return (Player2Keys as readonly string[]).includes(key);
};
