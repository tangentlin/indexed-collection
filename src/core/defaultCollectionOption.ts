import { ICollectionOption } from './ICollectionOption';
import { CollectionNature } from './CollectionNature';

export const defaultCollectionOption: Readonly<ICollectionOption> = Object.freeze(
  {
    nature: CollectionNature.Set,
  }
);
