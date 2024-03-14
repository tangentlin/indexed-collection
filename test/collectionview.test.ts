import {
  CarCollection,
  UsedCarCollectionView,
  UsedGasCarCollectionView,
} from './shared/collections';
import {
  allCars,
  usedChevyCamero,
  usedChevyEquinox,
  usedTeslaModel3,
  usedTeslaModelX,
} from './shared/data';

describe('collection view tests', () => {
  let cars: CarCollection;
  let usedCars: UsedCarCollectionView;
  let usedGasCars: UsedGasCarCollectionView;

  beforeEach(() => {
    cars = new CarCollection();
    cars.addRange(allCars);

    usedCars = new UsedCarCollectionView(cars);
    usedGasCars = new UsedGasCarCollectionView(usedCars);
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
      expect(new Set(usedCars.byMake('Chevy'))).toEqual(
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
  });
});
