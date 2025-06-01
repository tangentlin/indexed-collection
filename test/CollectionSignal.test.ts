import { describe, beforeEach, test, expect, vi, Mock } from 'vitest';

import { CollectionAddSignal } from '../src/signals/CollectionAddSignal';
import { CollectionChangeSignal } from '../src/signals/CollectionChangeSignal';
import { CollectionRemoveSignal } from '../src/signals/CollectionRemoveSignal';
import { CollectionUpdateSignal } from '../src/signals/CollectionUpdateSignal';
import { SignalHandler } from '../src/signals/ISignalObserver';
import { CarCollection, UsedCarCollectionView } from './shared/collections';
import {
  ICar,
  newTeslaModel3,
  newTeslaModelX,
  usedChevyCamero,
  usedTeslaModel3,
} from './shared/data';

describe('Collection signal tests', () => {
  let changeSignal: Mock<SignalHandler<CollectionChangeSignal<ICar>>>;
  let addSignal: Mock<SignalHandler<CollectionAddSignal<ICar>>>;
  let removeSignal: Mock<SignalHandler<CollectionRemoveSignal<ICar>>>;
  let updateSignal: Mock<SignalHandler<CollectionUpdateSignal<ICar>>>;

  let changeViewSignal: Mock<SignalHandler<CollectionChangeSignal<ICar>>>;
  let addViewSignal: Mock<SignalHandler<CollectionAddSignal<ICar>>>;
  let removeViewSignal: Mock<SignalHandler<CollectionRemoveSignal<ICar>>>;
  let updateViewSignal: Mock<SignalHandler<CollectionUpdateSignal<ICar>>>;

  let carCollection: CarCollection;
  let usedCarCollection: UsedCarCollectionView;

  beforeEach(() => {
    changeSignal = vi.fn();
    addSignal = vi.fn();
    removeSignal = vi.fn();
    updateSignal = vi.fn();

    changeViewSignal = vi.fn();
    addViewSignal = vi.fn();
    removeViewSignal = vi.fn();
    updateViewSignal = vi.fn();

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

    describe('When unregister add signal', () => {
      beforeEach(() => {
        changeViewSignal.mockClear();
        changeSignal.mockClear();
        carCollection.unregisterObserver(changeSignal);
        usedCarCollection.unregisterObserver(changeViewSignal);
        carCollection.add(usedTeslaModel3);
      });

      test("should not trigger collection's change signal", () => {
        expect(changeSignal).toHaveBeenCalledTimes(0);
      });

      test("should not trigger view's change signal", () => {
        expect(changeViewSignal).toHaveBeenCalledTimes(0);
      });
    });
  });
});
