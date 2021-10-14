import MonoContext, { MonoContextState } from '.';

interface TestState extends MonoContextState {
  hello: string;
}

const testData = {
  hello: 'world'
};

describe('MonoContext class', () => {
  it('can get the current state', () => {
    const {
      counts,
      stateCreatedAt,
      stateUpdatedAt,
    } = MonoContext.getState();

    expect(Boolean(counts && stateCreatedAt.getDate && stateUpdatedAt.getDate)).toBe(true);
  });

  it('can set new values on the state', () => {
    const preState = MonoContext.getState<TestState>();

    expect(Object.keys(preState).includes('hello')).toBe(false);

    const setStateState = MonoContext.setState(testData);
    const postState = MonoContext.getState<TestState>();

    expect(Object.keys(preState).includes('hello')).toBe(false);
    expect(Object.keys(setStateState).includes('hello')).toBe(true);
    expect(Object.keys(postState).includes('hello')).toBe(true);
    expect(postState.hello).toBe('world');
    expect(MonoContext.getStateValue('hello')).toBe('world');
  });

  it('can update existing values on the state', () => {
    const setStateState = MonoContext.setState(testData);
    expect(setStateState.hello).toBe('world');

    const updateStateState = MonoContext.setState({
      hello: 'universe',
    });
    expect(updateStateState.hello).toBe('universe');
    expect(MonoContext.getState()['hello']).toBe('universe');
  });

  it('can track multiple counts', () => {
    const preCountState = MonoContext.getState();

    expect(MonoContext.count('theFirstCount')).toBe(1);
    const firstSecondCountResult = MonoContext.count('theFirstCount');
    expect(firstSecondCountResult).toBe(2);

    MonoContext.count('theSecondCount');
    MonoContext.count('theSecondCount');
    MonoContext.count('theSecondCount');

    const postCountState = MonoContext.getState();

    expect(Object.keys(preCountState.counts).length).toBe(0);
    expect(Object.keys(postCountState.counts).length).toBe(2);
    expect(postCountState.counts['theFirstCount']).toBe(2);
    expect(postCountState.counts['theSecondCount']).toBe(3);
  });

  it('can get specific counts', () => {
    MonoContext.count('getCountTestCount');
    MonoContext.count('getCountTestCount');

    expect(MonoContext.getCount('getCountTestCount')).toBe(2);
  });

  it('tracks state creation and updates', () => {
    const {
      stateCreatedAt,
      stateUpdatedAt,
    } = MonoContext.getState();

    const createdAtValue = stateCreatedAt.valueOf();
    const updatedAtValue = stateUpdatedAt.valueOf();

    expect(createdAtValue).toBeGreaterThan(1632701759404);
    expect(createdAtValue).toBeLessThan(8000000000000);
    expect(createdAtValue).toBeLessThan(updatedAtValue);


    expect(updatedAtValue - createdAtValue).toBeGreaterThan(1);

    expect(updatedAtValue - createdAtValue).toBeLessThan(1000);
  });

  it('can reset state and counts', () => {
    MonoContext.setState({
      reset: 'me',
    });

    expect(MonoContext.getStateValue('reset')).toBe('me');
    expect(MonoContext.getCount('resetMe')).toBe(0);

    MonoContext.count('resetMe');
    MonoContext.count('resetMeAfter');

    MonoContext.resetState();

    expect(MonoContext.getStateValue('reset')).toBeUndefined();
    expect(MonoContext.getCount('resetMe')).toBe(1);

    MonoContext.resetCount('resetMe');

    expect(MonoContext.getStateValue('reset')).toBeUndefined();
    expect(MonoContext.getCount('resetMe')).toBe(0);
    expect(MonoContext.getCount('resetMeAfter')).toBe(1);
  
    MonoContext.setState({
      setMe: 'again',
    });

    expect(MonoContext.getStateValue('setMe')).toBe('again');
    expect(MonoContext.getCount('resetMe')).toBe(0);
    expect(MonoContext.getCount('resetMeAfter')).toBe(1);

    MonoContext.resetAllCounts();

    expect(MonoContext.getStateValue('setMe')).toBe('again');
    expect(MonoContext.getCount('resetMe')).toBe(0);
    expect(MonoContext.getCount('resetMeAfter')).toBe(0);
  });

  it('refuses to override reserved keys in the state and warns about it', () => {
    const { _warningMessage } = MonoContext;

    const { log } = console;
    console.log = jest.fn();

    MonoContext.count('reservedCount');

    MonoContext.setState({
      counts: {},
    });

    expect(console.log).toHaveBeenCalledWith(_warningMessage.replace('PROPERTY', 'counts'));

    MonoContext.setState({
      stateCreatedAt: new Date(),
    });

    expect(console.log).toHaveBeenCalledWith(_warningMessage.replace('PROPERTY', 'stateCreatedAt'));

    const badUpdatedDate = new Date();
    MonoContext.setState({
      stateUpdatedAt: badUpdatedDate,
    });

    expect(console.log).toHaveBeenCalledWith(_warningMessage.replace('PROPERTY', 'stateUpdatedAt'));

    expect(MonoContext.getCount('reservedCount')).toBe(1);
    expect(
      MonoContext.getState()['stateUpdatedAt'].valueOf()
    ).toBeLessThan(
      badUpdatedDate.valueOf()
    );

    console.log = log;
  });
});

describe('MonoContext instance', () => {
  it('warns about unnecessary instantiation, or not, based on user config', () => {
    const { log } = console;
    console.log = jest.fn();

    new MonoContext(true);

    expect(console.log).toHaveBeenCalledTimes(0);

    new MonoContext();

    expect(console.log).toHaveBeenCalledWith(
      'WARNING: instantiating MonoContext is unnecessary, all methods are statically defined'
    );

    console.log = log;
  });

  it('is singleton', () => {
    const monoContext1 = new MonoContext(true);
    const monoContext2 = new MonoContext(true);

    monoContext1.count('singletonCount');

    expect(monoContext2.getCount('singletonCount')).toBe(1);
  });

  it('can do all things the static class can do', () => {
    const monoContext = new MonoContext(true);

    // count and getCount
    expect(monoContext.getCount('instanceFnCount')).toBe(0);
    monoContext.count('instanceFnCount');
    expect(monoContext.getCount('instanceFnCount')).toBe(1);

    // setState and getState
    expect(monoContext.getState()['instanceValue']).toBeUndefined();
    monoContext.setState({
      instanceValue: testData,
    });
    expect(monoContext.getState()['instanceValue'].hello).toBe('world');

    // tracks state creation and updates
    const {
      stateCreatedAt,
      stateUpdatedAt,
    } = monoContext.getState();

    const createdAtValue = stateCreatedAt.valueOf();
    const updatedAtValue = stateUpdatedAt.valueOf();

    expect(createdAtValue).toBeGreaterThan(1632701759404);
    expect(createdAtValue).toBeLessThan(8000000000000);
    expect(createdAtValue).toBeLessThan(updatedAtValue);


    expect(updatedAtValue - createdAtValue).toBeGreaterThan(1);

    expect(updatedAtValue - createdAtValue).toBeLessThan(1000);

    expect(updatedAtValue).toBe(MonoContext.getState()['stateUpdatedAt'].valueOf());
  });
});
