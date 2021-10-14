// @ts-ignore
import { version } from '../package.json';

// @ts-ignore
export { version } from '../package.json';

export interface MonoContextState {
  counts: {[k: string]: number},
  stateCreatedAt: Date,
  stateUpdatedAt: Date,
  [k: string]: any,
}

export default class MonoContext {
  private static instance: MonoContext;

  private static _stateCreatedAt: Date = new Date();
  private static _stateUpdatedAt: Date = new Date();
  private static _counts: {[k: string]: number} = {};
  private static _state: {[k: string]: any} = {};

  static version = version;

  static _warningMessage = 'WARNING: refusing to override "PROPERTY" property in MonoContext state';

  static count = (key: string): number => {
    if (!MonoContext._counts[key]) {
      MonoContext._counts[key] = 0;
    }

    MonoContext._counts[key] += 1;

    return MonoContext._counts[key];
  };

  static getCount = (key: string): number => MonoContext._counts[key] || 0;

  static resetCount = (key: string) => {
    if (MonoContext._counts[key]) {
      MonoContext._counts[key] = 0;
    }
  }

  static resetAllCounts = () => {
    MonoContext._counts = {};
  }

  static setState = <T extends MonoContextState>(newState: Partial<T>) => {
    if (Object.keys(newState).includes('stateCreatedAt')) {
      console.log(MonoContext._warningMessage.replace('PROPERTY', 'stateCreatedAt'));
    }

    if (Object.keys(newState).includes('stateUpdatedAt')) {
      console.log(MonoContext._warningMessage.replace('PROPERTY', 'stateUpdatedAt'));
    }

    if (Object.keys(newState).includes('counts')) {
      console.log(MonoContext._warningMessage.replace('PROPERTY', 'counts'));
    }

    const {
      counts,
      stateCreatedAt,
      stateUpdatedAt,
      ...safeNewState
    } = newState;

    if (Object.keys(safeNewState).length > 0) {
      MonoContext._state = {
        ...MonoContext._state,
        ...safeNewState,
      } as T;

      MonoContext._stateUpdatedAt = new Date();
    }

    return MonoContext.getState();
  };

  static getState = <T extends MonoContextState>() => {
    return MonoContext._state = {
      ...MonoContext._state,
      counts: { ...MonoContext._counts },
      stateCreatedAt: MonoContext._stateCreatedAt,
      stateUpdatedAt: MonoContext._stateUpdatedAt,
    } as T;
  };

  static getStateValue = (key: string) => MonoContext._state[key];

  static resetState = () => {
    MonoContext._stateCreatedAt = new Date();
    MonoContext._stateUpdatedAt = new Date();
    MonoContext._state = {};
  }

  count = MonoContext.count;
  getCount = MonoContext.getCount;
  resetCount = MonoContext.resetCount;
  resetAllCounts = MonoContext.resetAllCounts;
  setState = MonoContext.setState;
  getState = MonoContext.getState;
  getStateValue = MonoContext.getStateValue;
  resetState = MonoContext.resetState;

  constructor(warningOff: boolean = false) {
    if (!warningOff) {
      console.log(
        'WARNING: instantiating MonoContext is unnecessary, all methods are statically defined'
      );
    }

    if (!MonoContext.instance) {
      MonoContext.instance = this;
      return this;
    }

    return MonoContext.instance;
  }
}
