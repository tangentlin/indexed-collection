import { describe, beforeEach, it, expect, test } from 'vitest';
import { IndexedCollectionBase, PrimaryKeyCollection } from '../src';
import { ICar, newTeslaModelX } from './shared/data';

class SimpleCarCollection extends IndexedCollectionBase<ICar> {
  constructor(initialValues?: readonly ICar[]) {
    super(initialValues);
  }
}

class PrimaryKeyCarCollection extends PrimaryKeyCollection<ICar> {
  constructor(initialValues?: readonly ICar[]) {
    super((car) => car.id, initialValues);
  }
}

describe('Prevent duplicate addition', () => {
  let simpleCollection: SimpleCarCollection;
  let primaryKeyCollection: PrimaryKeyCarCollection;
  let clonedCar: ICar;

  beforeEach(() => {
    simpleCollection = new SimpleCarCollection();

    clonedCar = Object.assign({}, newTeslaModelX);

    simpleCollection.add(newTeslaModelX);
    simpleCollection.addRange(
      // clonedCar can be added to the simpleCollection because it is a different object instance
      new SimpleCarCollection([newTeslaModelX, clonedCar])
    );

    primaryKeyCollection = new PrimaryKeyCarCollection([
      newTeslaModelX,
      clonedCar,
    ]);
  });

  it('simpleCollection should have two cars', () => {
    expect(simpleCollection.count).toEqual(2);
  });

  it('primaryKey should have one cars', () => {
    expect(primaryKeyCollection.count).toEqual(1);
  });

  it('correct primary key should return one record', () => {
    expect(primaryKeyCollection.byPrimaryKey(newTeslaModelX.id)).toEqual(
      newTeslaModelX
    );
  });

  it('non-existent primary key should return undefined', () => {
    expect(primaryKeyCollection.byPrimaryKey('i do not exist')).toBeUndefined();
  });

  describe('When update an existing record', () => {
    beforeEach(() => {
      clonedCar.price = newTeslaModelX.price + 1000;
      primaryKeyCollection.update(clonedCar);
    });

    test('Price should be updated', () => {
      expect(
        primaryKeyCollection.byPrimaryKey(newTeslaModelX.id)?.price
      ).toEqual(clonedCar.price);
    });
  });

  describe('When update a non-existing record', () => {
    const nonExistingCar: ICar = {
      id: 'non-existing',
      make: 'non-existing',
      model: 'non-existing',
      isNew: false,
      price: 0,
      tags: [],
    };

    test('PrimaryCollection update return false', () => {
      expect(primaryKeyCollection.update(nonExistingCar)).toBe(false);
    });

    test('SimpleCollection update return false', () => {
      const nonExistingCarUpdate = Object.assign({}, nonExistingCar);
      nonExistingCarUpdate.price = nonExistingCar.price + 1000;
      expect(
        simpleCollection.update(nonExistingCarUpdate, nonExistingCar)
      ).toBe(false);
    });
  });

  describe('When remove an existing record', () => {
    beforeEach(() => {
      primaryKeyCollection.remove(newTeslaModelX);
    });

    test('PrimaryCollection should have no cars', () => {
      expect(primaryKeyCollection.count).toEqual(0);
    });
  });

  describe('When remove a non-existing record', () => {
    const nonExistingCar: ICar = {
      id: 'non-existing',
      make: 'non-existing',
      model: 'non-existing',
      isNew: false,
      price: 0,
      tags: [],
    };

    test('PrimaryCollection remove return false', () => {
      expect(primaryKeyCollection.remove(nonExistingCar)).toBe(false);
    });

    test('SimpleCollection remove return false', () => {
      expect(simpleCollection.remove(nonExistingCar)).toBe(false);
    });
  });
});
