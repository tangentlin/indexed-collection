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

### Concepts

Indexed collection consists of three key parts: index, collection, and view.

#### Index
Index defines how a collection should be indexed for each retrieval. A common use case of index
would be indexing on a field of each line item, thus the index would group items by the value of
the field.  To create an index, use the CollectionIndex class.

For example

```typescript
// JavaScript
const byGenderIndex = new CollectionIndex( [ (person) => person.gender ]);

// TypeScript
const byGenderIndex: <IPerson, [string]> = new CollectionIndex( [ (person) => person.gender ]);
```

`CollectionIndex` supports multiple level of indexes.  Multiple level
indexes are useful when values need to be further grouped into levels of subgroups.

For example, if we wish to group people by gender then by age, the index can look like

```typescript
// JavaScript
const byGenderAndAgeIndex = new CollectionIndex( [ (person) => person.gender, (person) => person.age ]);

// TypeScript
const byGenderAndAgeIndex: <IPerson, [string, number]> = new CollectionIndex( [ (person) => person.gender, (person) => person.age ]);
```

##### Many-to-many relationship

Sometimes, and field in each item may consist of an array or set of values, we can annotate
the index with `isMultiple=true`, so each value of the field become a key in the index, thus it
creates a many-to-many relationship.

For example, in the [example](#example) above, each person has multiple hobbies, and multiple people
can have the same hobby, therefore hobby and person has many-to-many relationship, so to index
the hobby, `isMultiple=true` is needed.

```JavaScript
// JavaScript
const getHobbies = (person) => person.hobbies;
getHobbies.isMultiple = true;
const byHobbyIndex = new CollectionIndex( getHobbies );

// TypeScript
const getHobbies: MultipleKeyExtract<IPerson, string> = (person) => person.hobbies;
getHobbies.isMultiple = true;
const byHobbyIndex = new CollectionIndex<IPerson, [string]>( getHobbies );
```

Value of index is not limited to number or string, it can be anything in JavaScript.  Keep
in mind value comparison is index is strict equal.

Additionally, one can also use index to do advanced indexing such as value bucketing, for example
people can be indexed/grouped by age range (10-19, 20-19, ... etc), please see [Advanced Topics](#advanced-topics)
for more details.

### Collection

Collection provides way to add, remove and retrieve items.  Each collection can consist of
zero to many indexes.  Underneath the hood, the collection would orchestrate all the indexes
when items are added or removed.

To create a collection, one would need to create a class that extends either `IndexedCollectionBase`
or `PrimaryKeyCollection`.  `IndexedCollectionBase` identifies duplicates by performing
strict equality of each item added to the collection; `PrimaryKeyCollection` identifies duplicates by
performing strict equality of each item's primary key value such as the ID value of an item.

A typical Collection class would consist of the following elements

* Constructor
  * Initial values (optional)
  * Define indexes as fields
  * Call super.buildIndexes() with the defined indexes
  * Call addRange() to add initial values
* Helper methods to extract values (optional but recommended) from indexes

For example, the PeopleCollection class in the [example](#example) provides a typical JavaScript example,
a TypeScript equivalent would be as the following,

```typescript
import {CollectionIndex} from "./CollectionIndex";
import {MultipleKeyExtract} from "./KeyExtract";
import {IndexedCollectionBase} from "./IndexedCollectionBase";

class PeopleCollection extends IndexedCollectionBase<IPerson> {
  private readonly byGenderIndex: CollectionIndex<IPerson, [string]>;
  private readonly byHobbyIndex: CollectionIndex<IPerson, [string]>;
  private readonly byGenderAndHobbyIndex: CollectionIndex<IPerson, [string, string]>;

  constructor(initialValues?: readonly IPerson[]) {
    super();

    const getGender = (person: IPerson) => person.gender;
    const getHobbies: MultipleKeyExtract<IPeson, string> = (person: IPerson) => person.hobbies;
    getHobbies.isMultiple = true;

    this.byGenderIndex = new CollectionIndex<IPerson, [string]>([getGender]);
    this.byHobbyIndex = new CollectionIndex<IPerson, [string]>([getHobbies]);
    this.byGenderAndHobbyIndex = new CollectionIndex<IPerson, [string]>([getGender, getHobbies]);

    this.buildIndexes([
      this.byGenderIndex,
      this.byHobbyIndex,
      this.byGenderAndHobbyIndex,
    ]);

    if (initialValues) {
      this.addRange(initialValues);
    }
  }

  // Helper methods to help extract values from indexes
  byGender(gender: string): readonly IPerson[] {
    return this.byGenderIndex.getValues(gender);
  }

  byHobby(hobby: string): readonly IPerson[] {
    return this.byHobbyIndex.getValues(gender);
  }

  byGenderAndHobby(gender: string, hobby: string): readonly IPerson[] {
    return this.byGenderAndHobbyIndex.getValues(gender, hobby);
  }
}
```

To create collection based on PrimaryKeyCollection, a function that extracts the id from each item would
need to be provided in the constructor.  For example

```typescript
// Assuming each IPerson is identified by a unique SSN which is a number
class PeopleCollection extends PrimaryKeyCollection<IPerson, number> {
  constructor(initialValues?: readonly IPerson[]) {
    super((person: IPerson) => person.ssn);
    
    // Additional indexes similar to IndexedCollectionBased example above
  }
}
```

Collection also support other features such as change observation etc, please see [Advanced Topics](#advanced-topics)
for more details.


### View

If a Collection is seen as a table in a relational database, a View is similar to View in the relational
database as well.  A view is a read-only version of a collection with values filtered and sorted.

A view has to depend on a source collection, and any changes on sourced collection would immediately
impact the views output.

To define a view, one would need to create a class based on `CollectionViewBase` class with the following
elements:

* Constructor
  * Pass in an instance of collection as the data source of the view
  * Define filter, sort or both for the video
    * Filter has the same signature as [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
    * Sort has the same signature as [Array.sort compare function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
* Helper methods to extract values
  * These helper methods may mirror source collection's helper methods
  * Each helper method involves calling `this.applyFilterandSort( parent.helperMethod )`

For example

```typescript
class SeniorPeopleView extends CollectionViewBase<IPerson, PeopleCollection> {
  constructor(source: PeopleCollection) {
    super(source, {
      filter: (person: IPerson) => person.age >= 65,
      
      // Always sort by age in ascending order
      sort: (a: IPerson, b: IPerson) => a.age - b.age
    });
  }
  
  byGender(gender: string): readonly IPerson[] {
    this.applyFilterAndSort(
      this.source.byGender(gender)
    );
  }
  
  // byHobby, byGenderAndHobby are similar to byGender
}
```

#### Nested Collection view

A collection view can be nested from another view.  This can be used for representing further
data subset.  For example, `SeniorFemalePeopleView` can be sourced from `SeniorPeopleView`, for example

```typescript
class SeniorPeopleView extends CollectionViewBase<IPerson, SeniorPeopleView> {
  constructor(source: SeniorPeopleView) {
    super(source, {
      // Note that filter does not need to define the age constrain
      filter: (person: IPerson) => person.gender === 'female'
    });
  }
  
  byGender(gender: string): readonly IPerson[] {
    this.applyFilterAndSort(
      this.source.byGender(gender)
    );
  }
  
  // byHobby, byGenderAndHobby are similar to byGender
}
```
Note that filter is nested when a view is sourced from another view.  However, sorting is not nested,
each view has to manage its own sort order.  If sort is undefined, the view would inherit the natural
order from its source.


## Advanced Topics

Coming soon.

