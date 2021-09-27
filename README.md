# Mono Context
![Tests](https://github.com/simplyhexagonal/mono-context/workflows/tests/badge.svg)

This library does two things across multiple packages on a [monorepo](https://en.wikipedia.org/wiki/Monorepo):

- incrementally count arbitrary events of your chosing
- store a (type-safe) global state of any values you want

and gosh darn it, is it [REALLY GOOD](https://github.com/simplyhexagonal/mono-context/blob/main/src/test.ts) at doing so!

## Open source notice

This project is open to updates by its users, I ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing).

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) 🏆
- Starring this repo on [Github](https://github.com/simplyhexagonal/mono-context) 🌟

## Example use case

Let's say you have a monorepo with package `a` and package `b`.

Package `a` has a set of commonly used functions, and `b` is an app that consumes said functions:

```
my-awesome-monorepo/
├─ packages/
│  ├─ a/
│  │  ├─ src/
│  │  │  ├─ ...
│  │  ├─ package.json
├─ apps/
│  ├─ b/
│  │  ├─ src/
│  │  │  ├─ ...
│  │  ├─ package.json
```

Package `a` has a function that should only ever run once in an app's lifecycle:

```ts
export const initDataModel = (/* ... */) => {
  // if this runs more than once your app will crash
  // and somewhere in the world a puppy will die
  // ...
}
```

App `b` calls the function:

```ts
import { initDataModel } from 'a';

const startServer = () => {
  initDataModel(/* ... */);

  // ...
}
```

You see this, and see that it is good.

But, oh no... your teammate, Steve, comes by a week later and implements in app `b` a controller
that he only ever tests via unit testing, and within the controller:

```ts
import { initDataModel } from 'a';

initDataModel(/* ... */); // Steve, just, why?

export default class ControllerOfDoom {
  // ...
}
```

Nobody catches the double call of `initDataModel` until it's too late.

Now you have been tasked with solving this dilemma and Steve's on vacation.

You are certain the error is caused by a double call of `initDataModel`, but how can you fix this
properly and in a timely fashion?

How about a singleton? No, that won't do. Only classes can be singleton and your coding standards
specify that package `a` should only ever export functions.

Fear not, `MonoContext` can easily help you!

Simply add it as a dependency of package `a` and count:

```ts
import MonoContext from '@simplyhexagonal/mono-context';

export const initDataModel = (/* ... */) => {
  const callCount = MonoContext.count('initDataModel');

  if (callCount > 1) {
    console.log('WARNING: initDataModel has been called more than once');
  } else {
    // if this runs more than once your app will crash
    // and somewhere in the world a puppy will die
    // ...
  }
}
```

What's more, on app `b` you can get the count as well:

```ts
import MonoContext from '@simplyhexagonal/mono-context';

import ControllerOfDoom from '../controllers/controller-of-doom';

console.log(MonoContext.getCount('initDataModel'));
// and this is how you found the culprit of Buddy's untimely demise
```

Great!

Now, let's say you have been tasked with replacing all `console.logs` in the monorepo with a `debug`
function from package `a`:

```ts
export const debug = (...args) => {
  if (/* ... */) {
    console.log(...args);
  }
}
```

You dilligently replace all `console.log` calls on all apps in the monorepo, it's hundreds of files,
but then, they tell you that they want all logs to include the app's unique ID.

Well, f...

You feel tempted to simply search and replace all instances of `debug(` in the monorepo with
`debug(appId, `, somehow. But that wouldn't be very [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself),
now would it? Also you'd have to somehow define or import `appId` on hundreds of files.

But hey, you've already got **MonoContext**!

You might as well just refactor the `debug` function as so:

```ts
import MonoContext from '@simplyhexagonal/mono-context';

export const debug = (...args) => {
  if (/* ... */) {
    const { appId } = MonoContext.getState(); // *sigh of relief

    console.log(`(${appId}) -`, ...args);
  }
}
```

Then, simply make sure each app stores the `appId` on MonoContext's state:

```ts
// on app `b`
const startServer = () => {
  const appId = /* */;
  MonoContext.setState({ appId });

  // ...
}

// on app `c`
const initApp = () => {
  const appId = /* */;
  MonoContext.setState({ appId });

  // ...
}

// etc
```

## Usage

Import `MonoContext`:

```tsx
// Node
const MockContext = require('@simplyhexagonal/mono-context');

// ES6/Typescript
import MockContext from '@simplyhexagonal/mono-context';

// Browser (i.e. useful to debug components within React)
<script src="https://cdn.jsdelivr.net/npm/@simplyhexagonal/mono-context@latest/dist/mono-context.min.js"></script>
```

Then, simply call `MonoContext`'s static functions:

```ts
MonoContext.count('myCount');
MonoContext.getCount('myCount');

MonoContext.setState({
  some: 'data',
  that: {
    is: 'useful'
  }
});

const {
  some,
  that,
} = MonoContext.getState();
```

## Type-safe states

It's easy to work with typed states, simply extend the `MonoContextState` as follows:

```ts
import { MonoContextState } from '@simplyhexagonal/mono-context';

interface MyAwesomeState extends MonoContextState {
  hello: string;
}
```

Then, pass your state as the generic type for `setState` and `getState`:

```ts
MonoContext.setState<MyAwesomeState>({
  hello: 'world',
});
```

![Image depicting VSCode catching a type error when storing a number on the state's "hello" string property](https://raw.githubusercontent.com/simplyhexagonal/mono-context/main/assets/type-safe-set-state-example.png)

```ts
const state = MonoContext.getState<MyAwesomeState>({
  hello: 'world',
});
```

![Image depicting VSCode intellisense displaying the "hello" property as part of the retreived state](https://raw.githubusercontent.com/simplyhexagonal/mono-context/main/assets/type-safe-get-state-example.png)

## State update tracking

`MonoContext` tracks the time at which the state is created and the time of the last update
performed over the state:

```ts
const { stateCreatedAt } =  MonoContext.getState();

setTimeout(() => {
  MonoContext.setState({some: 'thing'}); // only `setState()` updates `stateUpdatedAt`
  const { stateUpdatedAt } =  MonoContext.getState();

  const timeElapsed = stateUpdatedAt.valueOf() - stateCreatedAt.valueOf();

  console.log(timeElapsed);
  // 1003
}, 1000);
```

**NOTE:** the `count` method does **NOT** update the `stateUpdatedAt` value.

**NOTE:** the `stateUpdatedAt` value will **only** be updated if a value is **actually stored** in
the state (i.e. `setState({})` does **NOT** update the `stateUpdatedAt` value).

## Reserved state keys

The following keys will print a warning on console and be ignored by `MonoContext` when using
`setState` to try and store them:

- counts
- stateCreatedAt
- stateUpdatedAt

## Static vs instance

There is **no** reason to instantiate `MonoContext`.

If you do so by mistake, `MonoContext` will log to console an inoffensive warning message advicing
against this practice.

With this said, we understand that there will be edge-cases (there always are) in which you might
need to instantiate `MonoContext` in order to avoid some linting, standards, or whatnot that go
against the usage of statically defined functionality, and thus, will want to turn off the
aforementioned warning.

In such cases just instantiate `MonoContext` with a `true` argument as follows:

```ts
const monoContext = new MonoContext(true);
```

This instance is a singleton, so you never have to worry what might happen if you instantiate
`MonoContext` more than once.

And all static functions are available as instance functions, which are [thoroughly tested](https://github.com/simplyhexagonal/mono-context/blob/main/src/test.ts) to make
sure will perform exactly the same.

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the tests and don't forget to add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/mono-context/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/mono-context/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/simplyhexagonal/mono-context/commits?author=jeanlescure" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2021-Present [MonoContext Contributors](https://github.com/simplyhexagonal/mono-context/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
