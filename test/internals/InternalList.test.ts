import { InternalList } from '../../src/core/internals/InternalList';

describe('invalidation test', () => {
  let outputBefore: readonly number[];
  let list: InternalList<number>;

  beforeEach(() => {
    const source = [1, 6, 7];
    list = new InternalList<number>(source);
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
  });

  describe('direct source mutation - invalidate should generate a new list after changes', () => {
    beforeEach(() => {
      list.source.push(8);
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
      list.source.push(8);
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
