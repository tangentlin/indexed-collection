export enum AttributeTag {
  Automatic = 'automatic',
  Manual = 'manual',
  Sedan = 'sedan',
  Suv = 'suv',
  Gas = 'gas',
  Electric = 'electric',
  Hybrid = 'hybrid',
}

export interface ICar {
  id: string;
  make: string;
  model: string;
  isNew: boolean;
  price: number;

  tags: AttributeTag[];
}

export const newTeslaModel3 = {
  id: '3n',
  make: 'Tesla',
  model: 'Model 3',
  isNew: true,
  price: 45000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Sedan],
};
export const usedTeslaModel3 = {
  id: '3u',
  make: 'Tesla',
  model: 'Model 3',
  isNew: false,
  price: 27500,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Sedan],
};
export const newTeslaModelX = {
  id: 'xn',
  make: 'Tesla',
  model: 'Model X',
  isNew: true,
  price: 125000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Suv],
};
export const usedTeslaModelX = {
  id: 'xu',
  make: 'Tesla',
  model: 'Model X',
  isNew: false,
  price: 78000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Suv],
};
export const newChevyEquinox = {
  id: 'en',
  make: 'Chevy',
  model: 'Equinox',
  isNew: true,
  price: 26500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Suv],
};
export const usedChevyEquinox = {
  id: 'en',
  make: 'Chevy',
  model: 'Equinox',
  isNew: false,
  price: 17500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Suv],
};
export const newChevyCamero = {
  id: 'cn',
  make: 'Chevy',
  model: 'Camero',
  isNew: true,
  price: 31500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Sedan],
};
export const usedChevyCamero = {
  id: 'cu',
  make: 'Chevy',
  model: 'Camero',
  isNew: false,
  price: 19500,
  tags: [AttributeTag.Manual, AttributeTag.Gas, AttributeTag.Sedan],
};
export const allCars = [
  newTeslaModel3,
  usedTeslaModel3,
  newTeslaModelX,
  usedTeslaModelX,
  newChevyEquinox,
  usedChevyEquinox,
  newChevyCamero,
  usedChevyCamero,
];
