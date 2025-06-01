import { CollectionNature } from './CollectionNature';
import { ICollectionOption } from './ICollectionOption';

export const defaultCollectionOption: Readonly<ICollectionOption> = Object.freeze({
  nature: CollectionNature.Set,
});
