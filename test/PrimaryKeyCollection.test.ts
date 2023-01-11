import { IndexedCollectionBase, PrimaryKeyCollection } from '../src';
import { ICar, newTeslaModelX } from './testData';

class SimpleCarCollection extends IndexedCollectionBase<ICar> {
  constructor() {
    super(undefined);
  }
}

class PrimaryKeyCarCollection extends PrimaryKeyCollection<ICar> {
  constructor() {
    super(car => car.id);
  }
}

describe('Prevent duplicate addition', () => {
  let simpleCollection: SimpleCarCollection;
  let primaryKeyCollection: PrimaryKeyCarCollection;

  beforeEach(() => {
    simpleCollection = new SimpleCarCollection();
    primaryKeyCollection = new PrimaryKeyCarCollection();

    const clonedCar = Object.assign({}, newTeslaModelX);

    simpleCollection.add(newTeslaModelX);
    simpleCollection.add(newTeslaModelX);
    // clonedCar can be added to the simpleCollection because it is a different object instance
    simpleCollection.add(clonedCar);

    primaryKeyCollection.add(newTeslaModelX);
    primaryKeyCollection.add(newTeslaModelX);

    // clonedCar should not be added to pkCollection because it has the same primary key
    primaryKeyCollection.add(clonedCar);
  });

  it('simpleCollection should have two cars', () => {
    expect(simpleCollection.count).toEqual(2);
  });

  it('primaryKey should have one cars', () => {
    expect(primaryKeyCollection.count).toEqual(1);
  });
});
