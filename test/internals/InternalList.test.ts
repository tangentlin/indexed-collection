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

interface ITestItem {
  name: string;
  age: number;
}

describe('update tests', () => {
  const john = { name: 'John', age: 20 };
  const mike = { name: 'Mike', age: 21 };
  const vincent = { name: 'Vincent', age: 22 };
  const miketNew = { name: 'Mike', age: 22 };
  const peter = { name: 'Peter', age: 18 };
  const peterNew = { name: 'Peter', age: 19 };
  let list: InternalList<ITestItem>;
  beforeEach(() => {
    const source = [john, mike, vincent];
    list = new InternalList<ITestItem>(source);
  });

  test('Update Mike should replace Mike without changing position', () => {
    list.update(miketNew, mike);
    expect(list.output).toEqual([john, miketNew, vincent]);
  });

  test('Update Peter should not change the list', () => {
    list.update(peterNew, peter);
    expect(list.output).toEqual([john, mike, vincent]);
  });
});
