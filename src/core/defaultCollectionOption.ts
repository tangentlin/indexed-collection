import { CollectionNature } from './CollectionNature';
import { type ICollectionOption } from './ICollectionOption';

export const defaultCollectionOption: Readonly<ICollectionOption> = Object.freeze({
  nature: CollectionNature.Set,
});
