[![NPM version](https://img.shields.io/npm/v/indexed-collection.svg?style=flat)](https://www.npmjs.com/package/indexed-collection)
![NPM license](https://img.shields.io/npm/l/indexed-collection.svg?style=flat)

# indexed-collection

A zero-dependency library of classes that make filtering, sorting and observing changes to arrays easier and more efficient.


## Getting Started

Installation

```shell
#npm
npm install indexed-collection

# yarn
yarn add indexed-collection
```


### Example
The following contrived example that walks through some basic features of Collect, CollectionView and Index.

Assuming we have a community of people that consists of the following fields
* name
* age
* gender
* hobbies

The community want to keep statistics by gender initially for everybody.  Let's build a collection
that indexes on gender

```JavaScript
import { IndexedCollectionBase, CollectionIndex, CollectionViewBase } from 'indexed-colection';

class PeopleCollection extends IndexedCollectionBase {
  construtor() {
    super();
    this.genderIndex = new CollectionIndex([(person) => person.gender]);
    this.buildIndexes([
      this.genderIndex,
    ]);
  }
  
  byGender(gender) {
    this.genderIndex.getValue(gender);
  }
}
```

Next, let's add some people

```JavaScript

const people = new PeopleCollection();
people.add({ name: 'John', gender: 'male', age: 70, hobbies: ['fishing', 'hiking'] });
people.add({ name: 'Mary', gender: 'female', age: 50, hobbies: ['hiking', 'bowling'] });
people.add({ name: 'Chris', gender: 'male', age: 35, hobbies: ['hiking', 'kayaking'] });
people.add({ name: 'Ana', gender: 'femal', age: 32, hobbies: ['bowling', 'kayaking'] });

// let's report
people.count; // 4
people.items; // [John, Mary, Chris, Ana]
people.byGender('male');  // [John, Chris]
people.byGender('female'); // [Mary, Ana]
```

Besides tracking all the people in the community, the community also want to track all the seniors (age 65 or above). Given
this collection is a subset of the `PeopleCollect`, we can utilize the CollectionView, which is a readonly collection that
derives values from a base collection.

```JavaScript

class SeniorCollection {
  constructor(baseCollection) {
    super(baseCollection, {
      filter: (person) => person.age >= 65
    })
  }
  
  byGender(gender) {
    return super.applyFilterAndSort(
      this.source.byGender(gender)
    );
  }
}


const seniors = new SeniorCollection(people);
seniors.count; // 1
seniors.byGender('male');  // [John]
seniors.byGender('female'); // [] No-one

```

#### Handling changes

The beauty of Collection and CollectionView is it can handle data changes.  For example, let's add a new people to the community

```JavaScript
people.add({ name: 'Betty', age: 68, gender: 'female', hobbies: ['fishing'] });

people.count // 5
people.byGender('female'); // Mary, Ana, Betty

// The collection view is also updated because it stays in sync with its base collection
seniors.count // 2
seniors.byGender('female'); // [Betty]
```

#### More advanced indexes

The community want to report on people's hobbies, and also want to report on hobbies & gender as well.

To do so, we need to add two indexes, one for hobbies, and one for both hobbies and gender.

```JavaScript

// Revise within PeopleCollection's constructor
const getHobby = (person) => person.hobbies;
getHobby.isMultiple = true;  // isMultiple = true indicates the value extracted is an array or a set of values

this.hobbyIndex = new CollectionIndex([getBobby]);
this.genderAndHobbyIndex = new CollectionIndex( [person => person.gender, getHobby] );

this.buildIndexes([
  this.genderIndex,
  this.hobbyIndex,
  this.genderAndHobbyIndex,
]);
```


```JavaScript
// Add byHobby and byGenderAndHobby methods to PeopleCollection for ease of access
byHobby(hobby) {
  this.hobbyIndex.getValue(hobby);
}

byGenderAndHobby(gender, hobby) {
  this.hobbyIndex.getValue(gender, hobby);
}
```

```JavaScript
people.byHobby('fishing'); // [John, Betty]
people.byHooby('hiking'); // [John, Mary, Chris]
people.byGenderAndHobby('male', 'hiking'); // [John, Chris]
```

Next, let's propagate the byHobby and byGenderAndHobby to the collection SeniorCollection class
```JavaScript
byHobby(hobby) {
  return super.applyFilterAndSort(
    this.source.byHobby(hobby)
  );
}

byGenderAndHobby(gender, hobby) {
  return super.applyFilterAndSort(
    this.source.byGenderAndHobby(gender, hobby)
  );
}
```

```JavaScript
seniors.byHobby('finshing'); // [John, Betty]
seniors.byGenderAndHobby('hiking'); // [John]
```


## In-depth

