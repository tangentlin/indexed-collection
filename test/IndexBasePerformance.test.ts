import { describe, it, expect } from 'vitest';
import { getByMakeIndex } from './shared/indexes';
import { newTeslaModel3 } from './shared/data';

// Tests for internal map growth during read/unIndex operations

describe('IndexBase performance behaviors', () => {
  it('getValue on empty index should not create new maps', () => {
    const index = getByMakeIndex();
    index.getValue('Tesla');
    expect(index.internalMap.size).toBe(0);
  });

  it('unIndex on empty index should not create new maps', () => {
    const index = getByMakeIndex();
    index.unIndex(newTeslaModel3);
    expect(index.internalMap.size).toBe(0);
  });
});
