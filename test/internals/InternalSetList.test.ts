import { describe, beforeEach, test, expect } from 'vitest';
import { InternalSetList } from '../../src/core/internals/InternalSetList';

describe('invalidation test', () => {
  let outputBefore: readonly number[];
  let list: InternalSetList<number>;

  beforeEach(() => {
    const source = new Set([1, 6, 7]);
    list = new InternalSetList<number>(source);
    outputBefore = list.output;
  });

  describe('encapsulated mutation', () => {
    describe('add', () => {
      beforeEach(() => {
        list.add(8);
      });

      test('source should consist the new element', () => {
        expect(list.source).toContain(8);
      });

      test('output should consist the new element', () => {
        expect(list.output).toContain(8);
      });

      test('output should return a different instance of array', () => {
        expect(list.output).not.toBe(outputBefore);
      });
    });

    describe('add existing element', () => {
      let sameOutput: readonly number[];
      beforeEach(() => {
        sameOutput = list.output;
        list.add(6);
      });

      test('source size remains the same', () => {
        expect(list.source.size).toBe(3);
      });

      test('output instance should remain the same', () => {
        expect(list.output).toBe(sameOutput);
      });
    });

    describe('remove', () => {
      beforeEach(() => {
        list.remove(6);
      });

      test('source should consist the new element', () => {
        expect(list.source).not.toContain(6);
      });

      test('output should consist the new element', () => {
        expect(list.output).not.toContain(8);
      });

      test('output should return a different instance of array', () => {
        expect(list.output).not.toBe(outputBefore);
      });
    });

    describe('remove non-existing element', () => {
      let sameOutput: readonly number[];
      beforeEach(() => {
        sameOutput = list.output;
        list.remove(100);
      });

      test('source should remain unchanged', () => {
        expect(list.source.size).toBe(3);
      });

      test('output instance should remain the same', () => {
        expect(list.output).toBe(sameOutput);
      });
    });
  });

  describe('direct source mutation - invalidate should generate a new list after changes', () => {
    beforeEach(() => {
      list.source.add(8);
      list.invalidate();
    });

    test('source should consist the new element', () => {
      expect(list.source).toContain(8);
    });

    test('output should consist the new element', () => {
      expect(list.output).toContain(8);
    });

    test('output should return a different instance of array', () => {
      expect(list.output).not.toBe(outputBefore);
    });
  });

  describe('direct source mutation - forgetting to invalidate', () => {
    beforeEach(() => {
      list.source.add(8);
      // list.invalidate();
    });

    test('source should consist the new element', () => {
      expect(list.source).toContain(8);
    });

    test('output should not the new element', () => {
      expect(list.output).not.toContain(8);
    });

    test('output should return the same as before', () => {
      expect(list.output).toBe(outputBefore);
    });
  });
});
