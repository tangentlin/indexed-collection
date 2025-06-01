import { describe, beforeEach, it, expect } from 'vitest';
import { CollectionViewBase } from '../src';
import {
  CarCollection,
  UsedCarCollectionView,
  UsedGasCarCollectionView,
} from './shared/collections';
import {
  ICar,
  allCars,
  usedChevyCamero,
  usedChevyEquinox,
  usedTeslaModel3,
  usedTeslaModelX,
} from './shared/data';

/**
 * View with out any filter or sort set
 */
class DefaultView extends CollectionViewBase<ICar, CarCollection> {
  constructor(source: CarCollection) {
    super(source);
  }
}

describe('collection view tests', () => {
  let cars: CarCollection;
  let usedCars: UsedCarCollectionView;
  let usedGasCars: UsedGasCarCollectionView;
  let defaultView: DefaultView;

  beforeEach(() => {
    cars = new CarCollection();
    cars.addRange(allCars);

    defaultView = new DefaultView(cars);
    usedCars = new UsedCarCollectionView(cars);
    usedGasCars = new UsedGasCarCollectionView(usedCars);
  });

  describe('DefaultView', () => {
    it('defaultView has same number of items as collection', () => {
      expect(defaultView.count).toEqual(cars.count);
    });
  });

  // Tests against index which is only based on one value
  describe('OneLevelIndex', () => {
    it('usedCars.byMake(Tesla) should return all used Tesla cars', () => {
      expect(new Set(usedCars.byMake('Tesla'))).toEqual(
        new Set([usedTeslaModel3, usedTeslaModelX])
      );
    });

    it('usedGasCars.byMake(Tesla) should return no cars', () => {
      expect(new Set(usedGasCars.byMake('Tesla'))).toEqual(new Set([]));
    });

    it('usedGasCars.byMake(Chevy) should return all used Chevy', () => {
      expect(new Set(usedGasCars.byMake('Chevy'))).toEqual(
        new Set([usedChevyCamero, usedChevyEquinox])
      );
    });

    // Because there is no new car
    it('usedCars.byIsNew(true) should return no cars', () => {
      expect(new Set(usedCars.byIsNew(true))).toEqual(new Set([]));
    });

    it('usedCars.byIsNew(false) should return no cars', () => {
      expect(new Set(usedCars.byIsNew(false))).toEqual(
        new Set([
          usedChevyCamero,
          usedChevyEquinox,
          usedTeslaModel3,
          usedTeslaModelX,
        ])
      );
    });
  });

  describe('When an item is removed from the collection', () => {
    beforeEach(() => {
      cars.remove(usedTeslaModel3);
    });

    it('usedCars.byMake(Tesla) should return all used Teslas except the removed one', () => {
      expect(new Set(usedCars.byMake('Tesla'))).toEqual(
        new Set([usedTeslaModelX])
      );
    });

    it('exist should return false with the removed car', () => {
      expect(usedCars.exists(usedTeslaModel3)).toEqual(false);
    });

    it('exist should return true with cars not removed', () => {
      expect(usedCars.exists(usedTeslaModelX)).toEqual(true);
    });
  });
});
