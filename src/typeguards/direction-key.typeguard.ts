import { DirectionKey, DirectionKeys } from '../types/direction-key.type';

export const isDirectionKey = (key: string): key is DirectionKey => {
  return (DirectionKeys as readonly string[]).includes(key);
};
