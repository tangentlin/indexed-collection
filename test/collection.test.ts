import {
  allCars,
  AttributeTag,
  CarCollection,
  newChevyCamero,
  newChevyEquinox,
  newTeslaModel3,
  newTeslaModelX,
  PriceRangeName,
  usedChevyCamero,
  usedChevyEquinox,
  usedTeslaModel3,
  usedTeslaModelX,
} from './testData';

describe('mutable collection tests', () => {
  let cars: CarCollection;

  beforeEach(() => {
    cars = new CarCollection();
    cars.addRange(allCars);
  });

  // Tests against index which is only based on one value
  describe('OneLevelIndex', () => {
    it('byMake(Tesla) should return all Tesla cars', () => {
      expect(new Set(cars.byMake('Tesla'))).toEqual(
        new Set([
          newTeslaModel3,
          usedTeslaModel3,
          newTeslaModelX,
          usedTeslaModelX,
        ])
      );
    });

    it('byIsNew(true) should return all new cars', () => {
      expect(new Set(cars.byIsNew(true))).toEqual(
        new Set([
          newTeslaModel3,
          newTeslaModelX,
          newChevyCamero,
          newChevyEquinox,
        ])
      );
    });

    it('byPriceRange(10k) should return all cars in the price range', () => {
      expect(new Set(cars.byPriceRange(PriceRangeName['10k']))).toEqual(
        new Set([usedChevyCamero, usedChevyEquinox])
      );
    });

    it('byTags(Electric) should return all electric cars', () => {
      expect(new Set(cars.byTag(AttributeTag.Electric))).toEqual(
        new Set([
          newTeslaModel3,
          usedTeslaModel3,
          newTeslaModelX,
          usedTeslaModelX,
        ])
      );
    });

    it('byTags(Manual) should return all manual cars', () => {
      expect(new Set(cars.byTag(AttributeTag.Manual))).toEqual(
        new Set([usedChevyCamero])
      );
    });
  });

  // Tests against index which is based on two values
  describe('TwoLevelIndex', () => {
    it('byTagByPriceRange(Electric, under10K) should return no cars', () => {
      expect(
        new Set(
          cars.byTagByPriceRange(AttributeTag.Electric, PriceRangeName.under10k)
        )
      ).toEqual(new Set([]));
    });

    it('byTagByPriceRange(Electric, 20K) should return used model 3', () => {
      expect(
        new Set(
          cars.byTagByPriceRange(AttributeTag.Electric, PriceRangeName['20k'])
        )
      ).toEqual(new Set([usedTeslaModel3]));
    });
  });

  describe('When an item is removed from the collection', () => {
    beforeEach(() => {
      cars.remove(usedTeslaModel3);
    });

    it('byTagByPriceRange(Electric, 20K) should return no cars', () => {
      expect(
        new Set(
          cars.byTagByPriceRange(AttributeTag.Electric, PriceRangeName['20k'])
        )
      ).toEqual(new Set([]));
    });

    it('byMake(Tesla) should return the remaining Tesla-branded cars', () => {
      expect(
        new Set(
          cars.byMake('Tesla')
        )
      ).toEqual(new Set([
        newTeslaModelX,
        usedTeslaModelX,
        newTeslaModel3,
      ]));
    });
  });
});
