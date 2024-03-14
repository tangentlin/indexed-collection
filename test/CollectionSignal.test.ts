import { CollectionAddSignal } from '../src/signals/CollectionAddSignal';
import { CollectionChangeSignal } from '../src/signals/CollectionChangeSignal';
import { CollectionRemoveSignal } from '../src/signals/CollectionRemoveSignal';
import { CollectionUpdateSignal } from '../src/signals/CollectionUpdateSignal';
import { CarCollection, UsedCarCollectionView } from './shared/collections';
import {
  ICar,
  newTeslaModel3,
  newTeslaModelX,
  usedChevyCamero,
} from './shared/data';

describe('Collection signal tests', () => {
  let changeSignal: jest.Mock<CollectionChangeSignal<ICar>>;
  let addSignal: jest.Mock<CollectionAddSignal<ICar>>;
  let removeSignal: jest.Mock<CollectionRemoveSignal<ICar>>;
  let updateSignal: jest.Mock<CollectionUpdateSignal<ICar>>;

  let changeViewSignal: jest.Mock<CollectionChangeSignal<ICar>>;
  let addViewSignal: jest.Mock<CollectionAddSignal<ICar>>;
  let removeViewSignal: jest.Mock<CollectionRemoveSignal<ICar>>;
  let updateViewSignal: jest.Mock<CollectionUpdateSignal<ICar>>;

  let carCollection: CarCollection;
  let usedCarCollection: UsedCarCollectionView;

  beforeEach(() => {
    changeSignal = jest.fn();
    addSignal = jest.fn();
    removeSignal = jest.fn();
    updateSignal = jest.fn();

    changeViewSignal = jest.fn();
    addViewSignal = jest.fn();
    removeViewSignal = jest.fn();
    updateViewSignal = jest.fn();

    carCollection = new CarCollection([newTeslaModel3]);
    carCollection.registerObserver(CollectionChangeSignal.type, changeSignal);
    carCollection.registerObserver(CollectionAddSignal.type, addSignal);
    carCollection.registerObserver(CollectionRemoveSignal.type, removeSignal);
    carCollection.registerObserver(CollectionUpdateSignal.type, updateSignal);

    usedCarCollection = new UsedCarCollectionView(carCollection);
    usedCarCollection.registerObserver(
      CollectionChangeSignal.type,
      changeViewSignal
    );
    usedCarCollection.registerObserver(CollectionAddSignal.type, addViewSignal);
    usedCarCollection.registerObserver(
      CollectionRemoveSignal.type,
      removeViewSignal
    );
    usedCarCollection.registerObserver(
      CollectionUpdateSignal.type,
      updateViewSignal
    );
  });

  describe('When adding a new car to the collection', () => {
    beforeEach(() => {
      carCollection.add(newTeslaModelX);
    });

    test('Should trigger change signal in collection', () => {
      expect(changeSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger add signal in collection', () => {
      expect(addSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger no change signal in view', () => {
      expect(changeViewSignal).toHaveBeenCalledTimes(0);
    });

    test('Should trigger no add signal in view', () => {
      expect(addViewSignal).toHaveBeenCalledTimes(0);
    });

    test('Should trigger no remove signal in view', () => {
      expect(removeViewSignal).toHaveBeenCalledTimes(0);
    });

    test('Should trigger no update signal in view', () => {
      expect(updateViewSignal).toHaveBeenCalledTimes(0);
    });
  });

  describe('When adding a used car to the collection', () => {
    beforeEach(() => {
      carCollection.add(usedChevyCamero);
    });

    test('Should trigger change signal in collection', () => {
      expect(changeSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger add signal in collection', () => {
      expect(addSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger change signal in view', () => {
      expect(changeViewSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger add signal in view', () => {
      expect(addViewSignal).toHaveBeenCalledTimes(1);
    });

    test('Should trigger no remove signal in view', () => {
      expect(removeViewSignal).toHaveBeenCalledTimes(0);
    });

    test('Should trigger no update signal in view', () => {
      expect(updateViewSignal).toHaveBeenCalledTimes(0);
    });
  });
});
