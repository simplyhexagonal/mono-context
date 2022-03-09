export { version } from '../package.json';
export interface MonoContextState {
    counts: {
        [k: string]: number;
    };
    stateCreatedAt: Date;
    stateUpdatedAt: Date;
    [k: string]: any;
}
export default class MonoContext {
    private static instance;
    private static _stateCreatedAt;
    private static _stateUpdatedAt;
    private static _counts;
    private static _state;
    static version: string;
    static default: typeof MonoContext;
    static _warningMessage: string;
    static count: (key: string) => number;
    static getCount: (key: string) => number;
    static resetCount: (key: string) => void;
    static resetAllCounts: () => void;
    static setState: <T extends MonoContextState>(newState: Partial<T>) => MonoContextState;
    static getState: <T extends MonoContextState>() => T;
    static getStateValue: (key: string) => any;
    static resetState: () => void;
    count: (key: string) => number;
    getCount: (key: string) => number;
    resetCount: (key: string) => void;
    resetAllCounts: () => void;
    setState: <T extends MonoContextState>(newState: Partial<T>) => MonoContextState;
    getState: <T extends MonoContextState>() => T;
    getStateValue: (key: string) => any;
    resetState: () => void;
    constructor(warningOff?: boolean);
}
