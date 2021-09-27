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
    static _warningMessage: string;
    static _state: {
        [k: string]: any;
    };
    static count: (key: string) => number;
    static getCount: (key: string) => number;
    static setState: <T extends MonoContextState>(newState: Partial<T>) => MonoContextState;
    static getState: <T extends MonoContextState>() => T;
    count: (key: string) => number;
    setState: <T extends MonoContextState>(newState: Partial<T>) => MonoContextState;
    getState: <T extends MonoContextState>() => T;
    getCount: (key: string) => number;
    constructor(warningOff?: boolean);
}
