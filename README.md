# localstorage-vcs
[![Build Status](https://travis-ci.com/zepod/localstorage-vcs.svg?branch=master)](https://travis-ci.com/zepod/localstorage-vcs)
[![codecov](https://codecov.io/gh/zepod/localstorage-vcs/branch/master/graph/badge.svg)](https://codecov.io/gh/zepod/localstorage-vcs)
[![Maintainability](https://api.codeclimate.com/v1/badges/009f22f206c9dfd8f7f2/maintainability)](https://codeclimate.com/github/zepod/localstorage-vcs/maintainability)

[![NPM](https://nodei.co/npm/localstorage-vcs.png)](https://nodei.co/npm/localstorage-vcs/)

## Introduction
As usage of `localStorage` evolves over time, particular meaning of keys in the storage may change
it's shape or meaning. That may result in inconsistent state of an application. `localstorage-vcs`
let's you track versions of `localStorage` and enables you to programmatically manage changes of stored data,
so localStorage is always up to date.

Localstorage script exposes a single function, that will run each time your client code gets executed in the browser.
This function will mutate localStorage based on a configuration that gets passed into the function as it's only
argument.

## Config
#### `config.version`: *string*
This property notes current version of localStorage that the application expects. Any `string` will qualify as
a valid version, as long as it is unique in reference to previously used versions.

Since this property is used to determinate whether localStorage mutation should be executed, it is advised
to set it manually only when localStorage changes it's shape.

*Note: version will be kept in localStorage under `LOCAL_STORAGE_VERSION` key*

**Bad practice**
* Last commit's hash of each version is discouraged as it will trigger update of localStorage after EVERY release

**Good practice**
* Usually a incrementally updated digit is advisable, as it suggests continues nature of versioning.

#### `config.removeAll`: *boolean*
If set `true` each time version changes, every key on `localStorage` will be removed via `localStorage.clear()` method.

**Beware that this set to true will have priority over other below methods.**

*Example:*
```
const config = {
    version: '1',
    removeAll: true
}
```

#### `config.remove`: *string[]*
Collection of keys on `localStorage` that should be removed after version changes.

**A key refers to `localStorage.getItem(key)`**

**Beware that key present in this array will not be migrated even if specified in below option**

*Example:*
```
const config = {
    version: '1',
    remove: ['someKey1', 'someKey2']
}
```

## `config.migrations`
* Array of chronological sequence of `Migrations`
* A `Migration` is represented as an array of length of 2.
* **First** element of `Migration` is a reference to version, that triggers migration functions.
* **Second** element of `Migration` is an `object` that has `localStorage` keys, as properties and functions
as vales

**Migration function**
* Function that accepts current key directly from localStorage of given version
* Returned value will replace previous value of localStorage item.

*Example:*
```typescript
const config = {
    version: '2',
    migrations: [
        ['1', { someKey: oldKey => `${oldKey}_v1` }],
        ['2', { someKey: oldKey => oldKey.replace('_v1', '_v2') }],
    ]
}
```

## API in terms of types
```typescript
type Key = string;
type Version = string;
type MigrationFunction = (oldKey: Key | null) => Key;

interface IMigrationKeys {
    [key: string]: MigrationFunction
}

type Migration = [Version, IMigrationKeys]

export interface IConfig {
    migrations?: Migration[],
    removeAll?: boolean,
    remove?: Key[],
    version: Version
}
```

