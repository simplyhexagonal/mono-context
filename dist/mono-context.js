var MonoContext = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => MonoContext
  });
  var _MonoContext = class {
    constructor(warningOff = false) {
      this.count = _MonoContext.count;
      this.setState = _MonoContext.setState;
      this.getState = _MonoContext.getState;
      this.getCount = _MonoContext.getCount;
      if (!warningOff) {
        console.log("WARNING: instantiating MonoContext is unnecessary, all methods are statically defined");
      }
      if (!_MonoContext.instance) {
        _MonoContext.instance = this;
        return this;
      }
      return _MonoContext.instance;
    }
  };
  var MonoContext = _MonoContext;
  MonoContext._stateCreatedAt = new Date();
  MonoContext._stateUpdatedAt = new Date();
  MonoContext._counts = {};
  MonoContext._warningMessage = 'WARNING: refusing to override "PROPERTY" property in MonoContext state';
  MonoContext._state = {};
  MonoContext.count = (key) => {
    if (!_MonoContext._counts[key]) {
      _MonoContext._counts[key] = 0;
    }
    _MonoContext._counts[key] += 1;
    return _MonoContext._counts[key];
  };
  MonoContext.getCount = (key) => _MonoContext._counts[key] || 0;
  MonoContext.setState = (newState) => {
    if (Object.keys(newState).includes("stateCreatedAt")) {
      console.log(_MonoContext._warningMessage.replace("PROPERTY", "stateCreatedAt"));
    }
    if (Object.keys(newState).includes("stateUpdatedAt")) {
      console.log(_MonoContext._warningMessage.replace("PROPERTY", "stateUpdatedAt"));
    }
    if (Object.keys(newState).includes("counts")) {
      console.log(_MonoContext._warningMessage.replace("PROPERTY", "counts"));
    }
    const _a = newState, {
      counts,
      stateCreatedAt,
      stateUpdatedAt
    } = _a, safeNewState = __objRest(_a, [
      "counts",
      "stateCreatedAt",
      "stateUpdatedAt"
    ]);
    if (Object.keys(safeNewState).length > 0) {
      _MonoContext._state = __spreadValues(__spreadValues({}, _MonoContext._state), safeNewState);
      _MonoContext._stateUpdatedAt = new Date();
    }
    return _MonoContext.getState();
  };
  MonoContext.getState = () => {
    return _MonoContext._state = __spreadProps(__spreadValues({}, _MonoContext._state), {
      counts: __spreadValues({}, _MonoContext._counts),
      stateCreatedAt: _MonoContext._stateCreatedAt,
      stateUpdatedAt: _MonoContext._stateUpdatedAt
    });
  };
  return src_exports;
})();
//# sourceMappingURL=mono-context.js.map
'undefined'!=typeof module&&(module.exports=MonoContext.default),'undefined'!=typeof window&&(MonoContext=MonoContext.default);