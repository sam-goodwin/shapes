// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Function.js
var isFunction = (input2) => typeof input2 === "function";
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args = arguments;
        return function(self) {
          return body(self, ...args);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value) => () => value;
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/version.js
var moduleVersion = "2.0.0-next.58";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/GlobalValue.js
var globalStoreId = /* @__PURE__ */ Symbol.for(`effect/GlobalValue/globalStoreId/${moduleVersion}`);
if (!(globalStoreId in globalThis)) {
  ;
  globalThis[globalStoreId] = /* @__PURE__ */ new Map();
}
var globalStore = globalThis[globalStoreId];
var globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Predicate.js
var isString = (input2) => typeof input2 === "string";
var isNumber = (input2) => typeof input2 === "number";
var isBoolean = (input2) => typeof input2 === "boolean";
var isBigInt = (input2) => typeof input2 === "bigint";
var isSymbol = (input2) => typeof input2 === "symbol";
var isFunction2 = isFunction;
var isUndefined = (input2) => input2 === void 0;
var isNever = (_) => false;
var isRecordOrArray = (input2) => typeof input2 === "object" && input2 !== null;
var isObject = (input2) => isRecordOrArray(input2) || isFunction2(input2);
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObject(self) && property in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
var isNullable = (input2) => input2 === null || input2 === void 0;
var isNotNullable = (input2) => input2 !== null && input2 !== void 0;
var isUint8Array = (input2) => input2 instanceof Uint8Array;
var isDate = (input2) => input2 instanceof Date;
var isIterable = (input2) => hasProperty(input2, Symbol.iterator);
var isRecord = (input2) => isRecordOrArray(input2) && !Array.isArray(input2);
var isPromise = (input2) => hasProperty(input2, "then") && "catch" in input2 && isFunction2(input2.then) && isFunction2(input2.catch);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Utils.js
var GenKindTypeId = /* @__PURE__ */ Symbol.for("effect/Gen/GenKind");
var GenKindImpl = class {
  value;
  constructor(value) {
    this.value = value;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  [GenKindTypeId] = GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SingleShotGen = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;
var PCGRandom = class {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max2) {
    if (!max2) {
      return this._next();
    }
    max2 = max2 >>> 0;
    if ((max2 & max2 - 1) === 0) {
      return this._next() & max2 - 1;
    }
    let num = 0;
    const skew = (-max2 >>> 0) % max2 >>> 0;
    for (num = this._next(); num < skew; num = this._next()) {
    }
    return num % max2;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Hash.js
var randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
var pcgr = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/pcgr"), () => new PCGRandom());
var symbol = /* @__PURE__ */ Symbol.for("effect/Hash");
var hash = (self) => {
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "boolean":
      return string(String(self));
    case "symbol":
      return string(String(self));
    case "string":
      return string(self);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self === null) {
        return string("null");
      }
      if (isHash(self)) {
        return self[symbol]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
var combine = (b) => (self) => self * 53 ^ b;
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var isHash = (u) => hasProperty(u, symbol);
var number = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(n);
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys5) => {
  let h = 12289;
  for (let i = 0; i < keys5.length; i++) {
    h ^= pipe(string(keys5[i]), combine(hash(o[keys5[i]])));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, Object.keys(o));
var array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Equal.js
var symbol2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if ((selfType === "object" || selfType === "function") && self !== null && that !== null) {
    if (isEqual(self) && isEqual(that)) {
      return hash(self) === hash(that) && self[symbol2](that);
    }
  }
  return false;
}
var isEqual = (u) => hasProperty(u, symbol2);
var equivalence = () => (self, that) => equals(self, that);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Equivalence.js
var make = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
var isStrictEquivalent = (x, y) => x === y;
var strict = () => isStrictEquivalent;
var number2 = /* @__PURE__ */ strict();
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make((x, y) => self(f(x), f(y))));
var Date2 = /* @__PURE__ */ mapInput(number2, (date) => date.getTime());
var array2 = (item) => make((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJSON = (x) => {
  if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
var format = (x) => JSON.stringify(x, null, 2);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Pipeable.js
var pipeArguments = (self, args) => {
  switch (args.length) {
    case 1:
      return args[0](self);
    case 2:
      return args[1](args[0](self));
    case 3:
      return args[2](args[1](args[0](self)));
    case 4:
      return args[3](args[2](args[1](args[0](self))));
    case 5:
      return args[4](args[3](args[2](args[1](args[0](self)))));
    case 6:
      return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
    case 7:
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
    case 8:
      return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
    case 9:
      return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args.length; i < len; i++) {
        ret = args[i](ret);
      }
      return ret;
    }
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/opCodes/effect.js
var OP_ASYNC = "Async";
var OP_COMMIT = "Commit";
var OP_FAILURE = "Failure";
var OP_ON_FAILURE = "OnFailure";
var OP_ON_SUCCESS = "OnSuccess";
var OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
var OP_SUCCESS = "Success";
var OP_SYNC = "Sync";
var OP_TAG = "Tag";
var OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
var OP_WHILE = "While";
var OP_WITH_RUNTIME = "WithRuntime";
var OP_YIELD = "Yield";
var OP_REVERT_FLAGS = "RevertFlags";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
var StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
var SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
var ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
var effectVariance = {
  /* c8 ignore next */
  _R: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _,
  _V: moduleVersion
};
var sinkVariance = {
  /* c8 ignore next */
  _R: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _L: (_) => _,
  /* c8 ignore next */
  _Z: (_) => _
};
var channelVariance = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return random(this);
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var StructuralPrototype = {
  [symbol]() {
    return structure(this);
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key2 of selfKeys) {
      if (!(key2 in that && equals(this[key2], that[key2]))) {
        return false;
      }
    }
    return true;
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/option.js
var TypeId = /* @__PURE__ */ Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(that.value, this.value);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return combine(hash(this._tag));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input2) => hasProperty(input2, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var some = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/either.js
var TypeId2 = /* @__PURE__ */ Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(that.right, this.right);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(that.left, this.left);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = (input2) => hasProperty(input2, TypeId2);
var isLeft = (ma) => ma._tag === "Left";
var isRight = (ma) => ma._tag === "Right";
var left = (left3) => {
  const a = Object.create(LeftProto);
  a.left = left3;
  return a;
};
var right = (right3) => {
  const a = Object.create(RightProto);
  a.right = right3;
  return a;
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Order.js
var make2 = (compare) => (self, that) => self === that ? 0 : compare(self, that);
var number3 = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var reverse = (O) => make2((self, that) => O(that, self));
var mapInput2 = /* @__PURE__ */ dual(2, (self, f) => make2((b1, b2) => self(f(b1), f(b2))));
var all = (collection) => {
  return make2((x, y) => {
    const len = Math.min(x.length, y.length);
    let collectionLength = 0;
    for (const O of collection) {
      if (collectionLength >= len) {
        break;
      }
      const o = O(x[collectionLength], y[collectionLength]);
      if (o !== 0) {
        return o;
      }
      collectionLength++;
    }
    return 0;
  });
};
var tuple = (...elements) => all(elements);
var greaterThan = (O) => dual(2, (self, that) => O(self, that) === 1);
var max = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Option.js
var none2 = () => none;
var some2 = some;
var isOption2 = isOption;
var isNone2 = isNone;
var isSome2 = isSome;
var match = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var orElse = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? that() : self);
var fromNullable = (nullableValue) => nullableValue == null ? none2() : some2(nullableValue);
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var map = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var flatten = /* @__PURE__ */ flatMap(identity);
var getEquivalence = (isEquivalent) => make((x, y) => x === y || (isNone2(x) ? isNone2(y) : isNone2(y) ? false : isEquivalent(x.value, y.value)));
var containsWith = (isEquivalent) => dual(2, (self, a) => isNone2(self) ? false : isEquivalent(self.value, a));
var _equivalence = /* @__PURE__ */ equivalence();
var contains = /* @__PURE__ */ containsWith(_equivalence);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/BigDecimal.js
var TypeId3 = /* @__PURE__ */ Symbol.for("effect/BigDecimal");
var BigDecimalProto = {
  [TypeId3]: TypeId3,
  [symbol]() {
    const normalized = normalize(this);
    return pipe(hash(normalized.value), combine(number(normalized.scale)));
  },
  [symbol2](that) {
    return isBigDecimal(that) && equals2(this, that);
  },
  toString() {
    return format2(this);
  },
  toJSON() {
    return {
      _id: "BigDecimal",
      value: String(this.value),
      scale: this.scale
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isBigDecimal = (u) => hasProperty(u, TypeId3);
var make3 = (value, scale2) => {
  const o = Object.create(BigDecimalProto);
  o.value = value;
  o.scale = scale2;
  return o;
};
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint10 = /* @__PURE__ */ BigInt(10);
var zero = /* @__PURE__ */ make3(bigint0, 0);
var normalize = (self) => {
  if (self.normalized === void 0) {
    if (self.value === bigint0) {
      self.normalized = zero;
    } else {
      const digits = `${self.value}`;
      let trail = 0;
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] === "0") {
          trail++;
        } else {
          break;
        }
      }
      if (trail === 0) {
        self.normalized = self;
      }
      const value = BigInt(digits.substring(0, digits.length - trail));
      const scale2 = self.scale - trail;
      self.normalized = make3(value, scale2);
    }
  }
  return self.normalized;
};
var scale = (self, scale2) => {
  if (scale2 > self.scale) {
    return make3(self.value * bigint10 ** BigInt(scale2 - self.scale), scale2);
  }
  if (scale2 < self.scale) {
    return make3(self.value / bigint10 ** BigInt(self.scale - scale2), scale2);
  }
  return self;
};
var Equivalence = /* @__PURE__ */ make((self, that) => {
  if (self.scale > that.scale) {
    return scale(that, self.scale).value === self.value;
  }
  if (self.scale < that.scale) {
    return scale(self, that.scale).value === that.value;
  }
  return self.value === that.value;
});
var equals2 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(self, that));
var format2 = (n) => {
  const negative = n.value < bigint0;
  const absolute = negative ? `${n.value}`.substring(1) : `${n.value}`;
  let before;
  let after;
  if (n.scale >= absolute.length) {
    before = "0";
    after = "0".repeat(n.scale - absolute.length) + absolute;
  } else {
    const location = absolute.length - n.scale;
    if (location > absolute.length) {
      const zeros = location - absolute.length;
      before = `${absolute}${"0".repeat(zeros)}`;
      after = "";
    } else {
      after = absolute.slice(location);
      before = absolute.slice(0, location);
    }
  }
  const complete2 = after === "" ? before : `${before}.${after}`;
  return negative ? `-${complete2}` : complete2;
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Either.js
var right2 = right;
var left2 = left;
var isLeft2 = isLeft;
var isRight2 = isRight;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? onLeft(self.left) : onRight(self.right));
var merge = /* @__PURE__ */ match2({
  onLeft: identity,
  onRight: identity
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/readonlyArray.js
var isNonEmptyArray = (self) => self.length > 0;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Tuple.js
var make4 = (...elements) => elements;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/ReadonlyArray.js
var makeBy = (n, f) => {
  const max2 = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max2; i++) {
    out.push(f(i));
  }
  return out;
};
var fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
var prepend = /* @__PURE__ */ dual(2, (self, head3) => [head3, ...self]);
var append = /* @__PURE__ */ dual(2, (self, last3) => [...self, last3]);
var isEmptyArray = (self) => self.length === 0;
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var isOutOfBound = (i, as2) => i < 0 || i >= as2.length;
var get = /* @__PURE__ */ dual(2, (self, index2) => {
  const i = Math.floor(index2);
  return isOutOfBound(i, self) ? none2() : some2(self[i]);
});
var unsafeGet = /* @__PURE__ */ dual(2, (self, index2) => {
  const i = Math.floor(index2);
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
var head = /* @__PURE__ */ get(0);
var headNonEmpty = /* @__PURE__ */ unsafeGet(0);
var last = (self) => isNonEmptyReadonlyArray(self) ? some2(lastNonEmpty(self)) : none2();
var lastNonEmpty = (self) => self[self.length - 1];
var tailNonEmpty = (self) => self.slice(1);
var reverse2 = (self) => Array.from(self).reverse();
var sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
var zip = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, make4));
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as2 = fromIterable(self);
  const bs = fromIterable(that);
  if (isNonEmptyReadonlyArray(as2) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as2), headNonEmpty(bs))];
    const len = Math.min(as2.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as2[i], bs[i]);
    }
    return out;
  }
  return [];
});
var empty = () => [];
var of = (a) => [a];
var map2 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    out.push(...f(self[i], i));
  }
  return out;
});
var flatten2 = /* @__PURE__ */ flatMap2(identity);
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b));
var unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome2(o = f(next))) {
    const [a, b2] = o.value;
    out.push(a);
    next = b2;
  }
  return out;
};
var getEquivalence2 = array2;
var dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input2 = fromIterable(self);
  if (isNonEmptyReadonlyArray(input2)) {
    const out = [headNonEmpty(input2)];
    const rest = tailNonEmpty(input2);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
var dedupe = /* @__PURE__ */ dedupeWith(/* @__PURE__ */ equivalence());
var join = /* @__PURE__ */ dual(2, (self, sep) => fromIterable(self).join(sep));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Chunk.js
var TypeId4 = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
var emptyArray = [];
var getEquivalence3 = (isEquivalent) => make((self, that) => self.length === that.length && toReadonlyArray(self).every((value, i) => isEquivalent(value, unsafeGet2(that, i))));
var _equivalence2 = /* @__PURE__ */ getEquivalence3(equals);
var ChunkProto = {
  [TypeId4]: {
    _A: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence2(this, that);
  },
  [symbol]() {
    return array(toReadonlyArray(this));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = (backing) => {
  const chunk2 = Object.create(ChunkProto);
  chunk2.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk2.length = 0;
      chunk2.depth = 0;
      chunk2.left = chunk2;
      chunk2.right = chunk2;
      break;
    }
    case "IConcat": {
      chunk2.length = backing.left.length + backing.right.length;
      chunk2.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk2.left = backing.left;
      chunk2.right = backing.right;
      break;
    }
    case "IArray": {
      chunk2.length = backing.array.length;
      chunk2.depth = 0;
      chunk2.left = _empty;
      chunk2.right = _empty;
      break;
    }
    case "ISingleton": {
      chunk2.length = 1;
      chunk2.depth = 0;
      chunk2.left = _empty;
      chunk2.right = _empty;
      break;
    }
    case "ISlice": {
      chunk2.length = backing.length;
      chunk2.depth = backing.chunk.depth + 1;
      chunk2.left = _empty;
      chunk2.right = _empty;
      break;
    }
  }
  return chunk2;
};
var isChunk = (u) => hasProperty(u, TypeId4);
var _empty = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
var empty2 = () => _empty;
var of2 = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
var fromIterable2 = (self) => isChunk(self) ? self : makeChunk({
  _tag: "IArray",
  array: fromIterable(self)
});
var copyToArray = (self, array3, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy(self.backing.array, 0, array3, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array3, initial);
      copyToArray(self.right, array3, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array3[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self.length) {
        array3[j] = unsafeGet2(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
var toReadonlyArray = (self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = {
        _tag: "IArray",
        array: arr
      };
      self.left = _empty;
      self.right = _empty;
      self.depth = 0;
      return arr;
    }
  }
};
var reverse3 = (self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse2(self.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse3(self.backing.right),
        right: reverse3(self.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse2(toReadonlyArray(self)));
  }
};
var get2 = /* @__PURE__ */ dual(2, (self, index2) => index2 < 0 || index2 >= self.length ? none2() : some2(unsafeGet2(self, index2)));
var unsafeFromArray = (self) => makeChunk({
  _tag: "IArray",
  array: self
});
var unsafeGet2 = /* @__PURE__ */ dual(2, (self, index2) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index2 !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.a;
    }
    case "IArray": {
      if (index2 >= self.length || index2 < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.array[index2];
    }
    case "IConcat": {
      return index2 < self.left.length ? unsafeGet2(self.left, index2) : unsafeGet2(self.right, index2 - self.left.length);
    }
    case "ISlice": {
      return unsafeGet2(self.backing.chunk, index2 + self.backing.offset);
    }
  }
});
var append2 = /* @__PURE__ */ dual(2, (self, a) => appendAll(self, of2(a)));
var prepend2 = /* @__PURE__ */ dual(2, (self, elem) => appendAll(of2(elem), self));
var take = /* @__PURE__ */ dual(2, (self, n) => {
  if (n <= 0) {
    return _empty;
  } else if (n >= self.length) {
    return self;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          length: n,
          offset: self.backing.offset
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return makeChunk({
            _tag: "IConcat",
            left: self.left,
            right: take(self.right, n - self.left.length)
          });
        }
        return take(self.left, n);
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: 0,
          length: n
        });
      }
    }
  }
});
var drop = /* @__PURE__ */ dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          offset: self.backing.offset + n,
          length: self.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return drop(self.right, n - self.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop(self.left, n),
          right: self.right
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: n,
          length: self.length - n
        });
      }
    }
  }
});
var appendAll = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff7 = that.depth - self.depth;
  if (Math.abs(diff7) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self,
      right: that
    });
  } else if (diff7 < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = appendAll(self.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self.left,
        right: nr
      });
    } else {
      const nrr = appendAll(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll(self, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
var isEmpty = (self) => self.length === 0;
var isNonEmpty = (self) => self.length > 0;
var head2 = /* @__PURE__ */ get2(0);
var unsafeHead = (self) => unsafeGet2(self, 0);
var headNonEmpty2 = unsafeHead;
var unsafeLast = (self) => unsafeGet2(self, self.length - 1);
var map3 = /* @__PURE__ */ dual(2, (self, f) => self.backing._tag === "ISingleton" ? of2(f(self.backing.a, 0)) : unsafeFromArray(pipe(toReadonlyArray(self), map2((a, i) => f(a, i)))));
var sort2 = /* @__PURE__ */ dual(2, (self, O) => unsafeFromArray(sort(toReadonlyArray(self), O)));
var splitAt = /* @__PURE__ */ dual(2, (self, n) => [take(self, n), drop(self, n)]);
var splitWhere = /* @__PURE__ */ dual(2, (self, predicate) => {
  let i = 0;
  for (const a of toReadonlyArray(self)) {
    if (predicate(a)) {
      break;
    } else {
      i++;
    }
  }
  return splitAt(self, i);
});
var tailNonEmpty2 = (self) => drop(self, 1);
var dedupe2 = (self) => unsafeFromArray(dedupe(toReadonlyArray(self)));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/context.js
var TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
var STMSymbolKey = "effect/STM";
var STMTypeId = /* @__PURE__ */ Symbol.for(STMSymbolKey);
var TagProto = {
  ...EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _Service: (_) => _,
    _Identifier: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      identifier: this.identifier,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make5(this, self);
  }
};
var tagRegistry = /* @__PURE__ */ globalValue("effect/Context/Tag/tagRegistry", () => /* @__PURE__ */ new Map());
var makeTag = (identifier) => {
  if (identifier && tagRegistry.has(identifier)) {
    return tagRegistry.get(identifier);
  }
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    }
  });
  if (identifier) {
    tag.identifier = identifier;
    tagRegistry.set(identifier, tag);
  }
  return tag;
};
var TypeId5 = /* @__PURE__ */ Symbol.for("effect/Context");
var ContextProto = {
  [TypeId5]: {
    _Services: (_) => _
  },
  [symbol2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol]() {
    return number(this.unsafeMap.size);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var makeContext = (unsafeMap) => {
  const context2 = Object.create(ContextProto);
  context2.unsafeMap = unsafeMap;
  return context2;
};
var serviceNotFoundError = (tag) => {
  const error = new Error(`Service not found${tag.identifier ? `: ${String(tag.identifier)}` : ""}`);
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
var isContext = (u) => hasProperty(u, TypeId5);
var _empty2 = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
var empty3 = () => _empty2;
var make5 = (tag, service) => makeContext(/* @__PURE__ */ new Map([[tag, service]]));
var add = /* @__PURE__ */ dual(3, (self, tag, service) => {
  const map12 = new Map(self.unsafeMap);
  map12.set(tag, service);
  return makeContext(map12);
});
var unsafeGet3 = /* @__PURE__ */ dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag);
});
var get3 = unsafeGet3;
var getOption = /* @__PURE__ */ dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return none;
  }
  return some(self.unsafeMap.get(tag));
});
var merge2 = /* @__PURE__ */ dual(2, (self, that) => {
  const map12 = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map12.set(tag, s);
  }
  return makeContext(map12);
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Context.js
var Tag = makeTag;
var empty4 = empty3;
var make6 = make5;
var add2 = add;
var get4 = get3;
var unsafeGet4 = unsafeGet3;
var getOption2 = getOption;
var merge3 = merge2;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashMap/config.js
var SIZE = 5;
var BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashMap/bitwise.js
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift, h) {
  return h >>> shift & MASK;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/stack.js
var Stack = class {
  value;
  previous;
  constructor(value, previous) {
    this.value = value;
    this.previous = previous;
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashMap/array.js
function arrayUpdate(mutate3, at, v, arr) {
  let out = arr;
  if (!mutate3) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i)
      out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate3, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate3) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at)
      out[g++] = arr[i++];
  }
  ;
  ++i;
  while (i <= newLen)
    out[g++] = arr[i++];
  if (mutate3) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate3, at, v, arr) {
  const len = arr.length;
  if (mutate3) {
    let i2 = len;
    while (i2 >= at)
      arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at)
    out[g++] = arr[i++];
  out[at] = v;
  while (i < len)
    out[++g] = arr[i++];
  return out;
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashMap/node.js
var EmptyNode = class _EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash2, key2, size7) {
    const v = f(none2());
    if (isNone2(v))
      return new _EmptyNode();
    ++size7.value;
    return new LeafNode(edit, hash2, key2, v);
  }
};
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode(node) {
  return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
var LeafNode = class _LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash2, key2, value) {
    this.edit = edit;
    this.hash = hash2;
    this.key = key2;
    this.value = value;
  }
  modify(edit, shift, f, hash2, key2, size7) {
    if (equals(key2, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value)
        return this;
      else if (isNone2(v2)) {
        ;
        --size7.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new _LeafNode(edit, hash2, key2, v2);
    }
    const v = f(none2());
    if (isNone2(v))
      return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new _LeafNode(edit, hash2, key2, v));
  }
};
var CollisionNode = class _CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash2, children) {
    this.edit = edit;
    this.hash = hash2;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key2, size7) {
    if (hash2 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key2, size7);
      if (list === this.children)
        return this;
      return list.length > 1 ? new _CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none2());
    if (isNone2(v))
      return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new LeafNode(edit, hash2, key2, v));
  }
  updateCollisionList(mutate3, edit, hash2, list, f, key2, size7) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals(key2, child.key)) {
        const value = child.value;
        const newValue2 = f(value);
        if (newValue2 === value)
          return list;
        if (isNone2(newValue2)) {
          ;
          --size7.value;
          return arraySpliceOut(mutate3, i, list);
        }
        return arrayUpdate(mutate3, i, new LeafNode(edit, hash2, key2, newValue2), list);
      }
    }
    const newValue = f(none2());
    if (isNone2(newValue))
      return list;
    ++size7.value;
    return arrayUpdate(mutate3, len, new LeafNode(edit, hash2, key2, newValue), list);
  }
};
var IndexedNode = class _IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key2, size7) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists2 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists2) {
      const _newChild = new EmptyNode().modify(edit, shift + SIZE, f, hash2, key2, size7);
      if (!_newChild)
        return this;
      return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new _IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child = current.modify(edit, shift + SIZE, f, hash2, key2, size7);
    if (current === child)
      return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap)
        return new EmptyNode();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new _IndexedNode(edit, bitmap, newChildren);
  }
};
var ArrayNode = class _ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size7, children) {
    this.edit = edit;
    this.size = size7;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key2, size7) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const child = children[frag];
    const newChild = (child || new EmptyNode()).modify(edit, shift + SIZE, f, hash2, key2, size7);
    if (child === newChild)
      return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ;
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      ;
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new _ArrayNode(edit, count, newChildren);
  }
};
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
}
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1)
      arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2)
    return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = new Stack(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashMap.js
var HashMapSymbolKey = "effect/HashMap";
var HashMapTypeId = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
var HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol]() {
    let hash2 = hash(HashMapSymbolKey);
    for (const item of this) {
      hash2 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return hash2;
  },
  [symbol2](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash(item[0], hash(item[0])));
        if (isNone2(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl = (editable, edit, root, size7) => {
  const map12 = Object.create(HashMapProto);
  map12._editable = editable;
  map12._edit = edit;
  map12._root = root;
  map12._size = size7;
  return map12;
};
var HashMapIterator = class _HashMapIterator {
  map;
  f;
  v;
  constructor(map12, f) {
    this.map = map12;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone2(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new _HashMapIterator(this.map, this.f);
  }
};
var applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none2();
var visitLazy = (node, f, cont = void 0) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome2(node.value)) {
        return some2({
          value: f(node.key, node.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
var visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
var _empty3 = /* @__PURE__ */ makeImpl(false, 0, /* @__PURE__ */ new EmptyNode(), 0);
var empty5 = () => _empty3;
var make7 = (...entries2) => fromIterable3(entries2);
var fromIterable3 = (entries2) => {
  const map12 = beginMutation(empty5());
  for (const entry of entries2) {
    set(map12, entry[0], entry[1]);
  }
  return endMutation(map12);
};
var isHashMap = (u) => hasProperty(u, HashMapTypeId);
var isEmpty2 = (self) => self && isEmptyNode(self._root);
var get5 = /* @__PURE__ */ dual(2, (self, key2) => getHash(self, key2, hash(key2)));
var getHash = /* @__PURE__ */ dual(3, (self, key2, hash2) => {
  let node = self._root;
  let shift = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals(key2, node.key) ? node.value : none2();
      }
      case "CollisionNode": {
        if (hash2 === node.hash) {
          const children = node.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals(key2, child.key)) {
              return child.value;
            }
          }
        }
        return none2();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash2);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift += SIZE;
          break;
        }
        return none2();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift, hash2)];
        if (node) {
          shift += SIZE;
          break;
        }
        return none2();
      }
      default:
        return none2();
    }
  }
});
var has = /* @__PURE__ */ dual(2, (self, key2) => isSome2(getHash(self, key2, hash(key2))));
var set = /* @__PURE__ */ dual(3, (self, key2, value) => modifyAt(self, key2, () => some2(value)));
var setTree = /* @__PURE__ */ dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    ;
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root ? self : makeImpl(self._editable, self._edit, newRoot, newSize);
});
var keys = (self) => new HashMapIterator(self, (key2) => key2);
var size = (self) => self._size;
var beginMutation = (self) => makeImpl(true, self._edit + 1, self._root, self._size);
var endMutation = (self) => {
  ;
  self._editable = false;
  return self;
};
var modifyAt = /* @__PURE__ */ dual(3, (self, key2, f) => modifyHash(self, key2, hash(key2), f));
var modifyHash = /* @__PURE__ */ dual(4, (self, key2, hash2, f) => {
  const size7 = {
    value: self._size
  };
  const newRoot = self._root.modify(self._editable ? self._edit : NaN, 0, f, hash2, key2, size7);
  return pipe(self, setTree(newRoot, size7.value));
});
var remove2 = /* @__PURE__ */ dual(2, (self, key2) => modifyAt(self, key2, none2));
var map4 = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, empty5(), (map12, value, key2) => set(map12, key2, f(value, key2))));
var forEach = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, void 0, (_, value, key2) => f(value, key2)));
var reduce2 = /* @__PURE__ */ dual(3, (self, zero3, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return isSome2(root.value) ? f(zero3, root.value.value, root.key) : zero3;
  }
  if (root._tag === "EmptyNode") {
    return zero3;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len; ) {
      const child = children[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome2(child.value)) {
            zero3 = f(zero3, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero3;
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/hashSet.js
var HashSetSymbolKey = "effect/HashSet";
var HashSetTypeId = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
var HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol]() {
    return combine(hash(this._keyMap))(hash(HashSetSymbolKey));
  },
  [symbol2](that) {
    if (isHashSet(that)) {
      return size(this._keyMap) === size(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = (keyMap) => {
  const set6 = Object.create(HashSetProto);
  set6._keyMap = keyMap;
  return set6;
};
var isHashSet = (u) => hasProperty(u, HashSetTypeId);
var _empty4 = /* @__PURE__ */ makeImpl2(/* @__PURE__ */ empty5());
var empty6 = () => _empty4;
var fromIterable4 = (elements) => {
  const set6 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set6, value);
  }
  return endMutation2(set6);
};
var make8 = (...elements) => {
  const set6 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set6, value);
  }
  return endMutation2(set6);
};
var has2 = /* @__PURE__ */ dual(2, (self, value) => has(self._keyMap, value));
var size2 = (self) => size(self._keyMap);
var beginMutation2 = (self) => makeImpl2(beginMutation(self._keyMap));
var endMutation2 = (self) => {
  ;
  self._keyMap._editable = false;
  return self;
};
var mutate = /* @__PURE__ */ dual(2, (self, f) => {
  const transient = beginMutation2(self);
  f(transient);
  return endMutation2(transient);
});
var add3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (set(value, true)(self._keyMap), self) : makeImpl2(set(value, true)(self._keyMap)));
var remove3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (remove2(value)(self._keyMap), self) : makeImpl2(remove2(value)(self._keyMap)));
var difference = /* @__PURE__ */ dual(2, (self, that) => mutate(self, (set6) => {
  for (const value of that) {
    remove3(set6, value);
  }
}));
var union2 = /* @__PURE__ */ dual(2, (self, that) => mutate(empty6(), (set6) => {
  forEach2(self, (value) => add3(set6, value));
  for (const value of that) {
    add3(set6, value);
  }
}));
var forEach2 = /* @__PURE__ */ dual(2, (self, f) => forEach(self._keyMap, (_, k) => f(k)));
var reduce3 = /* @__PURE__ */ dual(3, (self, zero3, f) => reduce2(self._keyMap, zero3, (z, _, a) => f(z, a)));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/HashSet.js
var isHashSet2 = isHashSet;
var empty7 = empty6;
var fromIterable5 = fromIterable4;
var make9 = make8;
var has3 = has2;
var size3 = size2;
var add4 = add3;
var remove4 = remove3;
var difference2 = difference;
var union3 = union2;
var reduce4 = reduce3;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/MutableRef.js
var TypeId6 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
var MutableRefProto = {
  [TypeId6]: TypeId6,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON(this.current)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make10 = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
var get6 = (self) => self.current;
var incrementAndGet = (self) => updateAndGet(self, (n) => n + 1);
var set2 = /* @__PURE__ */ dual(2, (self, value) => {
  self.current = value;
  return self;
});
var setAndGet = /* @__PURE__ */ dual(2, (self, value) => {
  self.current = value;
  return self.current;
});
var update = /* @__PURE__ */ dual(2, (self, f) => set2(self, f(get6(self))));
var updateAndGet = /* @__PURE__ */ dual(2, (self, f) => setAndGet(self, f(get6(self))));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberId.js
var FiberIdSymbolKey = "effect/FiberId";
var FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
var OP_NONE = "None";
var OP_RUNTIME = "Runtime";
var OP_COMPOSITE = "Composite";
var None = class {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  [symbol]() {
    return pipe(hash(FiberIdSymbolKey), combine(hash(this._tag)));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Runtime = class {
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id, startTimeMillis) {
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol]() {
    return pipe(hash(FiberIdSymbolKey), combine(hash(this._tag)), combine(hash(this.id)), combine(hash(this.startTimeMillis)));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Composite = class {
  left;
  right;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  [symbol]() {
    return pipe(hash(FiberIdSymbolKey), combine(hash(this._tag)), combine(hash(this.left)), combine(hash(this.right)));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_COMPOSITE && equals(this.left, that.left) && equals(this.right, that.right);
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: toJSON(this.left),
      right: toJSON(this.right)
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var none3 = /* @__PURE__ */ new None();
var isFiberId = (self) => hasProperty(self, FiberIdTypeId);
var ids = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty7();
    }
    case OP_RUNTIME: {
      return make9(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self.left), union3(ids(self.right)));
    }
  }
};
var _fiberCounter = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make10(0));
var threadName = (self) => {
  const identifiers = Array.from(ids(self)).map((n) => `#${n}`).join(",");
  return identifiers;
};
var unsafeMake = () => {
  const id = get6(_fiberCounter);
  pipe(_fiberCounter, set2(id + 1));
  return new Runtime(id, (/* @__PURE__ */ new Date()).getTime());
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/FiberId.js
var none4 = none3;
var threadName2 = threadName;
var unsafeMake2 = unsafeMake;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/HashMap.js
var empty8 = empty5;
var make12 = make7;
var fromIterable6 = fromIterable3;
var isEmpty3 = isEmpty2;
var get7 = get5;
var set3 = set;
var keys2 = keys;
var size4 = size;
var map6 = map4;
var reduce5 = reduce2;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/List.js
var TypeId7 = /* @__PURE__ */ Symbol.for("effect/List");
var toArray2 = (self) => Array.from(self);
var getEquivalence4 = (isEquivalent) => mapInput(getEquivalence2(isEquivalent), toArray2);
var _equivalence3 = /* @__PURE__ */ getEquivalence4(equals);
var ConsProto = {
  [TypeId7]: TypeId7,
  _tag: "Cons",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray2(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag && _equivalence3(this, that);
  },
  [symbol]() {
    return array(toArray2(this));
  },
  [Symbol.iterator]() {
    let done4 = false;
    let self = this;
    return {
      next() {
        if (done4) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done4 = true;
          return this.return();
        }
        const value = self.head;
        self = self.tail;
        return {
          done: done4,
          value
        };
      },
      return(value) {
        if (!done4) {
          done4 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeCons = (head3, tail) => {
  const cons2 = Object.create(ConsProto);
  cons2.head = head3;
  cons2.tail = tail;
  return cons2;
};
var NilProto = {
  [TypeId7]: TypeId7,
  _tag: "Nil",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol]() {
    return array(toArray2(this));
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var _Nil = /* @__PURE__ */ Object.create(NilProto);
var isList = (u) => hasProperty(u, TypeId7);
var isNil = (self) => self._tag === "Nil";
var isCons = (self) => self._tag === "Cons";
var nil = () => _Nil;
var cons = (head3, tail) => makeCons(head3, tail);
var empty9 = nil;
var of3 = (value) => makeCons(value, _Nil);
var appendAll2 = /* @__PURE__ */ dual(2, (self, that) => prependAll(that, self));
var prepend3 = /* @__PURE__ */ dual(2, (self, element) => cons(element, self));
var prependAll = /* @__PURE__ */ dual(2, (self, prefix) => {
  if (isNil(self)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
var reduce6 = /* @__PURE__ */ dual(3, (self, zero3, f) => {
  let acc = zero3;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
var reverse4 = (self) => {
  let result = empty9();
  let these = self;
  while (!isNil(these)) {
    result = prepend3(result, these.head);
    these = these.tail;
  }
  return result;
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/data.js
var ArrayProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Array.prototype), {
  [symbol]() {
    return array(this);
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var Structural = /* @__PURE__ */ function() {
  function Structural2(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural2.prototype = StructuralPrototype;
  return Structural2;
}();

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/differ/contextPatch.js
var ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance(a) {
  return a;
}
var PatchProto = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};
var EmptyProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Empty"
});
var _empty5 = /* @__PURE__ */ Object.create(EmptyProto);
var empty10 = () => _empty5;
var AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AndThen"
});
var makeAndThen = (first2, second) => {
  const o = Object.create(AndThenProto);
  o.first = first2;
  o.second = second;
  return o;
};
var AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AddService"
});
var makeAddService = (tag, service) => {
  const o = Object.create(AddServiceProto);
  o.tag = tag;
  o.service = service;
  return o;
};
var RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "RemoveService"
});
var makeRemoveService = (tag) => {
  const o = Object.create(RemoveServiceProto);
  o.tag = tag;
  return o;
};
var UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "UpdateService"
});
var makeUpdateService = (tag, update3) => {
  const o = Object.create(UpdateServiceProto);
  o.tag = tag;
  o.update = update3;
  return o;
};
var diff = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch8 = empty10();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals(old, newService)) {
        patch8 = combine3(makeUpdateService(tag, () => newService))(patch8);
      }
    } else {
      missingServices.delete(tag);
      patch8 = combine3(makeAddService(tag, newService))(patch8);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch8 = combine3(makeRemoveService(tag))(patch8);
  }
  return patch8;
};
var combine3 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen(self, that));
var patch = /* @__PURE__ */ dual(2, (self, context2) => {
  let wasServiceUpdated = false;
  let patches = of2(self);
  const updatedContext = new Map(context2.unsafeMap);
  while (isNonEmpty(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head3.tag, head3.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(prepend2(tail, head3.second), head3.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head3.tag);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head3.tag, head3.update(updatedContext.get(head3.tag)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map12 = /* @__PURE__ */ new Map();
  for (const [tag] of context2.unsafeMap) {
    if (updatedContext.has(tag)) {
      map12.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map12.set(tag, s);
  }
  return makeContext(map12);
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
var HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance2(a) {
  return a;
}
var PatchProto2 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance2,
    _Key: variance2,
    _Patch: variance2
  }
};
var EmptyProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Empty"
});
var _empty6 = /* @__PURE__ */ Object.create(EmptyProto2);
var empty11 = () => _empty6;
var AndThenProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "AndThen"
});
var makeAndThen2 = (first2, second) => {
  const o = Object.create(AndThenProto2);
  o.first = first2;
  o.second = second;
  return o;
};
var AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Add"
});
var makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
var RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Remove"
});
var makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
var diff2 = (oldValue, newValue) => {
  const [removed, patch8] = reduce4([oldValue, empty11()], ([set6, patch9], value) => {
    if (has3(value)(set6)) {
      return [remove4(value)(set6), patch9];
    }
    return [set6, combine4(makeAdd(value))(patch9)];
  })(newValue);
  return reduce4(patch8, (patch9, value) => combine4(makeRemove(value))(patch9))(removed);
};
var combine4 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen2(self, that));
var patch2 = /* @__PURE__ */ dual(2, (self, oldValue) => {
  let set6 = oldValue;
  let patches = of2(self);
  while (isNonEmpty(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(head3.first)(prepend2(head3.second)(tail));
        break;
      }
      case "Add": {
        set6 = add4(head3.value)(set6);
        patches = tail;
        break;
      }
      case "Remove": {
        set6 = remove4(head3.value)(set6);
        patches = tail;
      }
    }
  }
  return set6;
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/differ.js
var DifferTypeId = /* @__PURE__ */ Symbol.for("effect/Differ");
var DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  }
};
var make13 = (params) => {
  const differ3 = Object.create(DifferProto);
  differ3.empty = params.empty;
  differ3.diff = params.diff;
  differ3.combine = params.combine;
  differ3.patch = params.patch;
  return differ3;
};
var environment = () => make13({
  empty: empty10(),
  combine: (first2, second) => combine3(second)(first2),
  diff: (oldValue, newValue) => diff(oldValue, newValue),
  patch: (patch8, oldValue) => patch(oldValue)(patch8)
});
var hashSet = () => make13({
  empty: empty11(),
  combine: (first2, second) => combine4(second)(first2),
  diff: (oldValue, newValue) => diff2(oldValue, newValue),
  patch: (patch8, oldValue) => patch2(oldValue)(patch8)
});
var update2 = () => updateWith((_, a) => a);
var updateWith = (f) => make13({
  empty: identity,
  combine: (first2, second) => {
    if (first2 === identity) {
      return second;
    }
    if (second === identity) {
      return first2;
    }
    return (a) => second(first2(a));
  },
  diff: (oldValue, newValue) => {
    if (equals(oldValue, newValue)) {
      return identity;
    }
    return constant(newValue);
  },
  patch: (patch8, oldValue) => f(oldValue, patch8(oldValue))
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
var BIT_MASK = 255;
var BIT_SHIFT = 8;
var active = (patch8) => patch8 & BIT_MASK;
var enabled = (patch8) => patch8 >> BIT_SHIFT & BIT_MASK;
var make14 = (active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT);
var empty12 = /* @__PURE__ */ make14(0, 0);
var enable = (flag) => make14(flag, flag);
var disable = (flag) => make14(flag, 0);
var exclude = /* @__PURE__ */ dual(2, (self, flag) => make14(active(self) & ~flag, enabled(self)));
var andThen = /* @__PURE__ */ dual(2, (self, that) => self | that);
var invert = (n) => ~n >>> 0 & BIT_MASK;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/runtimeFlags.js
var None2 = 0;
var Interruption = 1 << 0;
var OpSupervision = 1 << 1;
var RuntimeMetrics = 1 << 2;
var WindDown = 1 << 4;
var CooperativeYielding = 1 << 5;
var cooperativeYielding = (self) => isEnabled(self, CooperativeYielding);
var enable2 = /* @__PURE__ */ dual(2, (self, flag) => self | flag);
var interruptible = (self) => interruption(self) && !windDown(self);
var interruption = (self) => isEnabled(self, Interruption);
var isEnabled = /* @__PURE__ */ dual(2, (self, flag) => (self & flag) !== 0);
var make15 = (...flags) => flags.reduce((a, b) => a | b, 0);
var none5 = /* @__PURE__ */ make15(None2);
var runtimeMetrics = (self) => isEnabled(self, RuntimeMetrics);
var windDown = (self) => isEnabled(self, WindDown);
var diff3 = /* @__PURE__ */ dual(2, (self, that) => make14(self ^ that, that));
var patch3 = /* @__PURE__ */ dual(2, (self, patch8) => self & (invert(active(patch8)) | enabled(patch8)) | active(patch8) & enabled(patch8));
var differ = /* @__PURE__ */ make13({
  empty: empty12,
  diff: (oldValue, newValue) => diff3(oldValue, newValue),
  combine: (first2, second) => andThen(second)(first2),
  patch: (_patch, oldValue) => patch3(oldValue, _patch)
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/RuntimeFlagsPatch.js
var enable3 = enable;
var disable2 = disable;
var exclude2 = exclude;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/blockedRequests.js
var par = (self, that) => ({
  _tag: "Par",
  left: self,
  right: that
});
var seq = (self, that) => ({
  _tag: "Seq",
  left: self,
  right: that
});
var flatten3 = (self) => {
  let current = of3(self);
  let updated = empty9();
  while (1) {
    const [parallel4, sequential4] = reduce6(current, [parallelCollectionEmpty(), empty9()], ([parallel5, sequential5], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel5, par2), appendAll2(sequential5, seq2)];
    });
    updated = merge4(updated, parallel4);
    if (isNil(sequential4)) {
      return reverse4(updated);
    }
    current = sequential4;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var step = (requests) => {
  let current = requests;
  let parallel4 = parallelCollectionEmpty();
  let stack = empty9();
  let sequential4 = empty9();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel4, sequential4];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left3 = current.left;
        const right3 = current.right;
        switch (left3._tag) {
          case "Empty": {
            current = right3;
            break;
          }
          case "Par": {
            const l = left3.left;
            const r = left3.right;
            current = par(seq(l, right3), seq(r, right3));
            break;
          }
          case "Seq": {
            const l = left3.left;
            const r = left3.right;
            current = seq(l, seq(r, right3));
            break;
          }
          case "Single": {
            current = left3;
            sequential4 = cons(right3, sequential4);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel4 = parallelCollectionCombine(parallel4, parallelCollectionMake(current.dataSource, current.blockedRequest));
        if (isNil(stack)) {
          return [parallel4, sequential4];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var merge4 = (sequential4, parallel4) => {
  if (isNil(sequential4)) {
    return of3(parallelCollectionToSequentialCollection(parallel4));
  }
  if (parallelCollectionIsEmpty(parallel4)) {
    return sequential4;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential4.head);
  const parKeys = parallelCollectionKeys(parallel4);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential4.head, parallelCollectionToSequentialCollection(parallel4)), sequential4.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel4), sequential4);
};
var EntryTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/Entry");
var EntryImpl = class {
  request;
  result;
  listeners;
  ownerId;
  state;
  [EntryTypeId] = blockedRequestVariance;
  constructor(request, result, listeners, ownerId, state) {
    this.request = request;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
};
var blockedRequestVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
var parallelVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var ParallelImpl = class {
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map12) {
    this.map = map12;
  }
};
var parallelCollectionEmpty = () => new ParallelImpl(empty8());
var parallelCollectionMake = (dataSource, blockedRequest) => new ParallelImpl(make12([dataSource, Array.of(blockedRequest)]));
var parallelCollectionCombine = (self, that) => new ParallelImpl(reduce5(self.map, that.map, (map12, value, key2) => set3(map12, key2, match(get7(map12, key2), {
  onNone: () => value,
  onSome: (a) => [...a, ...value]
}))));
var parallelCollectionIsEmpty = (self) => isEmpty3(self.map);
var parallelCollectionKeys = (self) => Array.from(keys2(self.map));
var parallelCollectionToSequentialCollection = (self) => sequentialCollectionMake(map6(self.map, (x) => Array.of(x)));
var SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
var sequentialVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var SequentialImpl = class {
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map12) {
    this.map = map12;
  }
};
var sequentialCollectionMake = (map12) => new SequentialImpl(map12);
var sequentialCollectionCombine = (self, that) => new SequentialImpl(reduce5(that.map, self.map, (map12, value, key2) => set3(map12, key2, match(get7(map12, key2), {
  onNone: () => [],
  onSome: (a) => [...a, ...value]
}))));
var sequentialCollectionKeys = (self) => Array.from(keys2(self.map));
var sequentialCollectionToChunk = (self) => Array.from(self.map);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/opCodes/cause.js
var OP_DIE = "Die";
var OP_EMPTY = "Empty";
var OP_FAIL = "Fail";
var OP_INTERRUPT = "Interrupt";
var OP_PARALLEL = "Parallel";
var OP_SEQUENTIAL = "Sequential";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/cause.js
var CauseSymbolKey = "effect/Cause";
var CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
var variance3 = {
  /* c8 ignore next */
  _E: (_) => _
};
var proto = {
  [CauseTypeId]: variance3,
  [symbol]() {
    return pipe(hash(CauseSymbolKey), combine(hash(flattenCause(this))));
  },
  [symbol2](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON(this.left),
          right: toJSON(this.right)
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var empty13 = /* @__PURE__ */ (() => {
  const o = /* @__PURE__ */ Object.create(proto);
  o._tag = OP_EMPTY;
  return o;
})();
var fail = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
var die = (defect) => {
  const o = Object.create(proto);
  o._tag = OP_DIE;
  o.defect = defect;
  return o;
};
var interrupt = (fiberId2) => {
  const o = Object.create(proto);
  o._tag = OP_INTERRUPT;
  o.fiberId = fiberId2;
  return o;
};
var parallel = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left3;
  o.right = right3;
  return o;
};
var sequential = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left3;
  o.right = right3;
  return o;
};
var isCause = (u) => hasProperty(u, CauseTypeId);
var isEmpty5 = (self) => {
  if (self._tag === OP_EMPTY) {
    return true;
  }
  return reduce7(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY: {
        return some2(acc);
      }
      case OP_DIE:
      case OP_FAIL:
      case OP_INTERRUPT: {
        return some2(false);
      }
      default: {
        return none2();
      }
    }
  });
};
var isInterruptedOnly = (self) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self);
var failures = (self) => reverse3(reduce7(self, empty2(), (list, cause) => cause._tag === OP_FAIL ? some2(pipe(list, prepend2(cause.error))) : none2()));
var defects = (self) => reverse3(reduce7(self, empty2(), (list, cause) => cause._tag === OP_DIE ? some2(pipe(list, prepend2(cause.defect))) : none2()));
var interruptors = (self) => reduce7(self, empty7(), (set6, cause) => cause._tag === OP_INTERRUPT ? some2(pipe(set6, add4(cause.fiberId))) : none2());
var failureOption = (self) => find(self, (cause) => cause._tag === OP_FAIL ? some2(cause.error) : none2());
var failureOrCause = (self) => {
  const option = failureOption(self);
  switch (option._tag) {
    case "None": {
      return right2(self);
    }
    case "Some": {
      return left2(option.value);
    }
  }
};
var stripFailures = (self) => match3(self, {
  onEmpty: empty13,
  onFail: () => empty13,
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId2) => interrupt(fiberId2),
  onSequential: sequential,
  onParallel: parallel
});
var electFailures = (self) => match3(self, {
  onEmpty: empty13,
  onFail: (failure) => die(failure),
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId2) => interrupt(fiberId2),
  onSequential: (left3, right3) => sequential(left3, right3),
  onParallel: (left3, right3) => parallel(left3, right3)
});
var causeEquals = (left3, right3) => {
  let leftStack = of2(left3);
  let rightStack = of2(right3);
  while (isNonEmpty(leftStack) && isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = pipe(headNonEmpty2(leftStack), reduce7([empty7(), empty2()], ([parallel4, sequential4], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel4, union3(par2)), pipe(sequential4, appendAll(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe(headNonEmpty2(rightStack), reduce7([empty7(), empty2()], ([parallel4, sequential4], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel4, union3(par2)), pipe(sequential4, appendAll(seq2))]);
    }));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
var flattenCause = (cause) => {
  return flattenCauseLoop(of2(cause), empty2());
};
var flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel4, sequential4] = pipe(causes, reduce([empty7(), empty2()], ([parallel5, sequential5], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return [pipe(parallel5, union3(par2)), pipe(sequential5, appendAll(seq2))];
    }));
    const updated = size3(parallel4) > 0 ? pipe(flattened, prepend2(parallel4)) : flattened;
    if (isEmpty(sequential4)) {
      return reverse3(updated);
    }
    causes = sequential4;
    flattened = updated;
  }
  throw new Error("BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var find = /* @__PURE__ */ dual(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL:
          case OP_PARALLEL: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option;
      }
    }
  }
  return none2();
});
var evaluateCause = (self) => {
  let cause = self;
  const stack = [];
  let _parallel = empty7();
  let _sequential = empty2();
  while (cause !== void 0) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        _parallel = add4(_parallel, cause.error);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add4(_parallel, cause.defect);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add4(_parallel, cause.fiberId);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(cause.left.left, sequential(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(sequential(cause.left.left, cause.right), sequential(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend2(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error("BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left3, right3) => left3 && right3,
  parallelCase: (_, left3, right3) => left3 && right3
};
var OP_SEQUENTIAL_CASE = "SequentialCase";
var OP_PARALLEL_CASE = "ParallelCase";
var match3 = /* @__PURE__ */ dual(2, (self, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt: onInterrupt2,
  onParallel,
  onSequential
}) => {
  return reduceWithContext(self, void 0, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId2) => onInterrupt2(fiberId2),
    sequentialCase: (_, left3, right3) => onSequential(left3, right3),
    parallelCase: (_, left3, right3) => onParallel(left3, right3)
  });
});
var reduce7 = /* @__PURE__ */ dual(3, (self, zero3, pf) => {
  let accumulator = zero3;
  let cause = self;
  const causes = [];
  while (cause !== void 0) {
    const option = pf(accumulator, cause);
    accumulator = isSome2(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = void 0;
        break;
      }
    }
    if (cause === void 0 && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
var reduceWithContext = /* @__PURE__ */ dual(3, (self, context2, reducer) => {
  const input2 = [self];
  const output = [];
  while (input2.length > 0) {
    const cause = input2.pop();
    switch (cause._tag) {
      case OP_EMPTY: {
        output.push(right2(reducer.emptyCase(context2)));
        break;
      }
      case OP_FAIL: {
        output.push(right2(reducer.failCase(context2, cause.error)));
        break;
      }
      case OP_DIE: {
        output.push(right2(reducer.dieCase(context2, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right2(reducer.interruptCase(context2, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input2.push(cause.right);
        input2.push(cause.left);
        output.push(left2({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input2.push(cause.right);
        input2.push(cause.left);
        output.push(left2({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either4 = output.pop();
    switch (either4._tag) {
      case "Left": {
        switch (either4.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.sequentialCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.parallelCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either4.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
var filterStack = (stack) => {
  const lines = stack.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("EffectPrimitive") || lines[i].includes("Generator.next") || lines[i].includes("FiberRuntime")) {
      return out.join("\n");
    } else {
      out.push(lines[i]);
    }
  }
  return out.join("\n");
};
var pretty = (cause) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  const final = prettyErrors(cause).map((e) => {
    let message = e.message;
    if (e.stack) {
      message += `\r
${filterStack(e.stack)}`;
    }
    if (e.span) {
      let current = e.span;
      let i = 0;
      while (current && current._tag === "Span" && i < 10) {
        message += `\r
    at ${current.name}`;
        current = getOrUndefined(current.parent);
        i++;
      }
    }
    return message;
  }).join("\r\n");
  return final;
};
var PrettyError = class {
  message;
  stack;
  span;
  constructor(message, stack, span) {
    this.message = message;
    this.stack = stack;
    this.span = span;
  }
  toJSON() {
    const out = {
      message: this.message
    };
    if (this.stack) {
      out.stack = this.stack;
    }
    if (this.span) {
      out.span = this.span;
    }
    return out;
  }
};
var prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return `Error: ${u}`;
  }
  if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString) {
    return u["toString"]();
  }
  return `Error: ${JSON.stringify(u)}`;
};
var spanSymbol = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
var defaultRenderError = (error) => {
  const span = hasProperty(error, spanSymbol) && error[spanSymbol];
  if (error instanceof Error) {
    return new PrettyError(prettyErrorMessage(error), error.stack?.split("\n").filter((_) => _.match(/at (.*)/)).join("\n"), span);
  }
  return new PrettyError(prettyErrorMessage(error), void 0, span);
};
var prettyErrors = (cause) => reduceWithContext(cause, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [defaultRenderError(unknownError)];
  },
  failCase: (_, error) => {
    return [defaultRenderError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/opCodes/deferred.js
var OP_STATE_PENDING = "Pending";
var OP_STATE_DONE = "Done";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/deferred.js
var DeferredSymbolKey = "effect/Deferred";
var DeferredTypeId = /* @__PURE__ */ Symbol.for(DeferredSymbolKey);
var deferredVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var pending = (joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
};
var done = (effect) => {
  return {
    _tag: OP_STATE_DONE,
    effect
  };
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/tracer.js
var TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
var make16 = (options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
var tracerTag = /* @__PURE__ */ Tag(/* @__PURE__ */ Symbol.for("effect/Tracer"));
var spanTag = /* @__PURE__ */ Tag(/* @__PURE__ */ Symbol.for("effect/ParentSpan"));
var ids2 = /* @__PURE__ */ globalValue("effect/Tracer/SpanId.ids", () => make10(0));
var NativeSpan = class {
  name;
  parent;
  context;
  links;
  startTime;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context2, links, startTime) {
    this.name = name;
    this.parent = parent;
    this.context = context2;
    this.links = links;
    this.startTime = startTime;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.spanId = `span${incrementAndGet(ids2)}`;
  }
  end = (endTime, exit2) => {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit2,
      startTime: this.status.startTime
    };
  };
  attribute = (key2, value) => {
    this.attributes.set(key2, value);
  };
  event = (name, startTime, attributes) => {
    this.events.push([name, startTime, attributes ?? {}]);
  };
};
var nativeTracer = /* @__PURE__ */ make16({
  span: (name, parent, context2, links, startTime) => new NativeSpan(name, parent, context2, links, startTime),
  context: (f) => f()
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/core.js
var EffectErrorSymbolKey = "effect/EffectError";
var EffectErrorTypeId = /* @__PURE__ */ Symbol.for(EffectErrorSymbolKey);
var isEffectError = (u) => hasProperty(u, EffectErrorTypeId);
var blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.i0 = blockedRequests;
  effect.i1 = _continue;
  return effect;
};
var runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.i0 = blockedRequests;
  return effect;
};
var EffectTypeId2 = /* @__PURE__ */ Symbol.for("effect/Effect");
var RevertFlags = class {
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch8, op) {
    this.patch = patch8;
    this.op = op;
  }
};
var EffectPrimitive = class {
  _op;
  i0 = void 0;
  i1 = void 0;
  i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return random(this);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      i0: toJSON(this.i0),
      i1: toJSON(this.i1),
      i2: toJSON(this.i2)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var EffectPrimitiveFailure = class {
  _op;
  i0 = void 0;
  i1 = void 0;
  i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return random(this);
  }
  get cause() {
    return this.i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var EffectPrimitiveSuccess = class {
  _op;
  i0 = void 0;
  i1 = void 0;
  i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return random(this);
  }
  get value() {
    return this.i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var isEffect = (u) => hasProperty(u, EffectTypeId2);
var withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.i0 = withRuntime;
  return effect;
};
var acquireUseRelease = /* @__PURE__ */ dual(3, (acquire, use, release) => uninterruptibleMask((restore) => flatMap6(acquire, (a) => flatMap6(exit(suspend(() => restore(use(a)))), (exit2) => {
  return suspend(() => release(a, exit2)).pipe(matchCauseEffect({
    onFailure: (cause) => {
      switch (exit2._tag) {
        case OP_FAILURE: {
          return failCause(parallel(exit2.i0, cause));
        }
        case OP_SUCCESS: {
          return failCause(cause);
        }
      }
    },
    onSuccess: () => exit2
  }));
}))));
var as = /* @__PURE__ */ dual(2, (self, value) => flatMap6(self, () => succeed(value)));
var asUnit = (self) => as(self, void 0);
var async = (register, blockingOn = none4) => suspend(() => {
  let backingResume = void 0;
  let pendingEffect = void 0;
  function proxyResume(effect2) {
    if (backingResume) {
      backingResume(effect2);
    } else if (pendingEffect === void 0) {
      pendingEffect = effect2;
    }
  }
  const effect = new EffectPrimitive(OP_ASYNC);
  effect.i0 = (resume2) => {
    backingResume = resume2;
    if (pendingEffect) {
      resume2(pendingEffect);
    }
  };
  effect.i1 = blockingOn;
  let cancelerRef = void 0;
  let controllerRef = void 0;
  if (register.length !== 1) {
    controllerRef = new AbortController();
    cancelerRef = register(proxyResume, controllerRef.signal);
  } else {
    cancelerRef = register(proxyResume);
  }
  return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
    if (controllerRef) {
      controllerRef.abort();
    }
    return cancelerRef ?? unit;
  }) : effect;
});
var asyncEither = (register, blockingOn = none4) => async((resume2) => {
  const result = register(resume2);
  if (isRight2(result)) {
    resume2(result.right);
  } else {
    return result.left;
  }
}, blockingOn);
var catchAll = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
  onFailure: f,
  onSuccess: succeed
}));
var spanSymbol2 = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
var originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
var capture = (obj, span) => {
  if (isSome2(span)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol2 || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol2) {
          return span.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
};
var dieMessage = (message) => failCauseSync(() => die(new RuntimeException(message)));
var either2 = (self) => matchEffect(self, {
  onFailure: (e) => succeed(left2(e)),
  onSuccess: (a) => succeed(right2(a))
});
var exit = (self) => matchCause(self, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
});
var fail2 = (error) => isObject(error) && !(spanSymbol2 in error) ? withFiberRuntime((fiber) => failCause(fail(capture(error, currentSpanFromFiber(fiber))))) : failCause(fail(error));
var failSync = (evaluate) => flatMap6(sync(evaluate), fail2);
var failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
var failCauseSync = (evaluate) => flatMap6(sync(evaluate), failCause);
var fiberId = /* @__PURE__ */ withFiberRuntime((state) => succeed(state.id()));
var fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
var flatMap6 = /* @__PURE__ */ dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
var step2 = (self) => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  return effect;
};
var flatten4 = (self) => flatMap6(self, identity);
var matchCause = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self, {
  onFailure: (cause) => succeed(onFailure(cause)),
  onSuccess: (a) => succeed(onSuccess(a))
}));
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect.i0 = self;
  effect.i1 = onFailure;
  effect.i2 = onSuccess;
  return effect;
});
var matchEffect = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const failures2 = failures(cause);
    const defects2 = defects(cause);
    if (defects2.length > 0) {
      return failCause(electFailures(cause));
    }
    if (failures2.length > 0) {
      return onFailure(unsafeHead(failures2));
    }
    return failCause(cause);
  },
  onSuccess
}));
var forEachSequential = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  const ret = new Array(arr.length);
  let i = 0;
  return as(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: (b) => {
      ret[i++] = b;
    }
  }), ret);
}));
var forEachSequentialDiscard = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
var interruptible2 = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = enable3(Interruption);
  effect.i1 = () => self;
  return effect;
};
var map9 = /* @__PURE__ */ dual(2, (self, f) => flatMap6(self, (a) => sync(() => f(a))));
var mapBoth = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => matchEffect(self, {
  onFailure: (e) => failSync(() => onFailure(e)),
  onSuccess: (a) => sync(() => onSuccess(a))
}));
var mapError = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const either4 = failureOrCause(cause);
    switch (either4._tag) {
      case "Left": {
        return failSync(() => f(either4.left));
      }
      case "Right": {
        return failCause(either4.right);
      }
    }
  },
  onSuccess: succeed
}));
var onExit = /* @__PURE__ */ dual(2, (self, cleanup) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
  onFailure: (cause1) => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: (cause2) => exitFailCause(sequential(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: (success) => {
    const result = exitSucceed(success);
    return zipRight(cleanup(result), result);
  }
})));
var onInterrupt = /* @__PURE__ */ dual(2, (self, cleanup) => onExit(self, exitMatch({
  onFailure: (cause) => isInterruptedOnly(cause) ? asUnit(cleanup(interruptors(cause))) : unit,
  onSuccess: () => unit
})));
var succeed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
var suspend = (effect) => flatMap6(sync(effect), identity);
var sync = (evaluate) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.i0 = evaluate;
  return effect;
};
var tap = /* @__PURE__ */ dual(2, (self, f) => flatMap6(self, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return as(b, a);
  } else if (isPromise(b)) {
    return async((resume2) => {
      b.then((_) => resume2(succeed(a))).catch((e) => resume2(fail2(new UnknownException(e))));
    });
  }
  return succeed(a);
}));
var transplant = (f) => withFiberRuntime((state) => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope2 = pipe(scopeOverride, getOrElse(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some2(scope2)));
});
var uninterruptible = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = disable2(Interruption);
  effect.i1 = () => self;
  return effect;
};
var uninterruptibleMask = (f) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = disable2(Interruption);
  effect.i1 = (oldFlags) => interruption(oldFlags) ? f(interruptible2) : f(uninterruptible);
  return effect;
};
var unit = /* @__PURE__ */ succeed(void 0);
var updateRuntimeFlags = (patch8) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = patch8;
  effect.i1 = void 0;
  return effect;
};
var whileLoop = (options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.i0 = options.while;
  effect.i1 = options.body;
  effect.i2 = options.step;
  return effect;
};
var yieldNow = (options) => {
  const effect = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
};
var zip2 = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, (a) => map9(that, (b) => [a, b])));
var zipLeft = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, (a) => as(that, a)));
var zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, () => that));
var never = /* @__PURE__ */ asyncEither(() => {
  const interval = setInterval(() => {
  }, 2 ** 31 - 1);
  return left2(sync(() => clearInterval(interval)));
});
var interruptFiber = (self) => flatMap6(fiberId, (fiberId2) => pipe(self, interruptAsFiber(fiberId2)));
var interruptAsFiber = /* @__PURE__ */ dual(2, (self, fiberId2) => flatMap6(self.interruptAsFork(fiberId2), () => self.await));
var logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FiberRefSymbolKey = "effect/FiberRef";
var FiberRefTypeId = /* @__PURE__ */ Symbol.for(FiberRefSymbolKey);
var fiberRefVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var fiberRefGet = (self) => fiberRefModify(self, (a) => [a, a]);
var fiberRefGetWith = /* @__PURE__ */ dual(2, (self, f) => flatMap6(fiberRefGet(self), f));
var fiberRefSet = /* @__PURE__ */ dual(2, (self, value) => fiberRefModify(self, () => [void 0, value]));
var fiberRefModify = /* @__PURE__ */ dual(2, (self, f) => withFiberRuntime((state) => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return succeed(b);
}));
var RequestResolverSymbolKey = "effect/RequestResolver";
var RequestResolverTypeId = /* @__PURE__ */ Symbol.for(RequestResolverSymbolKey);
var requestResolverVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var RequestResolverImpl = class _RequestResolverImpl {
  runAll;
  target;
  [RequestResolverTypeId] = requestResolverVariance;
  constructor(runAll, target) {
    this.runAll = runAll;
    this.target = target;
    this.runAll = runAll;
  }
  [symbol]() {
    return this.target ? hash(this.target) : random(this);
  }
  [symbol2](that) {
    return this.target ? isRequestResolver(that) && equals(this.target, that.target) : this === that;
  }
  identified(...ids4) {
    return new _RequestResolverImpl(this.runAll, fromIterable2(ids4));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isRequestResolver = (u) => hasProperty(u, RequestResolverTypeId);
var fiberRefLocally = /* @__PURE__ */ dual(3, (use, self, value) => acquireUseRelease(zipLeft(fiberRefGet(self), fiberRefSet(self, value)), () => use, (oldValue) => fiberRefSet(self, oldValue)));
var fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update2(),
  fork: options?.fork ?? identity,
  join: options?.join
});
var fiberRefUnsafeMakeHashSet = (initial) => {
  const differ3 = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakeContext = (initial) => {
  const differ3 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakePatch = (initial, options) => ({
  [FiberRefTypeId]: fiberRefVariance,
  initial,
  diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
  combine: (first2, second) => options.differ.combine(first2, second),
  patch: (patch8) => (oldValue) => options.differ.patch(patch8, oldValue),
  fork: options.fork,
  join: options.join ?? ((_, n) => n),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: differ.empty
});
var currentContext = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty4()));
var currentSchedulingPriority = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
var currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
var currentLogAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty8()));
var currentLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
var currentLogSpan = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty9()));
var withSchedulingPriority = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentSchedulingPriority, scheduler));
var currentConcurrency = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
var currentRequestBatching = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
var currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelDebug)));
var currentMetricLabels = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeHashSet(empty7()));
var currentForkScopeOverride = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none2(), {
  fork: () => none2(),
  join: (parent, _) => parent
}));
var currentInterruptedCause = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty13, {
  fork: () => empty13,
  join: (parent, _) => parent
}));
var ScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Scope");
var scopeFork = (self, strategy) => self.fork(strategy);
var YieldableError = /* @__PURE__ */ function() {
  class YieldableError2 extends globalThis.Error {
    commit() {
      return fail2(this);
    }
    toString() {
      return this.message ? `${this.name}: ${this.message}` : this.name;
    }
    toJSON() {
      return {
        ...this
      };
    }
    [NodeInspectSymbol]() {
      const stack = this.stack;
      if (stack) {
        return `${this.toString()}
${stack.split("\n").slice(1).join("\n")}`;
      }
      return this.toString();
    }
  }
  Object.assign(YieldableError2.prototype, StructuralCommitPrototype);
  return YieldableError2;
}();
var makeException = (proto3, tag) => {
  class Base2 extends YieldableError {
    _tag = tag;
  }
  Object.assign(Base2.prototype, proto3);
  Base2.prototype.name = tag;
  return Base2;
};
var RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
var RuntimeException = /* @__PURE__ */ makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
var InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
var InterruptedException = /* @__PURE__ */ makeException({
  [InterruptedExceptionTypeId]: InterruptedExceptionTypeId
}, "InterruptedException");
var isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
var IllegalArgumentExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/IllegalArgument");
var IllegalArgumentException = /* @__PURE__ */ makeException({
  [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
var NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
var NoSuchElementException = /* @__PURE__ */ makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
var InvalidPubSubCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
var InvalidPubSubCapacityException = /* @__PURE__ */ makeException({
  [InvalidPubSubCapacityExceptionTypeId]: InvalidPubSubCapacityExceptionTypeId
}, "InvalidPubSubCapacityException");
var UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
var UnknownException = /* @__PURE__ */ function() {
  class UnknownException2 extends YieldableError {
    error;
    _tag = "UnknownException";
    constructor(error, message) {
      super(message ?? (hasProperty(error, "message") && isString(error.message) ? error.message : void 0));
      this.error = error;
    }
  }
  Object.assign(UnknownException2.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException2;
}();
var exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel : sequential);
var exitFailCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
var exitInterrupt = (fiberId2) => exitFailCause(interrupt(fiberId2));
var exitMap = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(f(self.i0));
    }
  }
});
var exitMatch = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return onFailure(self.i0);
    }
    case OP_SUCCESS: {
      return onSuccess(self.i0);
    }
  }
});
var exitSucceed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
var exitUnit = /* @__PURE__ */ exitSucceed(void 0);
var exitZipWith = /* @__PURE__ */ dual(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS: {
          return exitFailCause(self.i0);
        }
        case OP_FAILURE: {
          return exitFailCause(onFailure(self.i0, that.i0));
        }
      }
    }
    case OP_SUCCESS: {
      switch (that._tag) {
        case OP_SUCCESS: {
          return exitSucceed(onSuccess(self.i0, that.i0));
        }
        case OP_FAILURE: {
          return exitFailCause(that.i0);
        }
      }
    }
  }
});
var exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable2(exits);
  if (!isNonEmpty(list)) {
    return none2();
  }
  return pipe(tailNonEmpty2(list), reduce(pipe(headNonEmpty2(list), exitMap(of2)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: (list2, value) => pipe(list2, prepend2(value)),
    onFailure: combineCauses
  }))), exitMap(reverse3), exitMap((chunk2) => Array.from(chunk2)), some2);
};
var deferredUnsafeMake = (fiberId2) => ({
  [DeferredTypeId]: deferredVariance,
  state: make10(pending([])),
  blockingOn: fiberId2,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var deferredAwait = (self) => asyncEither((k) => {
  const state = get6(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return right2(state.effect);
    }
    case OP_STATE_PENDING: {
      pipe(self.state, set2(pending([k, ...state.joiners])));
      return left2(deferredInterruptJoiner(self, k));
    }
  }
}, self.blockingOn);
var deferredUnsafeDone = (self, effect) => {
  const state = get6(self.state);
  if (state._tag === OP_STATE_PENDING) {
    pipe(self.state, set2(done(effect)));
    for (let i = state.joiners.length - 1; i >= 0; i--) {
      state.joiners[i](effect);
    }
  }
};
var deferredInterruptJoiner = (self, joiner) => sync(() => {
  const state = get6(self.state);
  if (state._tag === OP_STATE_PENDING) {
    pipe(self.state, set2(pending(state.joiners.filter((j) => j !== joiner))));
  }
});
var constContext = /* @__PURE__ */ fiberRefGet(currentContext);
var context = () => constContext;
var contextWithEffect = (f) => flatMap6(context(), f);
var provideContext = /* @__PURE__ */ dual(2, (self, context2) => fiberRefLocally(currentContext, context2)(self));
var mapInputContext = /* @__PURE__ */ dual(2, (self, f) => contextWithEffect((context2) => provideContext(self, f(context2))));
var currentSpanFromFiber = (fiber) => {
  const span = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag);
  return span !== void 0 && span._tag === "Span" ? some2(span) : none2();
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Duration.js
var TypeId8 = /* @__PURE__ */ Symbol.for("effect/Duration");
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var bigint1e9 = /* @__PURE__ */ BigInt(1e9);
var DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/;
var decode = (input2) => {
  if (isDuration(input2)) {
    return input2;
  } else if (isNumber(input2)) {
    return millis(input2);
  } else if (isBigInt(input2)) {
    return nanos(input2);
  } else if (Array.isArray(input2)) {
    if (input2.length === 2 && isNumber(input2[0]) && isNumber(input2[1])) {
      return nanos(BigInt(input2[0]) * bigint1e9 + BigInt(input2[1]));
    }
  } else {
    DURATION_REGEX.lastIndex = 0;
    const match7 = DURATION_REGEX.exec(input2);
    if (match7) {
      const [_, valueStr, unit3] = match7;
      const value = Number(valueStr);
      switch (unit3) {
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micros":
          return micros(BigInt(valueStr));
        case "millis":
          return millis(value);
        case "seconds":
          return seconds(value);
        case "minutes":
          return minutes(value);
        case "hours":
          return hours(value);
        case "days":
          return days(value);
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid duration input");
};
var zeroValue = {
  _tag: "Millis",
  millis: 0
};
var infinityValue = {
  _tag: "Infinity"
};
var DurationProto = {
  [TypeId8]: TypeId8,
  [symbol]() {
    return structure(this.value);
  },
  [symbol2](that) {
    return isDuration(that) && equals3(this, that);
  },
  toString() {
    return `Duration(${format3(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make18 = (input2) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input2)) {
    if (isNaN(input2) || input2 < 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input2)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input2)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input2 * 1e6))
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input2
      };
    }
  } else if (input2 < BigInt(0)) {
    duration.value = zeroValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input2
    };
  }
  return duration;
};
var isDuration = (u) => hasProperty(u, TypeId8);
var zero2 = /* @__PURE__ */ make18(0);
var nanos = (nanos2) => make18(nanos2);
var micros = (micros2) => make18(micros2 * bigint1e3);
var millis = (millis2) => make18(millis2);
var seconds = (seconds2) => make18(seconds2 * 1e3);
var minutes = (minutes2) => make18(minutes2 * 6e4);
var hours = (hours2) => make18(hours2 * 36e5);
var days = (days2) => make18(days2 * 864e5);
var weeks = (weeks2) => make18(weeks2 * 6048e5);
var toMillis = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Infinity;
    case "Nanos":
      return Number(_self.value.nanos) / 1e6;
    case "Millis":
      return _self.value.millis;
  }
};
var unsafeToNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
var toHrTime = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
  }
};
var match4 = /* @__PURE__ */ dual(2, (self, options) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
var matchWith = /* @__PURE__ */ dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
var Equivalence2 = (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 === that2,
  onNanos: (self2, that2) => self2 === that2
});
var greaterThanOrEqualTo = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 >= that2,
  onNanos: (self2, that2) => self2 >= that2
}));
var equals3 = /* @__PURE__ */ dual(2, (self, that) => Equivalence2(decode(self), decode(that)));
var format3 = (self) => {
  const duration = decode(self);
  const parts = [];
  if (duration.value._tag === "Infinity") {
    return "Infinity";
  }
  const nanos2 = unsafeToNanos(duration);
  if (nanos2 % 1000000n) {
    parts.push(`${nanos2 % 1000000n}ns`);
  }
  const ms = nanos2 / 1000000n;
  if (ms % 1000n !== 0n) {
    parts.push(`${ms % 1000n}ms`);
  }
  const sec = ms / 1000n;
  if (sec % 60n !== 0n) {
    parts.push(`${sec % 60n}s`);
  }
  const min2 = sec / 60n;
  if (min2 % 60n !== 0n) {
    parts.push(`${min2 % 60n}m`);
  }
  const hr = min2 / 60n;
  if (hr % 24n !== 0n) {
    parts.push(`${hr % 24n}h`);
  }
  const days2 = hr / 24n;
  if (days2 !== 0n) {
    parts.push(`${days2}d`);
  }
  return parts.reverse().join(" ");
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Number.js
var Order = number3;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/MutableHashMap.js
var TypeId9 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
var MutableHashMapProto = {
  [TypeId9]: TypeId9,
  [Symbol.iterator]() {
    return this.backingMap.current[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromHashMap = (backingMap) => {
  const map12 = Object.create(MutableHashMapProto);
  map12.backingMap = make10(backingMap);
  return map12;
};
var empty14 = () => fromHashMap(empty8());
var get8 = /* @__PURE__ */ dual(2, (self, key2) => get7(self.backingMap.current, key2));
var has4 = /* @__PURE__ */ dual(2, (self, key2) => isSome2(get8(self, key2)));
var set4 = /* @__PURE__ */ dual(3, (self, key2, value) => {
  update(self.backingMap, set3(key2, value));
  return self;
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/timeout.js
var isBun = typeof process === "undefined" ? false : !!process?.isBun;
var clear = isBun ? (id) => clearInterval(id) : (id) => clearTimeout(id);
var set5 = isBun ? (fn, ms) => {
  const id = setInterval(() => {
    fn();
    clearInterval(id);
  }, ms);
  return id;
} : (fn, ms) => setTimeout(fn, ms);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/clock.js
var ClockSymbolKey = "effect/Clock";
var ClockTypeId = /* @__PURE__ */ Symbol.for(ClockSymbolKey);
var clockTag = /* @__PURE__ */ Tag(ClockTypeId);
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis2 = toMillis(duration);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = set5(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clear(handle);
      return !completed;
    };
  }
};
var performanceNowNanos = /* @__PURE__ */ function() {
  const bigint1e6 = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e6;
  }
  const origin = "timeOrigin" in performance && typeof performance.timeOrigin === "number" ? /* @__PURE__ */ BigInt(/* @__PURE__ */ Math.round(performance.timeOrigin * 1e6)) : /* @__PURE__ */ BigInt(/* @__PURE__ */ Date.now()) * bigint1e6 - /* @__PURE__ */ BigInt(/* @__PURE__ */ Math.round(/* @__PURE__ */ performance.now() * 1e6));
  return () => origin + BigInt(Math.round(performance.now() * 1e6));
}();
var processOrPerformanceNow = /* @__PURE__ */ function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();
var ClockImpl = class {
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return succeed(globalClockScheduler);
  }
  sleep(duration) {
    return asyncEither((cb) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => cb(unit), duration);
      return left2(asUnit(sync(canceler)));
    });
  }
};
var make19 = () => new ClockImpl();

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/opCodes/configError.js
var OP_AND = "And";
var OP_OR = "Or";
var OP_INVALID_DATA = "InvalidData";
var OP_MISSING_DATA = "MissingData";
var OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
var OP_UNSUPPORTED = "Unsupported";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/configError.js
var ConfigErrorSymbolKey = "effect/ConfigError";
var ConfigErrorTypeId = /* @__PURE__ */ Symbol.for(ConfigErrorSymbolKey);
var proto2 = {
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
var And = (self, that) => {
  const error = Object.create(proto2);
  error._tag = OP_AND;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  return error;
};
var Or = (self, that) => {
  const error = Object.create(proto2);
  error._tag = OP_OR;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  return error;
};
var InvalidData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._tag = OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var MissingData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._tag = OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Missing data at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var SourceUnavailable = (path, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._tag = OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var Unsupported = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._tag = OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path2}: "${this.message}")`;
    }
  });
  return error;
};
var prefixed = /* @__PURE__ */ dual(2, (self, prefix) => {
  switch (self._tag) {
    case OP_AND: {
      return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self.path], self.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self.path], self.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self.path], self.message);
    }
  }
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
var empty15 = {
  _tag: "Empty"
};
var patch4 = /* @__PURE__ */ dual(2, (path, patch8) => {
  let input2 = of3(patch8);
  let output = path;
  while (isCons(input2)) {
    const patch9 = input2.head;
    switch (patch9._tag) {
      case "Empty": {
        input2 = input2.tail;
        break;
      }
      case "AndThen": {
        input2 = cons(patch9.first, cons(patch9.second, input2.tail));
        break;
      }
      case "MapName": {
        output = map2(output, patch9.f);
        input2 = input2.tail;
        break;
      }
      case "Nested": {
        output = prepend(output, patch9.name);
        input2 = input2.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output), contains(patch9.name));
        if (containsName) {
          output = tailNonEmpty(output);
          input2 = input2.tail;
        } else {
          return left2(MissingData(output, `Expected ${patch9.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right2(output);
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/opCodes/config.js
var OP_CONSTANT = "Constant";
var OP_FAIL2 = "Fail";
var OP_FALLBACK = "Fallback";
var OP_DESCRIBED = "Described";
var OP_LAZY = "Lazy";
var OP_MAP_OR_FAIL = "MapOrFail";
var OP_NESTED = "Nested";
var OP_PRIMITIVE = "Primitive";
var OP_SEQUENCE = "Sequence";
var OP_HASHMAP = "HashMap";
var OP_ZIP_WITH = "ZipWith";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/configProvider.js
var concat = (l, r) => [...l, ...r];
var ConfigProviderSymbolKey = "effect/ConfigProvider";
var ConfigProviderTypeId = /* @__PURE__ */ Symbol.for(ConfigProviderSymbolKey);
var configProviderTag = /* @__PURE__ */ Tag(ConfigProviderTypeId);
var FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
var FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for(FlatConfigProviderSymbolKey);
var make21 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path, config, split = true) => options.load(path, config, split),
  enumerateChildren: options.enumerateChildren
});
var fromFlat = (flat) => make21({
  load: (config) => flatMap6(fromFlatLoop(flat, empty(), config, false), (chunk2) => match(head(chunk2), {
    onNone: () => fail2(MissingData(empty(), `Expected a single value having structure: ${config}`)),
    onSome: succeed
  })),
  flattened: flat
});
var fromEnv = (config = {}) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, config);
  const makePathString = (path) => pipe(path, join(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt = pathString in current ? some2(current[pathString]) : none2();
    return pipe(valueOpt, mapError(() => MissingData(path, `Expected ${pathString} to exist in the process context`)), flatMap6((value) => parsePrimitive(value, path, primitive, seqDelim, split)));
  };
  const enumerateChildren = (path) => sync(() => {
    const current = getEnv();
    const keys5 = Object.keys(current);
    const keyPaths = Array.from(keys5).map((value) => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = pipe(path, unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === void 0 || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path.length, path.length + 1));
    return fromIterable5(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty15
  }));
};
var extend = (leftDef, rightDef, left3, right3) => {
  const leftPad = unfold(left3.length, (index2) => index2 >= right3.length ? none2() : some2([leftDef(index2), index2 + 1]));
  const rightPad = unfold(right3.length, (index2) => index2 >= left3.length ? none2() : some2([rightDef(index2), index2 + 1]));
  const leftExtension = concat(left3, leftPad);
  const rightExtension = concat(right3, rightPad);
  return [leftExtension, rightExtension];
};
var appendConfigPath = (path, config) => {
  let op = config;
  if (op._tag === "Nested") {
    const out = path.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path;
};
var fromFlatLoop = (flat, prefix, config, split) => {
  const op = config;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split));
    }
    case OP_FAIL2: {
      return fail2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(suspend(() => fromFlatLoop(flat, prefix, op.first, split)), catchAll((error1) => {
        if (op.condition(error1)) {
          return pipe(fromFlatLoop(flat, prefix, op.second, split), catchAll((error2) => fail2(Or(error1, error2))));
        }
        return fail2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split), flatMap6(forEachSequential((a) => pipe(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat(prefix, of(op.name)), op.config, split));
    }
    case OP_PRIMITIVE: {
      return pipe(patch4(prefix, flat.patch), flatMap6((prefix2) => pipe(flat.load(prefix2, op, split), flatMap6((values3) => {
        if (values3.length === 0) {
          const name = pipe(last(prefix2), getOrElse(() => "<n/a>"));
          return fail2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed(values3);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe(patch4(prefix, flat.patch), flatMap6((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap6(indicesFrom), flatMap6((indices) => {
        if (indices.length === 0) {
          return suspend(() => map9(fromFlatLoop(flat, patchedPrefix, op.config, true), of));
        }
        return pipe(forEachSequential(indices, (index2) => fromFlatLoop(flat, append(prefix, `[${index2}]`), op.config, true)), map9((chunkChunk) => {
          const flattened = flatten2(chunkChunk);
          if (flattened.length === 0) {
            return of(empty());
          }
          return of(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe(patch4(prefix, flat.patch), flatMap6((prefix2) => pipe(flat.enumerateChildren(prefix2), flatMap6((keys5) => {
        return pipe(keys5, forEachSequential((key2) => fromFlatLoop(flat, concat(prefix2, of(key2)), op.valueConfig, split)), map9((values3) => {
          if (values3.length === 0) {
            return of(empty8());
          }
          const matrix = values3.map((x) => Array.from(x));
          return pipe(transpose(matrix), map2((values4) => fromIterable6(zip(fromIterable(keys5), values4))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split), either2, flatMap6((left3) => pipe(fromFlatLoop(flat, prefix, op.right, split), either2, flatMap6((right3) => {
        if (isLeft2(left3) && isLeft2(right3)) {
          return fail2(And(left3.left, right3.left));
        }
        if (isLeft2(left3) && isRight2(right3)) {
          return fail2(left3.left);
        }
        if (isRight2(left3) && isLeft2(right3)) {
          return fail2(right3.left);
        }
        if (isRight2(left3) && isRight2(right3)) {
          const path = pipe(prefix, join("."));
          const fail4 = fromFlatLoopFail(prefix, path);
          const [lefts, rights] = extend(fail4, fail4, pipe(left3.right, map2(right2)), pipe(right3.right, map2(right2)));
          return pipe(lefts, zip(rights), forEachSequential(([left4, right4]) => pipe(zip2(left4, right4), map9(([left5, right5]) => op.zip(left5, right5)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
};
var fromFlatLoopFail = (prefix, path) => (index2) => left2(MissingData(prefix, `The element at index ${index2} in a sequence at path "${path}" was missing`));
var splitPathString = (text, delim) => {
  const split = text.split(new RegExp(`\\s*${escapeRegex(delim)}\\s*`));
  return split;
};
var parsePrimitive = (text, path, primitive, delimiter, split) => {
  if (!split) {
    return pipe(primitive.parse(text), mapBoth({
      onFailure: prefixed(path),
      onSuccess: of
    }));
  }
  return pipe(splitPathString(text, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError(prefixed(path)));
};
var transpose = (array3) => {
  return Object.keys(array3[0]).map((column) => array3.map((row) => row[column]));
};
var escapeRegex = (string3) => {
  return string3.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};
var indicesFrom = (quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth({
  onFailure: () => empty(),
  onSuccess: sort(Order)
}), either2, map9(merge));
var QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
var parseQuotedIndex = (str) => {
  const match7 = str.match(QUOTED_INDEX_REGEX);
  if (match7 !== null) {
    const matchedIndex = match7[2];
    return pipe(matchedIndex !== void 0 && matchedIndex.length > 0 ? some2(matchedIndex) : none2(), flatMap(parseInteger));
  }
  return none2();
};
var parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none2() : some2(parsedIndex);
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/defaultServices/console.js
var TypeId10 = /* @__PURE__ */ Symbol.for("effect/Console");
var consoleTag = /* @__PURE__ */ Tag(TypeId10);
var defaultConsole = {
  [TypeId10]: TypeId10,
  assert(condition, ...args) {
    return sync(() => {
      console.assert(condition, ...args);
    });
  },
  clear: /* @__PURE__ */ sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args) {
    return sync(() => {
      console.debug(...args);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args) {
    return sync(() => {
      console.dirxml(...args);
    });
  },
  error(...args) {
    return sync(() => {
      console.error(...args);
    });
  },
  group(options) {
    return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
  },
  groupEnd: /* @__PURE__ */ sync(() => {
    console.groupEnd();
  }),
  info(...args) {
    return sync(() => {
      console.info(...args);
    });
  },
  log(...args) {
    return sync(() => {
      console.log(...args);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args) {
    return sync(() => {
      console.timeLog(label, ...args);
    });
  },
  trace(...args) {
    return sync(() => {
      console.trace(...args);
    });
  },
  warn(...args) {
    return sync(() => {
      console.warn(...args);
    });
  },
  unsafe: console
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/random.js
var RandomSymbolKey = "effect/Random";
var RandomTypeId = /* @__PURE__ */ Symbol.for(RandomSymbolKey);
var randomTag = /* @__PURE__ */ Tag(RandomTypeId);
var RandomImpl = class {
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map9(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min2, max2) {
    return map9(this.next, (n) => (max2 - min2) * n + min2);
  }
  nextIntBetween(min2, max2) {
    return sync(() => this.PRNG.integer(max2 - min2) + min2);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};
var shuffleWith = (elements, nextIntBounded) => {
  return suspend(() => pipe(sync(() => Array.from(elements)), flatMap6((buffer) => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map9((k) => swap(buffer, n - 1, k)))), as(fromIterable2(buffer)));
  })));
};
var swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
var make22 = (seed) => new RandomImpl(seed);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/defaultServices.js
var liveServices = /* @__PURE__ */ pipe(/* @__PURE__ */ empty4(), /* @__PURE__ */ add2(clockTag, /* @__PURE__ */ make19()), /* @__PURE__ */ add2(consoleTag, defaultConsole), /* @__PURE__ */ add2(randomTag, /* @__PURE__ */ make22(/* @__PURE__ */ Math.random() * 4294967296 >>> 0)), /* @__PURE__ */ add2(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add2(tracerTag, nativeTracer));
var currentServices = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberRefs.js
var FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var FiberRefsImpl = class {
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = void 0;
  while (ret === void 0) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty(parentStack)[0];
      const parentAncestors = tailNonEmpty(parentStack);
      const childFiberId = headNonEmpty(childStack)[0];
      const childRefValue = headNonEmpty(childStack)[1];
      const childAncestors = tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
var joinAs = /* @__PURE__ */ dual(3, (self, fiberId2, that) => {
  const parentFiberRefs = new Map(self.locals);
  for (const [fiberRef, childStack] of that.locals) {
    const childValue = headNonEmpty(childStack)[1];
    if (!equals(headNonEmpty(childStack)[0], fiberId2)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals(childValue, fiberRef.initial)) {
          continue;
        }
        parentFiberRefs.set(fiberRef, [[fiberId2, fiberRef.join(fiberRef.initial, childValue)]]);
        continue;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch8 = fiberRef.diff(ancestor, childValue);
        const oldValue = headNonEmpty(parentStack)[1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch8)(oldValue));
        if (!equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = headNonEmpty(parentStack)[0];
          if (equals(parentFiberId, fiberId2)) {
            newStack = prepend([parentFiberId, newValue])(tailNonEmpty(parentStack));
          } else {
            newStack = prepend([fiberId2, newValue])(parentStack);
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  }
  return new FiberRefsImpl(new Map(parentFiberRefs));
});
var forkAs = /* @__PURE__ */ dual(2, (self, childId) => {
  const map12 = /* @__PURE__ */ new Map();
  for (const [fiberRef, stack] of self.locals.entries()) {
    const oldValue = headNonEmpty(stack)[1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals(oldValue, newValue)) {
      map12.set(fiberRef, stack);
    } else {
      map12.set(fiberRef, prepend([childId, newValue])(stack));
    }
  }
  return new FiberRefsImpl(map12);
});
var delete_ = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
var get9 = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return none2();
  }
  return some2(headNonEmpty(self.locals.get(fiberRef))[1]);
});
var getOrDefault = /* @__PURE__ */ dual(2, (self, fiberRef) => pipe(get9(self, fiberRef), getOrElse(() => fiberRef.initial)));
var updatedAs = /* @__PURE__ */ dual(2, (self, {
  fiberId: fiberId2,
  fiberRef,
  value
}) => {
  const oldStack = self.locals.has(fiberRef) ? self.locals.get(fiberRef) : empty();
  let newStack;
  if (isEmptyReadonlyArray(oldStack)) {
    newStack = of([fiberId2, value]);
  } else {
    const [currentId, currentValue] = headNonEmpty(oldStack);
    if (equals(currentId, fiberId2)) {
      if (equals(currentValue, value)) {
        return self;
      } else {
        newStack = prepend([fiberId2, value])(tailNonEmpty(oldStack));
      }
    } else {
      newStack = prepend([fiberId2, value])(oldStack);
    }
  }
  const locals = new Map(self.locals);
  return new FiberRefsImpl(locals.set(fiberRef, newStack));
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/FiberRefs.js
var getOrDefault2 = getOrDefault;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/LogLevel.js
var All = logLevelAll;
var Fatal = logLevelFatal;
var Error2 = logLevelError;
var Warning = logLevelWarning;
var Info = logLevelInfo;
var Debug = logLevelDebug;
var Trace = logLevelTrace;
var None3 = logLevelNone;
var Order2 = /* @__PURE__ */ pipe(Order, /* @__PURE__ */ mapInput2((level) => level.ordinal));
var greaterThan2 = /* @__PURE__ */ greaterThan(Order2);
var fromLiteral = (literal2) => {
  switch (literal2) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error2;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None3;
    case "Warning":
      return Warning;
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/logSpan.js
var render = (now) => {
  return (self) => {
    const label = self.label.replace(/[\s="]/g, "_");
    return `${label}=${now - self.startTime}ms`;
  };
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/LogSpan.js
var render2 = render;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberRefs/patch.js
var OP_EMPTY2 = "Empty";
var OP_ADD = "Add";
var OP_REMOVE = "Remove";
var OP_UPDATE = "Update";
var OP_AND_THEN = "AndThen";
var empty17 = {
  _tag: OP_EMPTY2
};
var diff4 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch8 = empty17;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== void 0) {
      const oldValue2 = headNonEmpty(old)[1];
      if (!equals(oldValue2, newValue2)) {
        patch8 = combine5({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch8);
      }
    } else {
      patch8 = combine5({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch8);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch8 = combine5({
      _tag: OP_REMOVE,
      fiberRef
    })(patch8);
  }
  return patch8;
};
var combine5 = /* @__PURE__ */ dual(2, (self, that) => ({
  _tag: OP_AND_THEN,
  first: self,
  second: that
}));
var patch5 = /* @__PURE__ */ dual(3, (self, fiberId2, oldValue) => {
  let fiberRefs2 = oldValue;
  let patches = of(self);
  while (isNonEmptyReadonlyArray(patches)) {
    const head3 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head3._tag) {
      case OP_EMPTY2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs2 = updatedAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs2 = delete_(fiberRefs2, head3.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault(fiberRefs2, head3.fiberRef);
        fiberRefs2 = updatedAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.fiberRef.patch(head3.patch)(value)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN: {
        patches = prepend(head3.first)(prepend(head3.second)(tail));
        break;
      }
    }
  }
  return fiberRefs2;
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/label.js
var MetricLabelSymbolKey = "effect/MetricLabel";
var MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
var MetricLabelImpl = class {
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  constructor(key2, value) {
    this.key = key2;
    this.value = value;
  }
  [symbol]() {
    return pipe(hash(MetricLabelSymbolKey), combine(hash(this.key)), combine(hash(this.value)));
  }
  [symbol2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make24 = (key2, value) => {
  return new MetricLabelImpl(key2, value);
};
var isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Effectable.js
var EffectTypeId3 = EffectTypeId;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/executionStrategy.js
var OP_SEQUENTIAL2 = "Sequential";
var OP_PARALLEL2 = "Parallel";
var OP_PARALLEL_N = "ParallelN";
var sequential2 = {
  _tag: OP_SEQUENTIAL2
};
var parallel2 = {
  _tag: OP_PARALLEL2
};
var parallelN = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/ExecutionStrategy.js
var sequential3 = sequential2;
var parallel3 = parallel2;
var parallelN2 = parallelN;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/FiberRefsPatch.js
var diff5 = diff4;
var patch6 = patch5;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberStatus.js
var FiberStatusSymbolKey = "effect/FiberStatus";
var FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
var OP_DONE = "Done";
var OP_RUNNING = "Running";
var OP_SUSPENDED = "Suspended";
var Done = class {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
};
var Running = class {
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags2) {
    this.runtimeFlags = runtimeFlags2;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
};
var Suspended = class {
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags2, blockingOn) {
    this.runtimeFlags = runtimeFlags2;
    this.blockingOn = blockingOn;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), combine(hash(this.blockingOn)));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals(this.blockingOn, that.blockingOn);
  }
};
var done2 = /* @__PURE__ */ new Done();
var running = (runtimeFlags2) => new Running(runtimeFlags2);
var suspended = (runtimeFlags2, blockingOn) => new Suspended(runtimeFlags2, blockingOn);
var isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
var isDone = (self) => self._tag === OP_DONE;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/FiberStatus.js
var done3 = done2;
var running2 = running;
var suspended2 = suspended;
var isDone2 = isDone;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Scheduler.js
var PriorityBuckets = class {
  /**
   * @since 2.0.0
   */
  buckets = [];
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    let bucket = void 0;
    let index2;
    for (index2 = 0; index2 < this.buckets.length; index2++) {
      if (this.buckets[index2][0] <= priority) {
        bucket = this.buckets[index2];
      } else {
        break;
      }
    }
    if (bucket) {
      bucket[1].push(task);
    } else {
      const newBuckets = [];
      for (let i = 0; i < index2; i++) {
        newBuckets.push(this.buckets[i]);
      }
      newBuckets.push([priority, [task]]);
      for (let i = index2; i < this.buckets.length; i++) {
        newBuckets.push(this.buckets[i]);
      }
      this.buckets = newBuckets;
    }
  }
};
var MixedScheduler = class {
  maxNextTickBeforeTimer;
  /**
   * @since 2.0.0
   */
  running = false;
  /**
   * @since 2.0.0
   */
  tasks = new PriorityBuckets();
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  /**
   * @since 2.0.0
   */
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      set5(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
};
var defaultScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
var currentScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/completedRequestMap.js
var currentRequestMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/concurrency.js
var match6 = (concurrency, sequential4, unbounded, bounded) => {
  switch (concurrency) {
    case void 0:
      return sequential4();
    case "unbounded":
      return unbounded();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" ? unbounded() : concurrency2 > 1 ? bounded(concurrency2) : sequential4());
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential4();
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberMessage.js
var OP_INTERRUPT_SIGNAL = "InterruptSignal";
var OP_STATEFUL = "Stateful";
var OP_RESUME = "Resume";
var OP_YIELD_NOW = "YieldNow";
var interruptSignal = (cause) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause
});
var stateful = (onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
});
var resume = (effect) => ({
  _tag: OP_RESUME,
  effect
});
var yieldNow2 = () => ({
  _tag: OP_YIELD_NOW
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberScope.js
var FiberScopeSymbolKey = "effect/FiberScope";
var FiberScopeTypeId = /* @__PURE__ */ Symbol.for(FiberScopeSymbolKey);
var Global = class {
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none4;
  roots = /* @__PURE__ */ new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
};
var Local = class {
  fiberId;
  parent;
  [FiberScopeTypeId] = FiberScopeTypeId;
  constructor(fiberId2, parent) {
    this.fiberId = fiberId2;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
};
var unsafeMake4 = (fiber) => {
  return new Local(fiber.id(), fiber);
};
var globalScope = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiber.js
var FiberSymbolKey = "effect/Fiber";
var FiberTypeId = /* @__PURE__ */ Symbol.for(FiberSymbolKey);
var fiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var fiberProto = {
  [FiberTypeId]: fiberVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var RuntimeFiberSymbolKey = "effect/Fiber";
var RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for(RuntimeFiberSymbolKey);
var _await = (self) => self.await;
var join2 = (self) => zipLeft(flatten4(self.await), self.inheritAll);
var never2 = {
  ...fiberProto,
  id: () => none4,
  await: never,
  children: /* @__PURE__ */ succeed([]),
  inheritAll: never,
  poll: /* @__PURE__ */ succeed(/* @__PURE__ */ none2()),
  interruptAsFork: () => never
};
var currentFiberURI = "effect/FiberCurrent";

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/logger.js
var LoggerSymbolKey = "effect/Logger";
var LoggerTypeId = /* @__PURE__ */ Symbol.for(LoggerSymbolKey);
var loggerVariance = {
  /* c8 ignore next */
  _Message: (_) => _,
  /* c8 ignore next */
  _Output: (_) => _
};
var makeLogger = (log) => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var none6 = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var stringLogger = /* @__PURE__ */ makeLogger(({
  annotations: annotations2,
  cause,
  date,
  fiberId: fiberId2,
  logLevel,
  message,
  spans
}) => {
  const nowMillis = date.getTime();
  const outputArray = [`timestamp=${date.toISOString()}`, `level=${logLevel.label}`, `fiber=${threadName(fiberId2)}`];
  let output = outputArray.join(" ");
  const stringMessage = serializeUnknown(message);
  if (stringMessage.length > 0) {
    output = output + " message=";
    output = appendQuoted(stringMessage, output);
  }
  if (cause != null && cause._tag !== "Empty") {
    output = output + " cause=";
    output = appendQuoted(pretty(cause), output);
  }
  if (isCons(spans)) {
    output = output + " ";
    let first2 = true;
    for (const span of spans) {
      if (first2) {
        first2 = false;
      } else {
        output = output + " ";
      }
      output = output + pipe(span, render2(nowMillis));
    }
  }
  if (pipe(annotations2, size4) > 0) {
    output = output + " ";
    let first2 = true;
    for (const [key2, value] of annotations2) {
      if (first2) {
        first2 = false;
      } else {
        output = output + " ";
      }
      output = output + filterKeyName(key2);
      output = output + "=";
      output = appendQuoted(serializeUnknown(value), output);
    }
  }
  return output;
});
var serializeUnknown = (u) => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u);
  } catch (_) {
    return String(u);
  }
};
var escapeDoubleQuotes = (str) => `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
var textOnly = /^[^\s"=]+$/;
var appendQuoted = (label, output) => output + (label.match(textOnly) ? label : escapeDoubleQuotes(label));
var filterKeyName = (key2) => key2.replace(/[\s="]/g, "_");

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/boundaries.js
var MetricBoundariesSymbolKey = "effect/MetricBoundaries";
var MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
var MetricBoundariesImpl = class {
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values3) {
    this.values = values3;
  }
  [symbol]() {
    return pipe(hash(MetricBoundariesSymbolKey), combine(hash(this.values)));
  }
  [symbol2](u) {
    return isMetricBoundaries(u) && equals(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
var fromChunk = (chunk2) => {
  const values3 = pipe(chunk2, appendAll(of2(Number.POSITIVE_INFINITY)), dedupe2);
  return new MetricBoundariesImpl(values3);
};
var exponential = (options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromChunk);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/keyType.js
var MetricKeyTypeSymbolKey = "effect/MetricKeyType";
var MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for(MetricKeyTypeSymbolKey);
var CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
var CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
var FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
var FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for(FrequencyKeyTypeSymbolKey);
var GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
var GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for(GaugeKeyTypeSymbolKey);
var HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
var HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
var SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
var SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for(SummaryKeyTypeSymbolKey);
var metricKeyTypeVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var CounterKeyType = class {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
  }
  [symbol]() {
    return hash(CounterKeyTypeSymbolKey);
  }
  [symbol2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FrequencyKeyType = class {
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [FrequencyKeyTypeTypeId] = FrequencyKeyTypeTypeId;
  [symbol]() {
    return hash(FrequencyKeyTypeSymbolKey);
  }
  [symbol2](that) {
    return isFrequencyKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeKeyType = class {
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [GaugeKeyTypeTypeId] = GaugeKeyTypeTypeId;
  constructor(bigint) {
    this.bigint = bigint;
  }
  [symbol]() {
    return hash(GaugeKeyTypeSymbolKey);
  }
  [symbol2](that) {
    return isGaugeKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramKeyType = class {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
  }
  [symbol]() {
    return pipe(hash(HistogramKeyTypeSymbolKey), combine(hash(this.boundaries)));
  }
  [symbol2](that) {
    return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryKeyType = class {
  maxAge;
  maxSize;
  error;
  quantiles;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [SummaryKeyTypeTypeId] = SummaryKeyTypeTypeId;
  constructor(maxAge, maxSize, error, quantiles) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
    this.error = error;
    this.quantiles = quantiles;
  }
  [symbol]() {
    return pipe(hash(SummaryKeyTypeSymbolKey), combine(hash(this.maxAge)), combine(hash(this.maxSize)), combine(hash(this.error)), combine(hash(this.quantiles)));
  }
  [symbol2](that) {
    return isSummaryKey(that) && equals(this.maxAge, that.maxAge) && this.maxSize === that.maxSize && this.error === that.error && equals(this.quantiles, that.quantiles);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter = (options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
var histogram = (boundaries) => {
  return new HistogramKeyType(boundaries);
};
var isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
var isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
var isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
var isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
var isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/key.js
var MetricKeySymbolKey = "effect/MetricKey";
var MetricKeyTypeId = /* @__PURE__ */ Symbol.for(MetricKeySymbolKey);
var metricKeyVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var MetricKeyImpl = class {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = empty7()) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
  }
  [symbol]() {
    return pipe(hash(this.name), combine(hash(this.keyType)), combine(hash(this.description)), combine(hash(this.tags)));
  }
  [symbol2](u) {
    return isMetricKey(u) && this.name === u.name && equals(this.keyType, u.keyType) && equals(this.description, u.description) && equals(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
var counter2 = (name, options) => new MetricKeyImpl(name, counter(options), fromNullable(options?.description));
var histogram2 = (name, boundaries, description) => new MetricKeyImpl(name, histogram(boundaries), fromNullable(description));
var taggedWithLabelSet = /* @__PURE__ */ dual(2, (self, extraTags) => size3(extraTags) === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, pipe(self.tags, union3(extraTags))));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/state.js
var MetricStateSymbolKey = "effect/MetricState";
var MetricStateTypeId = /* @__PURE__ */ Symbol.for(MetricStateSymbolKey);
var CounterStateSymbolKey = "effect/MetricState/Counter";
var CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
var FrequencyStateSymbolKey = "effect/MetricState/Frequency";
var FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
var GaugeStateSymbolKey = "effect/MetricState/Gauge";
var GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
var HistogramStateSymbolKey = "effect/MetricState/Histogram";
var HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
var SummaryStateSymbolKey = "effect/MetricState/Summary";
var SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
var metricStateVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var CounterState = class {
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [symbol]() {
    return pipe(hash(CounterStateSymbolKey), combine(hash(this.count)));
  }
  [symbol2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FrequencyState = class {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  [symbol]() {
    return pipe(hash(FrequencyStateSymbolKey), combine(hash(this.occurrences)));
  }
  [symbol2](that) {
    return isFrequencyState(that) && equals(this.occurrences, that.occurrences);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeState = class {
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [symbol]() {
    return pipe(hash(GaugeStateSymbolKey), combine(hash(this.value)));
  }
  [symbol2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramState = class {
  buckets;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [HistogramStateTypeId] = HistogramStateTypeId;
  constructor(buckets, count, min2, max2, sum) {
    this.buckets = buckets;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(HistogramStateSymbolKey), combine(hash(this.buckets)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)));
  }
  [symbol2](that) {
    return isHistogramState(that) && equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryState = class {
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [SummaryStateTypeId] = SummaryStateTypeId;
  constructor(error, quantiles, count, min2, max2, sum) {
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(SummaryStateSymbolKey), combine(hash(this.error)), combine(hash(this.quantiles)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)));
  }
  [symbol2](that) {
    return isSummaryState(that) && this.error === that.error && equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter3 = (count) => new CounterState(count);
var frequency2 = (occurrences) => {
  return new FrequencyState(occurrences);
};
var gauge2 = (count) => new GaugeState(count);
var histogram3 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
var summary2 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
var isCounterState = (u) => hasProperty(u, CounterStateTypeId);
var isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
var isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
var isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
var isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/hook.js
var MetricHookSymbolKey = "effect/MetricHook";
var MetricHookTypeId = /* @__PURE__ */ Symbol.for(MetricHookSymbolKey);
var metricHookVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var make25 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var bigint02 = /* @__PURE__ */ BigInt(0);
var counter4 = (key2) => {
  let sum = key2.keyType.bigint ? bigint02 : 0;
  const canUpdate = key2.keyType.incremental ? key2.keyType.bigint ? (value) => value >= bigint02 : (value) => value >= 0 : (_value) => true;
  return make25({
    get: () => counter3(sum),
    update: (value) => {
      if (canUpdate(value)) {
        sum = sum + value;
      }
    }
  });
};
var frequency3 = (_key) => {
  let count = 0;
  const values3 = /* @__PURE__ */ new Map();
  const update3 = (word) => {
    count = count + 1;
    const slotCount = values3.get(word) ?? 0;
    values3.set(word, slotCount + 1);
  };
  const snapshot = () => fromIterable6(values3.entries());
  return make25({
    get: () => frequency2(snapshot()),
    update: update3
  });
};
var gauge3 = (_key, startAt) => {
  let value = startAt;
  return make25({
    get: () => gauge2(value),
    update: (v) => {
      value = v;
    }
  });
};
var histogram4 = (key2) => {
  const bounds = key2.keyType.boundaries.values;
  const size7 = bounds.length;
  const values3 = new Uint32Array(size7 + 1);
  const boundaries = new Float32Array(size7);
  let count = 0;
  let sum = 0;
  let min2 = Number.MAX_VALUE;
  let max2 = Number.MIN_VALUE;
  pipe(bounds, sort2(Order), map3((n, i) => {
    boundaries[i] = n;
  }));
  const update3 = (value) => {
    let from2 = 0;
    let to2 = size7;
    while (from2 !== to2) {
      const mid = Math.floor(from2 + (to2 - from2) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to2 = mid;
      } else {
        from2 = mid;
      }
      if (to2 === from2 + 1) {
        if (value <= boundaries[from2]) {
          to2 = from2;
        } else {
          from2 = to2;
        }
      }
    }
    values3[from2] = values3[from2] + 1;
    count = count + 1;
    sum = sum + value;
    if (value < min2) {
      min2 = value;
    }
    if (value > max2) {
      max2 = value;
    }
  };
  const getBuckets = () => {
    const builder = Array(size7);
    let cumulated = 0;
    for (let i = 0; i < size7; i++) {
      const boundary = boundaries[i];
      const value = values3[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return unsafeFromArray(builder);
  };
  return make25({
    get: () => histogram3({
      buckets: getBuckets(),
      count,
      min: min2,
      max: max2,
      sum
    }),
    update: update3
  });
};
var summary3 = (key2) => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key2.keyType;
  const sortedQuantiles = pipe(quantiles, sort2(Order));
  const values3 = Array(maxSize);
  let head3 = 0;
  let count = 0;
  let sum = 0;
  let min2 = Number.MAX_VALUE;
  let max2 = Number.MIN_VALUE;
  const snapshot = (now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values3[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo(age, zero2) && age <= maxAge) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, pipe(unsafeFromArray(builder), sort2(Order)));
  };
  const observe = (value, timestamp) => {
    if (maxSize > 0) {
      head3 = head3 + 1;
      const target = head3 % maxSize;
      values3[target] = [timestamp, value];
    }
    count = count + 1;
    sum = sum + value;
    if (value < min2) {
      min2 = value;
    }
    if (value > max2) {
      max2 = value;
    }
  };
  return make25({
    get: () => summary2({
      error,
      quantiles: snapshot(Date.now()),
      count,
      min: min2,
      max: max2,
      sum
    }),
    update: ([value, timestamp]) => observe(value, timestamp)
  });
};
var calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (isEmpty(sortedQuantiles)) {
    return empty2();
  }
  const head3 = unsafeHead(sortedQuantiles);
  const tail = pipe(sortedQuantiles, drop(1));
  const resolved = pipe(tail, reduce(of2(resolveQuantile(error, sampleCount, none2(), 0, head3, sortedSamples)), (accumulator, quantile) => {
    const h = unsafeHead(accumulator);
    return pipe(accumulator, append2(resolveQuantile(error, sampleCount, h.value, h.consumed, quantile, h.rest)));
  }));
  return pipe(resolved, map3((rq) => [rq.quantile, rq.value]));
};
var resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (isEmpty(rest_1)) {
      return {
        quantile: quantile_1,
        value: none2(),
        consumed: consumed_1,
        rest: empty2()
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some2(unsafeLast(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: empty2()
      };
    }
    const sameHead = pipe(rest_1, splitWhere((n) => n > unsafeHead(rest_1)));
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head2(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      return {
        quantile: quantile_1,
        value: current_1,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head2(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head2(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/pair.js
var MetricPairSymbolKey = "effect/MetricPair";
var MetricPairTypeId = /* @__PURE__ */ Symbol.for(MetricPairSymbolKey);
var metricPairVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var unsafeMake5 = (metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments(this, arguments);
    }
  };
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric/registry.js
var MetricRegistrySymbolKey = "effect/MetricRegistry";
var MetricRegistryTypeId = /* @__PURE__ */ Symbol.for(MetricRegistrySymbolKey);
var MetricRegistryImpl = class {
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = empty14();
  snapshot() {
    const result = [];
    for (const [key2, hook] of this.map) {
      result.push(unsafeMake5(key2, hook.get()));
    }
    return fromIterable5(result);
  }
  get(key2) {
    const hook = pipe(this.map, get8(key2), getOrUndefined);
    if (hook == null) {
      if (isCounterKey(key2.keyType)) {
        return this.getCounter(key2);
      }
      if (isGaugeKey(key2.keyType)) {
        return this.getGauge(key2);
      }
      if (isFrequencyKey(key2.keyType)) {
        return this.getFrequency(key2);
      }
      if (isHistogramKey(key2.keyType)) {
        return this.getHistogram(key2);
      }
      if (isSummaryKey(key2.keyType)) {
        return this.getSummary(key2);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key2) {
    let value = pipe(this.map, get8(key2), getOrUndefined);
    if (value == null) {
      const counter6 = counter4(key2);
      if (!pipe(this.map, has4(key2))) {
        pipe(this.map, set4(key2, counter6));
      }
      value = counter6;
    }
    return value;
  }
  getFrequency(key2) {
    let value = pipe(this.map, get8(key2), getOrUndefined);
    if (value == null) {
      const frequency5 = frequency3(key2);
      if (!pipe(this.map, has4(key2))) {
        pipe(this.map, set4(key2, frequency5));
      }
      value = frequency5;
    }
    return value;
  }
  getGauge(key2) {
    let value = pipe(this.map, get8(key2), getOrUndefined);
    if (value == null) {
      const gauge5 = gauge3(key2, key2.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has4(key2))) {
        pipe(this.map, set4(key2, gauge5));
      }
      value = gauge5;
    }
    return value;
  }
  getHistogram(key2) {
    let value = pipe(this.map, get8(key2), getOrUndefined);
    if (value == null) {
      const histogram6 = histogram4(key2);
      if (!pipe(this.map, has4(key2))) {
        pipe(this.map, set4(key2, histogram6));
      }
      value = histogram6;
    }
    return value;
  }
  getSummary(key2) {
    let value = pipe(this.map, get8(key2), getOrUndefined);
    if (value == null) {
      const summary5 = summary3(key2);
      if (!pipe(this.map, has4(key2))) {
        pipe(this.map, set4(key2, summary5));
      }
      value = summary5;
    }
    return value;
  }
};
var make26 = () => {
  return new MetricRegistryImpl();
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/metric.js
var MetricSymbolKey = "effect/Metric";
var MetricTypeId = /* @__PURE__ */ Symbol.for(MetricSymbolKey);
var metricVariance = {
  /* c8 ignore next */
  _Type: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var globalMetricRegistry = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make26());
var make27 = function(keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign((effect) => tap(effect, (a) => sync(() => unsafeUpdate(a, empty7()))), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    register() {
      this.unsafeValue(empty7());
      return this;
    },
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
};
var counter5 = (name, options) => fromMetricKey(counter2(name, options));
var fromMetricKey = (key2) => {
  const hook = (extraTags) => {
    const fullKey = pipe(key2, taggedWithLabelSet(extraTags));
    return globalMetricRegistry.get(fullKey);
  };
  return make27(key2.keyType, (input2, extraTags) => hook(extraTags).update(input2), (extraTags) => hook(extraTags).get());
};
var histogram5 = (name, boundaries, description) => fromMetricKey(histogram2(name, boundaries, description));
var tagged = /* @__PURE__ */ dual(3, (self, key2, value) => taggedWithLabels(self, make9(make24(key2, value))));
var taggedWithLabels = /* @__PURE__ */ dual(2, (self, extraTagsIterable) => {
  const extraTags = isHashSet2(extraTagsIterable) ? extraTagsIterable : fromIterable5(extraTagsIterable);
  return make27(self.keyType, (input2, extraTags1) => self.unsafeUpdate(input2, pipe(extraTags, union3(extraTags1))), (extraTags1) => self.unsafeValue(pipe(extraTags, union3(extraTags1))));
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/request.js
var RequestSymbolKey = "effect/Request";
var RequestTypeId = /* @__PURE__ */ Symbol.for(RequestSymbolKey);
var requestVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var RequestPrototype = {
  ...StructuralPrototype,
  [RequestTypeId]: requestVariance
};
var complete = /* @__PURE__ */ dual(2, (self, result) => fiberRefGetWith(currentRequestMap, (map12) => sync(() => {
  if (map12.has(self)) {
    const entry = map12.get(self);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/redBlackTree/iterator.js
var Direction = {
  Forward: 0,
  Backward: 1 << 0
};
var RedBlackTreeIterator = class _RedBlackTreeIterator {
  self;
  stack;
  direction;
  count = 0;
  constructor(self, stack, direction) {
    this.self = self;
    this.stack = stack;
    this.direction = direction;
  }
  /**
   * Clones the iterator
   */
  clone() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction);
  }
  /**
   * Reverse the traversal direction
   */
  reversed() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction === Direction.Forward ? Direction.Backward : Direction.Forward);
  }
  /**
   * Iterator next
   */
  next() {
    const entry = this.entry;
    this.count++;
    if (this.direction === Direction.Forward) {
      this.moveNext();
    } else {
      this.movePrev();
    }
    switch (entry._tag) {
      case "None": {
        return {
          done: true,
          value: this.count
        };
      }
      case "Some": {
        return {
          done: false,
          value: entry.value
        };
      }
    }
  }
  /**
   * Returns the key
   */
  get key() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].key);
    }
    return none2();
  }
  /**
   * Returns the value
   */
  get value() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].value);
    }
    return none2();
  }
  /**
   * Returns the key
   */
  get entry() {
    return map(last(this.stack), (node) => [node.key, node.value]);
  }
  /**
   * Returns the position of this iterator in the sorted list
   */
  get index() {
    let idx = 0;
    const stack = this.stack;
    if (stack.length === 0) {
      const r = this.self._root;
      if (r != null) {
        return r.count;
      }
      return 0;
    } else if (stack[stack.length - 1].left != null) {
      idx = stack[stack.length - 1].left.count;
    }
    for (let s = stack.length - 2; s >= 0; --s) {
      if (stack[s + 1] === stack[s].right) {
        ;
        ++idx;
        if (stack[s].left != null) {
          idx += stack[s].left.count;
        }
      }
    }
    return idx;
  }
  /**
   * Advances iterator to next element in list
   */
  moveNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n.right != null) {
      n = n.right;
      while (n != null) {
        stack.push(n);
        n = n.left;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].right === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a next element
   */
  get hasNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].right != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].left === stack[s]) {
        return true;
      }
    }
    return false;
  }
  /**
   * Advances iterator to previous element in list
   */
  movePrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n != null && n.left != null) {
      n = n.left;
      while (n != null) {
        stack.push(n);
        n = n.right;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].left === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a previous element
   */
  get hasPrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].left != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].right === stack[s]) {
        return true;
      }
    }
    return false;
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/redBlackTree/node.js
var Color = {
  Red: 0,
  Black: 1 << 0
};
var Node = class {
  color;
  key;
  value;
  left;
  right;
  count;
  constructor(color, key2, value, left3, right3, count) {
    this.color = color;
    this.key = key2;
    this.value = value;
    this.left = left3;
    this.right = right3;
    this.count = count;
  }
};
function clone(node) {
  return new Node(node.color, node.key, node.value, node.left, node.right, node.count);
}
function swap2(n, v) {
  n.key = v.key;
  n.value = v.value;
  n.left = v.left;
  n.right = v.right;
  n.color = v.color;
  n.count = v.count;
}
function repaint(node, color) {
  return new Node(color, node.key, node.value, node.left, node.right, node.count);
}
function recount(node) {
  node.count = 1 + (node.left?.count ?? 0) + (node.right?.count ?? 0);
}

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/redBlackTree.js
var RedBlackTreeSymbolKey = "effect/RedBlackTree";
var RedBlackTreeTypeId = /* @__PURE__ */ Symbol.for(RedBlackTreeSymbolKey);
var redBlackTreeVariance = {
  /* c8 ignore next */
  _Key: (_) => _,
  /* c8 ignore next */
  _Value: (_) => _
};
var RedBlackTreeProto = {
  [RedBlackTreeTypeId]: redBlackTreeVariance,
  [symbol]() {
    let hash2 = hash(RedBlackTreeSymbolKey);
    for (const item of this) {
      hash2 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return hash2;
  },
  [symbol2](that) {
    if (isRedBlackTree(that)) {
      if ((this._root?.count ?? 0) !== (that._root?.count ?? 0)) {
        return false;
      }
      const entries2 = Array.from(that);
      return Array.from(this).every((itemSelf, i) => {
        const itemThat = entries2[i];
        return equals(itemSelf[0], itemThat[0]) && equals(itemSelf[1], itemThat[1]);
      });
    }
    return false;
  },
  [Symbol.iterator]() {
    const stack = [];
    let n = this._root;
    while (n != null) {
      stack.push(n);
      n = n.left;
    }
    return new RedBlackTreeIterator(this, stack, Direction.Forward);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "RedBlackTree",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl3 = (ord, root) => {
  const tree = Object.create(RedBlackTreeProto);
  tree._ord = ord;
  tree._root = root;
  return tree;
};
var isRedBlackTree = (u) => hasProperty(u, RedBlackTreeTypeId);
var findFirst3 = /* @__PURE__ */ dual(2, (self, key2) => {
  const cmp = self._ord;
  let node = self._root;
  while (node !== void 0) {
    const d = cmp(key2, node.key);
    if (equals(key2, node.key)) {
      return some2(node.value);
    }
    if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return none2();
});
var has5 = /* @__PURE__ */ dual(2, (self, key2) => isSome2(findFirst3(self, key2)));
var insert = /* @__PURE__ */ dual(3, (self, key2, value) => {
  const cmp = self._ord;
  let n = self._root;
  const n_stack = [];
  const d_stack = [];
  while (n != null) {
    const d = cmp(key2, n.key);
    n_stack.push(n);
    d_stack.push(d);
    if (d <= 0) {
      n = n.left;
    } else {
      n = n.right;
    }
  }
  n_stack.push(new Node(Color.Red, key2, value, void 0, void 0, 1));
  for (let s = n_stack.length - 2; s >= 0; --s) {
    const n2 = n_stack[s];
    if (d_stack[s] <= 0) {
      n_stack[s] = new Node(n2.color, n2.key, n2.value, n_stack[s + 1], n2.right, n2.count + 1);
    } else {
      n_stack[s] = new Node(n2.color, n2.key, n2.value, n2.left, n_stack[s + 1], n2.count + 1);
    }
  }
  for (let s = n_stack.length - 1; s > 1; --s) {
    const p = n_stack[s - 1];
    const n3 = n_stack[s];
    if (p.color === Color.Black || n3.color === Color.Black) {
      break;
    }
    const pp = n_stack[s - 2];
    if (pp.left === p) {
      if (p.left === n3) {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.left = p.right;
          p.color = Color.Black;
          p.right = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = p;
            } else {
              ppp.right = p;
            }
          }
          break;
        }
      } else {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.right = n3.left;
          pp.color = Color.Red;
          pp.left = n3.right;
          n3.color = Color.Black;
          n3.left = p;
          n3.right = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = n3;
            } else {
              ppp.right = n3;
            }
          }
          break;
        }
      }
    } else {
      if (p.right === n3) {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.right = p.left;
          p.color = Color.Black;
          p.left = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = p;
            } else {
              ppp.left = p;
            }
          }
          break;
        }
      } else {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.left = n3.right;
          pp.color = Color.Red;
          pp.right = n3.left;
          n3.color = Color.Black;
          n3.right = p;
          n3.left = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = n3;
            } else {
              ppp.left = n3;
            }
          }
          break;
        }
      }
    }
  }
  n_stack[0].color = Color.Black;
  return makeImpl3(self._ord, n_stack[0]);
});
var keysForward = (self) => keys3(self, Direction.Forward);
var keys3 = (self, direction) => {
  const begin = self[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => keys3(self, direction),
    next: () => {
      count++;
      const entry = begin.key;
      if (direction === Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None": {
          return {
            done: true,
            value: count
          };
        }
        case "Some": {
          return {
            done: false,
            value: entry.value
          };
        }
      }
    }
  };
};
var removeFirst = /* @__PURE__ */ dual(2, (self, key2) => {
  if (!has5(self, key2)) {
    return self;
  }
  const ord = self._ord;
  const cmp = ord;
  let node = self._root;
  const stack = [];
  while (node !== void 0) {
    const d = cmp(key2, node.key);
    stack.push(node);
    if (equals(key2, node.key)) {
      node = void 0;
    } else if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  if (stack.length === 0) {
    return self;
  }
  const cstack = new Array(stack.length);
  let n = stack[stack.length - 1];
  cstack[cstack.length - 1] = new Node(n.color, n.key, n.value, n.left, n.right, n.count);
  for (let i = stack.length - 2; i >= 0; --i) {
    n = stack[i];
    if (n.left === stack[i + 1]) {
      cstack[i] = new Node(n.color, n.key, n.value, cstack[i + 1], n.right, n.count);
    } else {
      cstack[i] = new Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count);
    }
  }
  n = cstack[cstack.length - 1];
  if (n.left !== void 0 && n.right !== void 0) {
    const split = cstack.length;
    n = n.left;
    while (n.right != null) {
      cstack.push(n);
      n = n.right;
    }
    const v = cstack[split - 1];
    cstack.push(new Node(n.color, v.key, v.value, n.left, n.right, n.count));
    cstack[split - 1].key = n.key;
    cstack[split - 1].value = n.value;
    for (let i = cstack.length - 2; i >= split; --i) {
      n = cstack[i];
      cstack[i] = new Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count);
    }
    cstack[split - 1].left = cstack[split];
  }
  n = cstack[cstack.length - 1];
  if (n.color === Color.Red) {
    const p = cstack[cstack.length - 2];
    if (p.left === n) {
      p.left = void 0;
    } else if (p.right === n) {
      p.right = void 0;
    }
    cstack.pop();
    for (let i = 0; i < cstack.length; ++i) {
      cstack[i].count--;
    }
    return makeImpl3(ord, cstack[0]);
  } else {
    if (n.left !== void 0 || n.right !== void 0) {
      if (n.left !== void 0) {
        swap2(n, n.left);
      } else if (n.right !== void 0) {
        swap2(n, n.right);
      }
      n.color = Color.Black;
      for (let i = 0; i < cstack.length - 1; ++i) {
        cstack[i].count--;
      }
      return makeImpl3(ord, cstack[0]);
    } else if (cstack.length === 1) {
      return makeImpl3(ord, void 0);
    } else {
      for (let i = 0; i < cstack.length; ++i) {
        cstack[i].count--;
      }
      const parent = cstack[cstack.length - 2];
      fixDoubleBlack(cstack);
      if (parent.left === n) {
        parent.left = void 0;
      } else {
        parent.right = void 0;
      }
    }
  }
  return makeImpl3(ord, cstack[0]);
});
var fixDoubleBlack = (stack) => {
  let n, p, s, z;
  for (let i = stack.length - 1; i >= 0; --i) {
    n = stack[i];
    if (i === 0) {
      n.color = Color.Black;
      return;
    }
    p = stack[i - 1];
    if (p.left === n) {
      s = p.right;
      if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.right = clone(s);
        z = s.right = clone(s.right);
        p.right = s.left;
        s.left = p;
        s.right = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.right = clone(s);
        z = s.left = clone(s.left);
        p.right = z.left;
        s.left = z.right;
        z.left = p;
        z.right = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = z;
          } else {
            pp.right = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.right = repaint(s, Color.Red);
          return;
        } else {
          p.right = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone(s);
        p.right = s.left;
        s.left = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    } else {
      s = p.left;
      if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.left = clone(s);
        z = s.left = clone(s.left);
        p.left = s.right;
        s.right = p;
        s.left = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.left = clone(s);
        z = s.right = clone(s.right);
        p.left = z.right;
        s.right = z.left;
        z.right = p;
        z.left = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = z;
          } else {
            pp.left = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.left = repaint(s, Color.Red);
          return;
        } else {
          p.left = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone(s);
        p.left = s.right;
        s.right = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    }
  }
};

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/RedBlackTree.js
var has6 = has5;
var insert2 = insert;
var keys4 = keysForward;
var removeFirst2 = removeFirst;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/SortedSet.js
var TypeId11 = /* @__PURE__ */ Symbol.for("effect/SortedSet");
var SortedSetProto = {
  [TypeId11]: {
    _A: (_) => _
  },
  [symbol]() {
    return pipe(hash(this.keyTree), combine(hash(TypeId11)));
  },
  [symbol2](that) {
    return isSortedSet(that) && equals(this.keyTree, that.keyTree);
  },
  [Symbol.iterator]() {
    return keys4(this.keyTree);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromTree = (keyTree) => {
  const a = Object.create(SortedSetProto);
  a.keyTree = keyTree;
  return a;
};
var isSortedSet = (u) => hasProperty(u, TypeId11);
var add5 = /* @__PURE__ */ dual(2, (self, value) => has6(self.keyTree, value) ? self : fromTree(insert2(self.keyTree, value, true)));
var remove6 = /* @__PURE__ */ dual(2, (self, value) => fromTree(removeFirst2(self.keyTree, value)));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/supervisor.js
var SupervisorSymbolKey = "effect/Supervisor";
var SupervisorTypeId = /* @__PURE__ */ Symbol.for(SupervisorSymbolKey);
var supervisorVariance = {
  /* c8 ignore next */
  _T: (_) => _
};
var ProxySupervisor = class _ProxySupervisor {
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context2, effect, parent, fiber) {
    this.underlying.onStart(context2, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new _ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
};
var Zip = class _Zip {
  left;
  right;
  _tag = "Zip";
  [SupervisorTypeId] = supervisorVariance;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  get value() {
    return zip2(this.left.value, this.right.value);
  }
  onStart(context2, effect, parent, fiber) {
    this.left.onStart(context2, effect, parent, fiber);
    this.right.onStart(context2, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new _Zip(this, right3);
  }
};
var isZip = (self) => hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
var Track = class {
  [SupervisorTypeId] = supervisorVariance;
  fibers = /* @__PURE__ */ new Set();
  get value() {
    return sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var Const = class {
  effect;
  [SupervisorTypeId] = supervisorVariance;
  constructor(effect) {
    this.effect = effect;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var FibersIn = class {
  ref;
  [SupervisorTypeId] = supervisorVariance;
  constructor(ref) {
    this.ref = ref;
  }
  get value() {
    return sync(() => get6(this.ref));
  }
  onStart(_context, _effect, _parent, fiber) {
    pipe(this.ref, set2(pipe(get6(this.ref), add5(fiber))));
  }
  onEnd(_value, fiber) {
    pipe(this.ref, set2(pipe(get6(this.ref), remove6(fiber))));
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var fromEffect = (effect) => {
  return new Const(effect);
};
var none7 = /* @__PURE__ */ globalValue("effect/Supervisor/none", () => fromEffect(unit));

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Differ.js
var make29 = make13;

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/supervisor/patch.js
var OP_EMPTY3 = "Empty";
var OP_ADD_SUPERVISOR = "AddSupervisor";
var OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
var OP_AND_THEN2 = "AndThen";
var empty20 = {
  _tag: OP_EMPTY3
};
var combine6 = (self, that) => {
  return {
    _tag: OP_AND_THEN2,
    first: self,
    second: that
  };
};
var patch7 = (self, supervisor) => {
  return patchLoop(supervisor, of2(self));
};
var patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty(patches)) {
    const head3 = headNonEmpty2(patches);
    switch (head3._tag) {
      case OP_EMPTY3: {
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head3.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head3.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_AND_THEN2: {
        patches = prepend2(head3.first)(prepend2(head3.second)(tailNonEmpty2(patches)));
        break;
      }
    }
  }
  return supervisor;
};
var removeSupervisor = (self, that) => {
  if (equals(self, that)) {
    return none7;
  } else {
    if (isZip(self)) {
      return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
    } else {
      return self;
    }
  }
};
var toSet2 = (self) => {
  if (equals(self, none7)) {
    return empty7();
  } else {
    if (isZip(self)) {
      return pipe(toSet2(self.left), union3(toSet2(self.right)));
    } else {
      return make9(self);
    }
  }
};
var diff6 = (oldValue, newValue) => {
  if (equals(oldValue, newValue)) {
    return empty20;
  }
  const oldSupervisors = toSet2(oldValue);
  const newSupervisors = toSet2(newValue);
  const added = pipe(newSupervisors, difference2(oldSupervisors), reduce4(empty20, (patch8, supervisor) => combine6(patch8, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe(oldSupervisors, difference2(newSupervisors), reduce4(empty20, (patch8, supervisor) => combine6(patch8, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine6(added, removed);
};
var differ2 = /* @__PURE__ */ make29({
  empty: empty20,
  patch: patch7,
  combine: combine6,
  diff: diff6
});

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/internal/fiberRuntime.js
var fiberStarted = /* @__PURE__ */ counter5("effect_fiber_started");
var fiberActive = /* @__PURE__ */ counter5("effect_fiber_active");
var fiberSuccesses = /* @__PURE__ */ counter5("effect_fiber_successes");
var fiberFailures = /* @__PURE__ */ counter5("effect_fiber_failures");
var fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram5("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
  start: 1,
  factor: 1.3,
  count: 100
})), "time_unit", "milliseconds");
var EvaluationSignalContinue = "Continue";
var EvaluationSignalDone = "Done";
var EvaluationSignalYieldNow = "Yield";
var runtimeFiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var absurd = (_) => {
  throw new Error(`BUG: FiberRuntime - ${JSON.stringify(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
var contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => {
    return cont.i1(value);
  },
  ["OnStep"]: (_, _cont, value) => {
    return exitSucceed(exitSucceed(value));
  },
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return cont.i2(value);
  },
  [OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self._runtimeFlags, cont.patch);
    if (interruptible(self._runtimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self, cont, value) => {
    cont.i2(value);
    if (cont.i0()) {
      self.pushStack(cont);
      return cont.i1();
    } else {
      return unit;
    }
  }
};
var drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self, runtimeFlags2, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return interruptible(runtimeFlags2) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self, runtimeFlags2, cur, message) => {
    message.onFiber(self, running2(runtimeFlags2));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap6(yieldNow(), () => cur);
  }
};
var runBlockedRequests = (self) => forEachSequentialDiscard(flatten3(self), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential4]) => {
  const map12 = /* @__PURE__ */ new Map();
  for (const block of sequential4) {
    for (const entry of block) {
      map12.set(entry.request, entry);
    }
  }
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(sequential4), sequential4.flat()), currentRequestMap, map12);
}, false, false));
var FiberRuntime = class {
  [FiberTypeId] = fiberVariance;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  pipe() {
    return pipeArguments(this, arguments);
  }
  _fiberRefs;
  _fiberId;
  _runtimeFlags;
  _queue = new Array();
  _children = null;
  _observers = new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _supervisor;
  _scheduler;
  _tracer;
  currentOpCount = 0;
  isYielding = false;
  constructor(fiberId2, fiberRefs0, runtimeFlags0) {
    this._runtimeFlags = runtimeFlags0;
    this._fiberId = fiberId2;
    this._fiberRefs = fiberRefs0;
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this._tracer = get4(this.getFiberRef(currentServices), tracerTag);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect) {
    this.tell(resume(effect));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((_, status) => status);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((state, status) => {
      if (isDone2(status)) {
        return state._runtimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return unsafeMake4(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = /* @__PURE__ */ new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status) => {
        deferredUnsafeDone(deferred, sync(() => f(fiber, status)));
      }));
      return deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async((resume2) => {
      const cb = (exit2) => resume2(succeed(exit2));
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch8 = pipe(
        diff3(parentRuntimeFlags, updatedRuntimeFlags),
        // Do not inherit WindDown or Interruption!
        exclude2(Interruption),
        exclude2(WindDown)
      );
      return updateRuntimeFlags(patch8);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return sync(() => fromNullable(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId2) {
    return sync(() => this.tell(interruptSignal(interrupt(fiberId2))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(fiberId2) {
    this.tell(interruptSignal(interrupt(fiberId2)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this._runtimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updatedAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this._tracer = get4(this.getFiberRef(currentServices), tracerTag);
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs2) {
    this._fiberRefs = fiberRefs2;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child) {
    this.getChildren().add(child);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child) {
    this.getChildren().delete(child);
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this._scheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags2, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags2, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !isEmpty5(this.getFiberRef(currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone3 = false;
      const body = () => {
        const next = it.next();
        if (!next.done) {
          return asUnit(next.value.await);
        } else {
          return sync(() => {
            isDone3 = true;
          });
        }
      };
      return whileLoop({
        while: () => !isDone3,
        body,
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(exit2) {
    if (runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit2._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit2._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit2.cause) && level._tag === "Some") {
        this.log("Fiber terminated with a non handled error", exit2.cause, level);
      }
    }
  }
  setExitValue(exit2) {
    this._exitValue = exit2;
    if (runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = (/* @__PURE__ */ new Date()).getTime();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
    }
    this.reportExitValue(exit2);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit2);
    }
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = isSome2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan2(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations2 = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size3(loggers) > 0) {
      const clockService = get4(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      for (const logger of loggers) {
        logger.log({
          fiberId: this.id(),
          logLevel,
          message,
          cause,
          context: contextMap,
          spans,
          annotations: annotations2,
          date
        });
      }
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done3 : suspended2(this._runtimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this._supervisor.onResume(this);
    try {
      let effect = interruptible(this._runtimeFlags) && this.isInterrupted() ? exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        try {
          const eff = effect;
          const exit2 = this.runLoop(eff);
          this._runtimeFlags = pipe(this._runtimeFlags, enable2(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect = flatMap6(interruption2, () => exit2);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit2);
            } else {
              this.tell(resume(exit2));
            }
            effect = null;
          }
        } catch (e) {
          if (isEffect(e)) {
            if (e._op === OP_YIELD) {
              if (cooperativeYielding(this._runtimeFlags)) {
                this.tell(yieldNow2());
                this.tell(resume(exitUnit));
                effect = null;
              } else {
                effect = exitUnit;
              }
            } else if (e._op === OP_ASYNC) {
              effect = null;
            }
          } else {
            throw e;
          }
        }
      }
    } finally {
      this._supervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect) {
    this.tell(resume(effect));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch8) {
    const newRuntimeFlags = patch3(oldRuntimeFlags, patch8);
    globalThis[currentFiberURI] = this;
    this._runtimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags2, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    };
    if (interruptible(runtimeFlags2)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this._runtimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return map9(fiberRefGet(currentContext), (context2) => unsafeGet4(context2, op));
  }
  ["Left"](op) {
    return fail2(op.left);
  }
  ["None"](_) {
    return fail2(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  [OP_SYNC](op) {
    const value = op.i0();
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      throw exitSucceed(value);
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.i0);
    } else {
      throw oldCur;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.i0;
    const cont = this.getNextFailCont();
    if (cont !== void 0) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible(this._runtimeFlags) && this.isInterrupted())) {
            return cont.i1(cause);
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible(this._runtimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this._runtimeFlags, cont.patch);
          if (interruptible(this._runtimeFlags) && this.isInterrupted()) {
            return exitFailCause(sequential(cause, this.getInterruptedCause()));
          } else {
            return exitFailCause(cause);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      throw exitFailCause(cause);
    }
  }
  [OP_WITH_RUNTIME](op) {
    return op.i0(this, running2(this._runtimeFlags));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this._runtimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this._runtimeFlags = snap.flags;
      const patchRefs = diff5(snap.refs, refs);
      const patchFlags = diff3(snap.flags, flags);
      return exitSucceed(blocked(op.i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch6(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber._runtimeFlags = patch3(patchFlags)(newFiber._runtimeFlags);
        return op.i1;
      })));
    }
    return uninterruptibleMask((restore) => flatMap6(forkDaemon(runRequestBlock(op.i0)), () => restore(op.i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.i0;
    const oldRuntimeFlags = this._runtimeFlags;
    const newRuntimeFlags = patch3(oldRuntimeFlags, updateFlags);
    if (interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
      if (op.i1) {
        const revertFlags = diff3(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return op.i1(oldRuntimeFlags);
      } else {
        return exitUnit;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.i1;
    this.initiateAsync(this._runtimeFlags, op.i0);
    throw op;
  }
  [OP_YIELD](op) {
    this.isYielding = false;
    throw op;
  }
  [OP_WHILE](op) {
    const check = op.i0;
    const body = op.i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitUnit;
    }
  }
  [OP_COMMIT](op) {
    return op.commit();
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this._runtimeFlags & OpSupervision) !== 0) {
        this._supervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this._runtimeFlags, cur);
      }
      if (!this.isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this._scheduler.shouldYield(this);
        if (shouldYield !== false) {
          this.isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap6(yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        if (!("_op" in cur) || !(cur._op in this)) {
          absurd(cur);
        }
        cur = this._tracer.context(() => {
          if (moduleVersion !== cur[EffectTypeId3]._V) {
            return dieMessage(`Cannot execute an Effect versioned ${cur[EffectTypeId3]._V} with a Runtime of version ${moduleVersion}`);
          }
          return this[cur._op](cur);
        }, this);
      } catch (e) {
        if (isEffect(e)) {
          if (e._op === OP_YIELD || e._op === OP_ASYNC) {
            throw e;
          } else if (e._op === OP_SUCCESS || e._op === OP_FAILURE) {
            return e;
          } else {
            cur = exitFailCause(die(e));
          }
        } else if (isEffectError(e)) {
          cur = exitFailCause(e.cause);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential(die(e), interrupt(none4)));
        } else {
          cur = exitFailCause(die(e));
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
};
var currentMinimumLogLevel = /* @__PURE__ */ globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
var getConsole = (refs) => {
  const defaultServicesValue = getOrDefault2(refs, currentServices);
  const cnsl = get4(defaultServicesValue, consoleTag);
  return cnsl.unsafe;
};
var defaultLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => makeLogger((options) => {
  const formatted = stringLogger.log(options);
  getConsole(options.context).log(formatted);
}));
var tracerLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations: annotations2,
  cause,
  context: context2,
  fiberId: fiberId2,
  logLevel,
  message
}) => {
  const span = flatMap(get9(context2, currentContext), getOption2(spanTag));
  const clockService = map(get9(context2, currentServices), (_) => get4(_, clockTag));
  if (span._tag === "None" || span.value._tag === "ExternalSpan" || clockService._tag === "None") {
    return;
  }
  const attributes = Object.fromEntries(map6(annotations2, (value) => serializeUnknown(value)));
  attributes["effect.fiberId"] = threadName2(fiberId2);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause !== null && cause._tag !== "Empty") {
    attributes["effect.cause"] = pretty(cause);
  }
  span.value.event(String(message), clockService.value.unsafeCurrentTimeNanos(), attributes);
}));
var currentLoggers = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make9(defaultLogger, tracerLogger)));
var forEach5 = /* @__PURE__ */ dual((args) => isIterable(args[0]), (self, f, options) => withFiberRuntime((r) => {
  const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
  if (options?.discard) {
    return match6(options.concurrency, () => finalizersMask(sequential3)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMask(parallel3)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMask(parallelN2(n))((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
  }
  return match6(options?.concurrency, () => finalizersMask(sequential3)((restore) => isRequestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMask(parallel3)((restore) => forEachParUnbounded(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMask(parallelN2(n))((restore) => forEachParN(self, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
var forEachParUnbounded = (self, f, batching) => suspend(() => {
  const as2 = fromIterable(self);
  const array3 = new Array(as2.length);
  const fn = (a, i) => flatMap6(f(a, i), (b) => sync(() => array3[i] = b));
  return zipRight(forEachConcurrentDiscard(as2, fn, batching, false), succeed(array3));
});
var forEachConcurrentDiscard = (self, f, batching, processAll, n) => uninterruptibleMask((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self).reverse();
  let target = todos.length;
  if (target === 0) {
    return unit;
  }
  let counter6 = 0;
  let interrupted = false;
  const fibersCount = n ? Math.min(todos.length, n) : todos.length;
  const fibers = /* @__PURE__ */ new Set();
  const results = new Array();
  const interruptAll = () => fibers.forEach((fiber) => {
    fiber._scheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0);
  });
  const startOrder = new Array();
  const joinOrder = new Array();
  const residual = new Array();
  const collectExits = () => {
    const exits = results.filter(({
      exit: exit2
    }) => exit2._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit2
    }) => exit2);
    if (exits.length === 0) {
      exits.push(exitUnit);
    }
    return exits;
  };
  const runFiber = (eff) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent._runtimeFlags, globalScope);
    parent._scheduler.scheduleTask(() => {
      fiber.resume(runnable);
    }, 0);
    return fiber;
  };
  const onInterruptSignal = () => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted = true;
    interruptAll();
  };
  const stepOrExit = batching ? step2 : exit;
  const processingFiber = runFiber(async((resume2) => {
    const pushResult = (res, index2) => {
      if (res._op === "Blocked") {
        residual.push(res);
      } else {
        results.push({
          index: index2,
          exit: res
        });
        if (res._op === "Failure" && !interrupted) {
          onInterruptSignal();
        }
      }
    };
    const next = () => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index2 = counter6++;
        const returnNextElement = () => {
          const a2 = todos.pop();
          index2 = counter6++;
          return flatMap6(yieldNow(), () => flatMap6(stepOrExit(restore(f(a2, index2))), onRes));
        };
        const onRes = (res) => {
          if (todos.length > 0) {
            pushResult(res, index2);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed(res);
        };
        const todo = flatMap6(stepOrExit(restore(f(a, index2))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted) {
          fiber._scheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0);
        }
        fiber.addObserver((wrapped) => {
          let exit2;
          if (wrapped._op === "Failure") {
            exit2 = wrapped;
          } else {
            exit2 = wrapped.i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit2, index2);
          if (results.length === target) {
            resume2(succeed(getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitUnit)));
          } else if (residual.length + results.length === target) {
            const requests = residual.map((blocked2) => blocked2.i0).reduce(par);
            resume2(succeed(blocked(requests, forEachConcurrentDiscard([getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitUnit), ...residual.map((blocked2) => blocked2.i1)], (i) => i, batching, true, n))));
          } else {
            next();
          }
        });
      }
    };
    for (let i = 0; i < fibersCount; i++) {
      next();
    }
  }));
  return asUnit(tap(flatten4(onInterrupt(restore(join2(processingFiber)), () => {
    onInterruptSignal();
    return _await(processingFiber);
  })), () => forEachSequential(joinOrder, (f2) => f2.inheritAll)));
})));
var forEachParN = (self, n, f, batching) => suspend(() => {
  const as2 = fromIterable(self);
  const array3 = new Array(as2.length);
  const fn = (a, i) => map9(f(a, i), (b) => array3[i] = b);
  return zipRight(forEachConcurrentDiscard(as2, fn, batching, false, n), succeed(array3));
});
var forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
var unsafeFork = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
var unsafeForkUnstarted = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
};
var unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake2();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault(childFiberRefs, currentContext);
  const supervisor = childFiber._supervisor;
  supervisor.onStart(childContext, effect, some2(parentFiber), childFiber);
  childFiber.addObserver((exit2) => supervisor.onEnd(exit2, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
var forkWithScopeOverride = (self, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed(unsafeFork(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
var parallelFinalizers = (self) => contextWithEffect((context2) => match(getOption2(context2, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    switch (scope2.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return flatMap6(scopeFork(scope2, parallel3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var parallelNFinalizers = (parallelism) => (self) => contextWithEffect((context2) => match(getOption2(context2, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    if (scope2.strategy._tag === "ParallelN" && scope2.strategy.parallelism === parallelism) {
      return self;
    }
    return flatMap6(scopeFork(scope2, parallelN2(parallelism)), (inner) => scopeExtend(self, inner));
  }
}));
var finalizersMask = (strategy) => (self) => contextWithEffect((context2) => match(getOption2(context2, scopeTag), {
  onNone: () => self(identity),
  onSome: (scope2) => {
    const patch8 = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
    switch (scope2.strategy._tag) {
      case "Parallel":
        return patch8(self(parallelFinalizers));
      case "Sequential":
        return patch8(self(sequentialFinalizers));
      case "ParallelN":
        return patch8(self(parallelNFinalizers(scope2.strategy.parallelism)));
    }
  }
}));
var sequentialFinalizers = (self) => contextWithEffect((context2) => match(getOption2(context2, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    switch (scope2.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return flatMap6(scopeFork(scope2, sequential3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var scopeTag = /* @__PURE__ */ Tag(ScopeTypeId);
var scopeExtend = /* @__PURE__ */ dual(2, (effect, scope2) => mapInputContext(
  effect,
  // @ts-expect-error
  merge3(make6(scopeTag, scope2))
));
var fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ2,
  fork: empty20
});
var currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none5);
var currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none7);
var invokeWithInterrupt = (dataSource, all4) => fiberIdWith((id) => flatMap6(flatMap6(forkDaemon(interruptible2(dataSource)), (processing) => async((cb) => {
  const counts = all4.map((_) => _.listeners.count);
  const checkDone = () => {
    if (counts.every((count) => count === 0)) {
      cleanup.forEach((f) => f());
      cb(interruptFiber(processing));
    }
  };
  processing.addObserver((exit2) => {
    cleanup.forEach((f) => f());
    cb(exit2);
  });
  const cleanup = all4.map((r, i) => {
    const observer = (count) => {
      counts[i] = count;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = all4.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete(entry.request, exitInterrupt(id)));
})));

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/internal/ast.js
var getKeysForIndexSignature = (input2, parameter) => {
  switch (parameter._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(input2);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(input2);
    case "Refinement":
      return getKeysForIndexSignature(input2, parameter.from);
  }
};
var ownKeys = (o) => Object.keys(o).concat(Object.getOwnPropertySymbols(o));
var memoizeThunk = (f) => {
  let done4 = false;
  let a;
  return () => {
    if (done4) {
      return a;
    }
    a = f();
    done4 = true;
    return a;
  };
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/AST.js
var TypeAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Type");
var MessageAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Message");
var IdentifierAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Identifier");
var TitleAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Title");
var DescriptionAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Description");
var ExamplesAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Examples");
var DefaultAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Default");
var JSONSchemaAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/JSONSchema");
var DocumentationAnnotationId = /* @__PURE__ */ Symbol.for("@effect/schema/annotation/Documentation");
var getAnnotation = (key2) => (annotated) => Object.prototype.hasOwnProperty.call(annotated.annotations, key2) ? some2(annotated.annotations[key2]) : none2();
var getMessageAnnotation = /* @__PURE__ */ getAnnotation(MessageAnnotationId);
var getTitleAnnotation = /* @__PURE__ */ getAnnotation(TitleAnnotationId);
var getIdentifierAnnotation = /* @__PURE__ */ getAnnotation(IdentifierAnnotationId);
var getDescriptionAnnotation = /* @__PURE__ */ getAnnotation(DescriptionAnnotationId);
var createDeclaration = (typeParameters, type2, decode3, annotations2 = {}) => ({
  _tag: "Declaration",
  typeParameters,
  type: type2,
  decode: decode3,
  annotations: annotations2
});
var createLiteral = (literal2, annotations2 = {}) => ({
  _tag: "Literal",
  literal: literal2,
  annotations: annotations2
});
var isLiteral = (ast) => ast._tag === "Literal";
var createUniqueSymbol = (symbol3, annotations2 = {}) => ({
  _tag: "UniqueSymbol",
  symbol: symbol3,
  annotations: annotations2
});
var isUniqueSymbol = (ast) => ast._tag === "UniqueSymbol";
var undefinedKeyword = {
  _tag: "UndefinedKeyword",
  annotations: {
    [TitleAnnotationId]: "undefined"
  }
};
var voidKeyword = {
  _tag: "VoidKeyword",
  annotations: {
    [TitleAnnotationId]: "void"
  }
};
var neverKeyword = {
  _tag: "NeverKeyword",
  annotations: {
    [TitleAnnotationId]: "never"
  }
};
var unknownKeyword = {
  _tag: "UnknownKeyword",
  annotations: {
    [TitleAnnotationId]: "unknown"
  }
};
var isUnknownKeyword = (ast) => ast._tag === "UnknownKeyword";
var anyKeyword = {
  _tag: "AnyKeyword",
  annotations: {
    [TitleAnnotationId]: "any"
  }
};
var isAnyKeyword = (ast) => ast._tag === "AnyKeyword";
var stringKeyword = {
  _tag: "StringKeyword",
  annotations: {
    [TitleAnnotationId]: "string",
    [DescriptionAnnotationId]: "a string"
  }
};
var isStringKeyword = (ast) => ast._tag === "StringKeyword";
var numberKeyword = {
  _tag: "NumberKeyword",
  annotations: {
    [TitleAnnotationId]: "number",
    [DescriptionAnnotationId]: "a number"
  }
};
var isNumberKeyword = (ast) => ast._tag === "NumberKeyword";
var booleanKeyword = {
  _tag: "BooleanKeyword",
  annotations: {
    [TitleAnnotationId]: "boolean",
    [DescriptionAnnotationId]: "a boolean"
  }
};
var isBooleanKeyword = (ast) => ast._tag === "BooleanKeyword";
var bigIntKeyword = {
  _tag: "BigIntKeyword",
  annotations: {
    [TitleAnnotationId]: "bigint",
    [DescriptionAnnotationId]: "a bigint"
  }
};
var isBigIntKeyword = (ast) => ast._tag === "BigIntKeyword";
var symbolKeyword = {
  _tag: "SymbolKeyword",
  annotations: {
    [TitleAnnotationId]: "symbol",
    [DescriptionAnnotationId]: "a symbol"
  }
};
var isSymbolKeyword = (ast) => ast._tag === "SymbolKeyword";
var objectKeyword = {
  _tag: "ObjectKeyword",
  annotations: {
    [TitleAnnotationId]: "object",
    [DescriptionAnnotationId]: "an object"
  }
};
var createElement = (type2, isOptional) => ({
  type: type2,
  isOptional
});
var createTuple = (elements, rest, isReadonly, annotations2 = {}) => ({
  _tag: "Tuple",
  elements,
  rest,
  isReadonly,
  annotations: annotations2
});
var createPropertySignature = (name, type2, isOptional, isReadonly, annotations2 = {}) => ({
  name,
  type: type2,
  isOptional,
  isReadonly,
  annotations: annotations2
});
var isParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return true;
    case "Refinement":
      return isParameter(ast.from);
    default:
      return false;
  }
};
var createIndexSignature = (parameter, type2, isReadonly) => {
  if (isParameter(parameter)) {
    return {
      parameter,
      type: type2,
      isReadonly
    };
  }
  throw new Error("An index signature parameter type must be 'string', 'symbol', a template literal type or a refinement of the previous types");
};
var createTypeLiteral = (propertySignatures, indexSignatures, annotations2 = {}) => {
  const keys5 = {};
  for (let i = 0; i < propertySignatures.length; i++) {
    const name = propertySignatures[i].name;
    if (Object.prototype.hasOwnProperty.call(keys5, name)) {
      throw new Error(`Duplicate property signature ${String(name)}`);
    }
    keys5[name] = null;
  }
  const parameters = {
    string: false,
    symbol: false
  };
  for (let i = 0; i < indexSignatures.length; i++) {
    const parameter = getParameterBase(indexSignatures[i].parameter);
    if (isStringKeyword(parameter)) {
      if (parameters.string) {
        throw new Error("Duplicate index signature for type `string`");
      }
      parameters.string = true;
    } else if (isSymbolKeyword(parameter)) {
      if (parameters.symbol) {
        throw new Error("Duplicate index signature for type `symbol`");
      }
      parameters.symbol = true;
    }
  }
  return {
    _tag: "TypeLiteral",
    propertySignatures: sortPropertySignatures(propertySignatures),
    indexSignatures,
    annotations: annotations2
  };
};
var isMembers = (as2) => as2.length > 1;
var createUnion = (candidates, annotations2 = {}) => {
  const types = unify(candidates);
  if (isMembers(types)) {
    return {
      _tag: "Union",
      types: sortUnionMembers(types),
      annotations: annotations2
    };
  }
  if (isNonEmptyReadonlyArray(types)) {
    return types[0];
  }
  return neverKeyword;
};
var createLazy = (f, annotations2 = {}) => ({
  _tag: "Lazy",
  f: memoizeThunk(f),
  annotations: annotations2
});
var createRefinement = (from2, filter5, annotations2 = {}) => {
  if (isTransform(from2)) {
    return createTransform(from2.from, createRefinement(from2.to, filter5, annotations2), from2.transformation, from2.annotations);
  }
  return {
    _tag: "Refinement",
    from: from2,
    filter: filter5,
    annotations: annotations2
  };
};
var isRefinement = (ast) => ast._tag === "Refinement";
var createTransform = (from2, to2, transformation, annotations2 = {}) => ({
  _tag: "Transform",
  from: from2,
  to: to2,
  transformation,
  annotations: annotations2
});
var isTransform = (ast) => ast._tag === "Transform";
var createFinalPropertySignatureTransformation = (decode3, encode2) => ({
  _tag: "FinalPropertySignatureTransformation",
  decode: decode3,
  encode: encode2
});
var createPropertySignatureTransform = (from2, to2, propertySignatureTransformation) => ({
  from: from2,
  to: to2,
  propertySignatureTransformation
});
var createTypeLiteralTransformation = (propertySignatureTransformations) => {
  const keys5 = {};
  for (const pst of propertySignatureTransformations) {
    const key2 = pst.from;
    if (keys5[key2]) {
      throw new Error(`Duplicate property signature transformation ${String(key2)}`);
    }
    keys5[key2] = true;
  }
  return {
    _tag: "TypeLiteralTransformation",
    propertySignatureTransformations
  };
};
var mergeAnnotations = (ast, annotations2) => ({
  ...ast,
  annotations: {
    ...ast.annotations,
    ...annotations2
  }
});
var getToPropertySignatures = (ps) => ps.map((p) => createPropertySignature(p.name, to(p.type), p.isOptional, p.isReadonly, p.annotations));
var getToIndexSignatures = (ps) => ps.map((is2) => createIndexSignature(is2.parameter, to(is2.type), is2.isReadonly));
var to = (ast) => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(ast.typeParameters.map(to), to(ast.type), ast.decode, ast.annotations);
    case "Tuple":
      return createTuple(ast.elements.map((e) => createElement(to(e.type), e.isOptional)), map(ast.rest, map2(to)), ast.isReadonly, ast.annotations);
    case "TypeLiteral":
      return createTypeLiteral(getToPropertySignatures(ast.propertySignatures), getToIndexSignatures(ast.indexSignatures), ast.annotations);
    case "Union":
      return createUnion(ast.types.map(to), ast.annotations);
    case "Lazy":
      return createLazy(() => to(ast.f()), ast.annotations);
    case "Refinement":
      return createRefinement(to(ast.from), ast.filter, ast.annotations);
    case "Transform":
      return to(ast.to);
  }
  return ast;
};
var from = (ast) => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(ast.typeParameters.map(from), from(ast.type), ast.decode, ast.annotations);
    case "Tuple":
      return createTuple(ast.elements.map((e) => createElement(from(e.type), e.isOptional)), map(ast.rest, map2(from)), ast.isReadonly);
    case "TypeLiteral":
      return createTypeLiteral(ast.propertySignatures.map((p) => createPropertySignature(p.name, from(p.type), p.isOptional, p.isReadonly)), ast.indexSignatures.map((is2) => createIndexSignature(is2.parameter, from(is2.type), is2.isReadonly)));
    case "Union":
      return createUnion(ast.types.map(from));
    case "Lazy":
      return createLazy(() => from(ast.f()));
    case "Refinement":
    case "Transform":
      return from(ast.from);
  }
  return ast;
};
var getCardinality = (ast) => {
  switch (ast._tag) {
    case "Declaration":
      return getCardinality(ast.type);
    case "NeverKeyword":
      return 0;
    case "Literal":
    case "UndefinedKeyword":
    case "VoidKeyword":
    case "UniqueSymbol":
      return 1;
    case "BooleanKeyword":
      return 2;
    case "StringKeyword":
    case "NumberKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3;
    case "ObjectKeyword":
      return 5;
    case "UnknownKeyword":
    case "AnyKeyword":
      return 6;
    default:
      return 4;
  }
};
var sortPropertySignatures = /* @__PURE__ */ sort(/* @__PURE__ */ pipe(Order, /* @__PURE__ */ mapInput2((ps) => getCardinality(ps.type))));
var WeightOrder = /* @__PURE__ */ tuple(Order, Order, Order);
var maxWeight = /* @__PURE__ */ max(WeightOrder);
var emptyWeight = [0, 0, 0];
var maxWeightAll = (weights) => weights.reduce(maxWeight, emptyWeight);
var getWeight = (ast) => {
  switch (ast._tag) {
    case "Tuple": {
      const y = ast.elements.length;
      const z = isSome2(ast.rest) ? ast.rest.value.length : 0;
      return [2, y, z];
    }
    case "TypeLiteral": {
      const y = ast.propertySignatures.length;
      const z = ast.indexSignatures.length;
      return y + z === 0 ? [-4, 0, 0] : [4, y, z];
    }
    case "Declaration": {
      const [_, y, z] = getWeight(ast.type);
      return [6, y, z];
    }
    case "Lazy":
      return [8, 0, 0];
    case "Union":
      return maxWeightAll(ast.types.map(getWeight));
    case "Refinement": {
      const [x, y, z] = getWeight(ast.from);
      return [x + 1, y, z];
    }
    case "Transform":
      return getWeight(ast.from);
    case "ObjectKeyword":
      return [-2, 0, 0];
    case "UnknownKeyword":
    case "AnyKeyword":
      return [-4, 0, 0];
    default:
      return emptyWeight;
  }
};
var sortUnionMembers = /* @__PURE__ */ sort(/* @__PURE__ */ reverse(/* @__PURE__ */ mapInput2(WeightOrder, getWeight)));
var unify = (candidates) => {
  let out = pipe(candidates, flatMap2((ast) => {
    switch (ast._tag) {
      case "NeverKeyword":
        return [];
      case "Union":
        return ast.types;
      default:
        return [ast];
    }
  }));
  if (out.some(isAnyKeyword)) {
    return [anyKeyword];
  }
  if (out.some(isUnknownKeyword)) {
    return [unknownKeyword];
  }
  let i;
  if ((i = out.findIndex(isStringKeyword)) !== -1) {
    out = out.filter((m, j) => j === i || !isStringKeyword(m) && !(isLiteral(m) && typeof m.literal === "string"));
  }
  if ((i = out.findIndex(isNumberKeyword)) !== -1) {
    out = out.filter((m, j) => j === i || !isNumberKeyword(m) && !(isLiteral(m) && typeof m.literal === "number"));
  }
  if ((i = out.findIndex(isBooleanKeyword)) !== -1) {
    out = out.filter((m, j) => j === i || !isBooleanKeyword(m) && !(isLiteral(m) && typeof m.literal === "boolean"));
  }
  if ((i = out.findIndex(isBigIntKeyword)) !== -1) {
    out = out.filter((m, j) => j === i || !isBigIntKeyword(m) && !(isLiteral(m) && typeof m.literal === "bigint"));
  }
  if ((i = out.findIndex(isSymbolKeyword)) !== -1) {
    out = out.filter((m, j) => j === i || !isSymbolKeyword(m) && !isUniqueSymbol(m));
  }
  return out;
};
var getParameterBase = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return ast;
    case "Refinement":
      return getParameterBase(ast.from);
  }
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/internal/filters.js
var GreaterThanTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/GreaterThan");
var GreaterThanOrEqualToTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/GreaterThanOrEqualTo");
var LessThanTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/LessThan");
var LessThanOrEqualToTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/LessThanOrEqualTo");
var IntTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/Int");
var BetweenTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/Between");
var GreaterThanBigintTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/GreaterThanBigint");
var GreaterThanOrEqualToBigintTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/GreaterThanOrEqualToBigint");
var LessThanBigintTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/LessThanBigint");
var LessThanOrEqualToBigintTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/LessThanOrEqualToBigint");
var BetweenBigintTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/BetweenBigint");
var MinLengthTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/MinLength");
var MaxLengthTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/MaxLength");
var LengthTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/Length");
var MinItemsTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/MinItems");
var MaxItemsTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/MaxItems");
var ItemsCountTypeId = /* @__PURE__ */ Symbol.for("@effect/schema/TypeId/ItemsCount");

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/internal/hooks.js
var ArbitraryHookId = /* @__PURE__ */ Symbol.for("@effect/schema/ArbitraryHookId");
var PrettyHookId = /* @__PURE__ */ Symbol.for("@effect/schema/PrettyHookId");
var EquivalenceHookId = /* @__PURE__ */ Symbol.for("@effect/schema/EquivalenceHookId");

// node_modules/.pnpm/effect@2.0.0-next.58/node_modules/effect/dist/esm/Effect.js
var forEach6 = forEach5;
var suspend2 = suspend;
var unit2 = unit;
var map10 = map9;
var either3 = either2;
var flatMap7 = flatMap6;

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/TreeFormatter.js
var make30 = (value, forest = []) => ({
  value,
  forest
});
var formatErrors = (errors) => drawTree(make30(`error(s) found`, errors.map(go)));
var drawTree = (tree) => tree.value + draw("\n", tree.forest);
var draw = (indentation, forest) => {
  let r = "";
  const len = forest.length;
  let tree;
  for (let i = 0; i < len; i++) {
    tree = forest[i];
    const isLast = i === len - 1;
    r += indentation + (isLast ? "\u2514" : "\u251C") + "\u2500 " + tree.value;
    r += draw(indentation + (len > 1 && !isLast ? "\u2502  " : "   "), tree.forest);
  }
  return r;
};
var formatActual = (actual) => {
  if (isString(actual)) {
    return JSON.stringify(actual);
  } else if (isNumber(actual) || actual == null || isBoolean(actual) || isSymbol(actual) || isDate(actual)) {
    return String(actual);
  } else if (isBigInt(actual)) {
    return String(actual) + "n";
  } else if (!Array.isArray(actual) && hasProperty(actual, "toString") && isFunction2(actual["toString"]) && actual["toString"] !== Object.prototype.toString) {
    return actual["toString"]();
  }
  try {
    return JSON.stringify(actual);
  } catch (e) {
    return String(actual);
  }
};
var formatTemplateLiteralSpan = (span) => {
  switch (span.type._tag) {
    case "StringKeyword":
      return "${string}";
    case "NumberKeyword":
      return "${number}";
  }
};
var formatTemplateLiteral = (ast) => ast.head + ast.spans.map((span) => formatTemplateLiteralSpan(span) + span.literal).join("");
var getExpected = (ast) => getIdentifierAnnotation(ast).pipe(orElse(() => getTitleAnnotation(ast)), orElse(() => getDescriptionAnnotation(ast)));
var formatExpected = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "UndefinedKeyword":
    case "SymbolKeyword":
    case "ObjectKeyword":
    case "AnyKeyword":
    case "UnknownKeyword":
    case "VoidKeyword":
    case "NeverKeyword":
      return getOrElse(getExpected(ast), () => ast._tag);
    case "Literal":
      return getOrElse(getExpected(ast), () => formatActual(ast.literal));
    case "UniqueSymbol":
      return getOrElse(getExpected(ast), () => formatActual(ast.symbol));
    case "Union":
      return [...new Set(ast.types.map(formatExpected))].join(" or ");
    case "TemplateLiteral":
      return getOrElse(getExpected(ast), () => formatTemplateLiteral(ast));
    case "Tuple":
      return getOrElse(getExpected(ast), () => "<anonymous tuple or array schema>");
    case "TypeLiteral":
      return getOrElse(getExpected(ast), () => "<anonymous type literal schema>");
    case "Enums":
      return getOrElse(getExpected(ast), () => ast.enums.map((_, value) => JSON.stringify(value)).join(" | "));
    case "Lazy":
      return getOrElse(getExpected(ast), () => "<anonymous lazy schema>");
    case "Declaration":
      return getOrElse(getExpected(ast), () => "<anonymous declaration schema>");
    case "Refinement":
      return getOrElse(getExpected(ast), () => "<anonymous refinement schema>");
    case "Transform":
      return getOrElse(getExpected(ast), () => `${formatExpected(ast.from)} <-> ${formatExpected(ast.to)}`);
  }
};
var isCollapsible = (es, errors) => es.length === 1 && es[0].forest.length !== 0 && errors[0]._tag !== "UnionMember";
var getMessage = (e) => getMessageAnnotation(e.expected).pipe(map((annotation) => annotation(e.actual)), orElse(() => e.message), getOrElse(() => `Expected ${formatExpected(e.expected)}, actual ${formatActual(e.actual)}`));
var go = (e) => {
  switch (e._tag) {
    case "Type":
      return make30(getMessage(e));
    case "Forbidden":
      return make30("is forbidden");
    case "Index": {
      const es = e.errors.map(go);
      if (isCollapsible(es, e.errors)) {
        return make30(`[${e.index}]${es[0].value}`, es[0].forest);
      }
      return make30(`[${e.index}]`, es);
    }
    case "Unexpected":
      return make30("is unexpected" + (isSome2(e.ast) ? `, expected ${formatExpected(e.ast.value)}` : ""));
    case "Key": {
      const es = e.errors.map(go);
      if (isCollapsible(es, e.errors)) {
        return make30(`[${formatActual(e.key)}]${es[0].value}`, es[0].forest);
      }
      return make30(`[${formatActual(e.key)}]`, es);
    }
    case "Missing":
      return make30("is missing");
    case "UnionMember":
      return make30("union member", e.errors.map(go));
  }
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/ParseResult.js
var ParseErrorImpl = class {
  errors;
  _tag = "ParseError";
  constructor(errors) {
    this.errors = errors;
  }
  toString() {
    return formatErrors(this.errors);
  }
  toJSON() {
    return {
      _id: "ParseError",
      message: this.toString()
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var parseError = (errors) => new ParseErrorImpl(errors);
var type = (expected, actual, message) => ({
  _tag: "Type",
  expected,
  actual,
  message: fromNullable(message)
});
var forbidden = {
  _tag: "Forbidden"
};
var index = (index2, errors) => ({
  _tag: "Index",
  index: index2,
  errors
});
var key = (key2, errors) => ({
  _tag: "Key",
  key: key2,
  errors
});
var missing = {
  _tag: "Missing"
};
var unexpected = (ast) => ({
  _tag: "Unexpected",
  ast
});
var unionMember = (errors) => ({
  _tag: "UnionMember",
  errors
});
var succeed2 = right2;
var fail3 = (error) => {
  const e = error;
  if ("_tag" in e) {
    return e._tag === "ParseError" ? left2(e) : left2(parseError([e]));
  }
  return left2(parseError(e));
};
var eitherOrUndefined = (self) => {
  const s = self;
  if (s["_tag"] === "Left" || s["_tag"] === "Right") {
    return s;
  }
};
var flatMap8 = (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return f(s.right);
  }
  return flatMap7(self, f);
};
var map11 = (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return right2(f(s.right));
  }
  return map10(self, f);
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/Parser.js
var getEffect = (ast, isDecoding) => {
  const parser = goMemo(ast, isDecoding);
  return (input2, options) => parser(input2, {
    ...options,
    isEffectAllowed: true
  });
};
var parse = (schema) => getEffect(schema.ast, true);
var encode = (schema) => getEffect(schema.ast, false);
var defaultParseOption = {};
var decodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("@effect/schema/Parser/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var encodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("@effect/schema/Parser/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var goMemo = (ast, isDecoding) => {
  const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
  const memo = memoMap.get(ast);
  if (memo) {
    return memo;
  }
  const parser = go2(ast, isDecoding);
  memoMap.set(ast, parser);
  return parser;
};
var go2 = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from2 = goMemo(ast.from, true);
        return (i, options) => handleForbidden(flatMap8(from2(i, options), (a) => match(ast.filter(a, options ?? defaultParseOption, ast), {
          onNone: () => succeed2(a),
          onSome: fail3
        })), options);
      } else {
        const from2 = goMemo(to(ast), true);
        const to2 = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) => handleForbidden(flatMap8(from2(i, options), (a) => to2(a, options)), options);
      }
    }
    case "Transform": {
      const transform2 = getFinalTransformation(ast.transformation, isDecoding);
      const from2 = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to2 = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i1, options) => handleForbidden(flatMap8(from2(i1, options), (a) => flatMap8(transform2(a, options ?? defaultParseOption, ast), (i2) => to2(i2, options))), options);
    }
    case "Declaration": {
      const parse2 = ast.decode(isDecoding, ...ast.typeParameters);
      return (i, options) => handleForbidden(parse2(i, options ?? defaultParseOption, ast), options);
    }
    case "Literal":
      return fromRefinement(ast, (u) => u === ast.literal);
    case "UniqueSymbol":
      return fromRefinement(ast, (u) => u === ast.symbol);
    case "UndefinedKeyword":
      return fromRefinement(ast, isUndefined);
    case "VoidKeyword":
      return fromRefinement(ast, isUndefined);
    case "NeverKeyword":
      return fromRefinement(ast, isNever);
    case "UnknownKeyword":
    case "AnyKeyword":
      return succeed2;
    case "StringKeyword":
      return fromRefinement(ast, isString);
    case "NumberKeyword":
      return fromRefinement(ast, isNumber);
    case "BooleanKeyword":
      return fromRefinement(ast, isBoolean);
    case "BigIntKeyword":
      return fromRefinement(ast, isBigInt);
    case "SymbolKeyword":
      return fromRefinement(ast, isSymbol);
    case "ObjectKeyword":
      return fromRefinement(ast, isObject);
    case "Enums":
      return fromRefinement(ast, (u) => ast.enums.some(([_, value]) => value === u));
    case "TemplateLiteral": {
      const regex = getTemplateLiteralRegex(ast);
      return fromRefinement(ast, (u) => isString(u) && regex.test(u));
    }
    case "Tuple": {
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = map(ast.rest, map2((ast2) => goMemo(ast2, isDecoding)));
      let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
      if (isSome2(ast.rest)) {
        requiredLen += ast.rest.value.length - 1;
      }
      return (input2, options) => {
        if (!Array.isArray(input2)) {
          return fail3(type(ast, input2));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const len = input2.length;
        for (let i2 = len; i2 <= requiredLen - 1; i2++) {
          const e = index(i2, [missing]);
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return fail3(e);
          }
        }
        if (isNone2(ast.rest)) {
          for (let i2 = ast.elements.length; i2 <= len - 1; i2++) {
            const e = index(i2, [unexpected(none2())]);
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return fail3(mutableAppend(sortByIndex(es), e));
            }
          }
        }
        const output = [];
        let i = 0;
        let queue = void 0;
        for (; i < elements.length; i++) {
          if (len < i + 1) {
            if (ast.elements[i].isOptional) {
              continue;
            }
          } else {
            const parser = elements[i];
            const te = parser(input2[i], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft2(eu)) {
                const e = index(i, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return fail3(mutableAppend(sortByIndex(es), e));
                }
              }
              output.push([stepKey++, eu.right]);
            } else {
              const nk = stepKey++;
              const index2 = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap7(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = index(index2, t.left.errors);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return unit2;
                  } else {
                    return fail3(mutableAppend(sortByIndex(es2), e));
                  }
                }
                output2.push([nk, t.right]);
                return unit2;
              }));
            }
          }
        }
        if (isSome2(rest)) {
          const [head3, ...tail] = rest.value;
          for (; i < len - tail.length; i++) {
            const te = head3(input2[i], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft2(eu)) {
                const e = index(i, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return fail3(mutableAppend(sortByIndex(es), e));
                }
              } else {
                output.push([stepKey++, eu.right]);
              }
            } else {
              const nk = stepKey++;
              const index2 = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap7(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = index(index2, t.left.errors);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return unit2;
                  } else {
                    return fail3(mutableAppend(sortByIndex(es2), e));
                  }
                } else {
                  output2.push([nk, t.right]);
                  return unit2;
                }
              }));
            }
          }
          for (let j = 0; j < tail.length; j++) {
            i += j;
            if (len < i + 1) {
              continue;
            } else {
              const te = tail[j](input2[i], options);
              const eu = eitherOrUndefined(te);
              if (eu) {
                if (isLeft2(eu)) {
                  const e = index(i, eu.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return fail3(mutableAppend(sortByIndex(es), e));
                  }
                }
                output.push([stepKey++, eu.right]);
              } else {
                const nk = stepKey++;
                const index2 = i;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap7(either3(te), (t) => {
                  if (isLeft2(t)) {
                    const e = index(index2, t.left.errors);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return unit2;
                    } else {
                      return fail3(mutableAppend(sortByIndex(es2), e));
                    }
                  }
                  output2.push([nk, t.right]);
                  return unit2;
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => isNonEmptyArray2(es2) ? fail3(sortByIndex(es2)) : succeed2(sortByIndex(output2));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend2(() => {
            const state = {
              es: Array.from(es),
              output: Array.from(output)
            };
            return flatMap7(forEach6(cqueue, (f) => f(state), {
              concurrency: "unbounded",
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          output,
          es
        });
      };
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return fromRefinement(ast, isNotNullable);
      }
      const propertySignatures = [];
      const expectedKeys = {};
      for (const ps of ast.propertySignatures) {
        propertySignatures.push(goMemo(ps.type, isDecoding));
        expectedKeys[ps.name] = null;
      }
      const indexSignatures = ast.indexSignatures.map((is2) => [goMemo(is2.parameter, isDecoding), goMemo(is2.type, isDecoding)]);
      const expectedAST = createUnion(ast.indexSignatures.map((is2) => is2.parameter).concat(ownKeys(expectedKeys).map((key2) => isSymbol(key2) ? createUniqueSymbol(key2) : createLiteral(key2))));
      const expected = goMemo(expectedAST, isDecoding);
      return (input2, options) => {
        if (!isRecord(input2)) {
          return fail3(type(ast, input2));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        if (onExcessPropertyError) {
          for (const key2 of ownKeys(input2)) {
            const eu = eitherOrUndefined(expected(key2, options));
            if (eu && isLeft2(eu)) {
              const e = key(key2, [unexpected(some2(expectedAST))]);
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return fail3(mutableAppend(sortByIndex(es), e));
              }
            }
          }
        }
        const output = {};
        let queue = void 0;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = ast.propertySignatures[i];
          const parser = propertySignatures[i];
          const name = ps.name;
          if (Object.prototype.hasOwnProperty.call(input2, name)) {
            const te = parser(input2[name], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft2(eu)) {
                const e = key(name, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return fail3(mutableAppend(sortByIndex(es), e));
                }
              }
              output[name] = eu.right;
            } else {
              const nk = stepKey++;
              const index2 = name;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap7(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = key(index2, t.left.errors);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return unit2;
                  } else {
                    return fail3(mutableAppend(sortByIndex(es2), e));
                  }
                }
                output2[index2] = t.right;
                return unit2;
              }));
            }
          } else {
            if (!ps.isOptional) {
              const e = key(name, [missing]);
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return fail3(e);
              }
            }
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const indexSignature = indexSignatures[i];
          const parameter = indexSignature[0];
          const type2 = indexSignature[1];
          const keys5 = getKeysForIndexSignature(input2, ast.indexSignatures[i].parameter);
          for (const key2 of keys5) {
            const keu = eitherOrUndefined(parameter(key2, options));
            if (keu && isRight2(keu)) {
              const vpr = type2(input2[key2], options);
              const veu = eitherOrUndefined(vpr);
              if (veu) {
                if (isLeft2(veu)) {
                  const e = key(key2, veu.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return fail3(mutableAppend(sortByIndex(es), e));
                  }
                } else {
                  if (!Object.prototype.hasOwnProperty.call(expectedKeys, key2)) {
                    output[key2] = veu.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index2 = key2;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap7(either3(vpr), (tv) => {
                  if (isLeft2(tv)) {
                    const e = key(index2, tv.left.errors);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return unit2;
                    } else {
                      return fail3(mutableAppend(sortByIndex(es2), e));
                    }
                  } else {
                    if (!Object.prototype.hasOwnProperty.call(expectedKeys, key2)) {
                      output2[key2] = tv.right;
                    }
                    return unit2;
                  }
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => isNonEmptyArray2(es2) ? fail3(sortByIndex(es2)) : succeed2(output2);
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend2(() => {
            const state = {
              es: Array.from(es),
              output: Object.assign({}, output)
            };
            return flatMap7(forEach6(cqueue, (f) => f(state), {
              concurrency: "unbounded",
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          es,
          output
        });
      };
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, isDecoding);
      const ownKeys2 = ownKeys(searchTree.keys);
      const len = ownKeys2.length;
      const map12 = /* @__PURE__ */ new Map();
      for (let i = 0; i < ast.types.length; i++) {
        map12.set(ast.types[i], goMemo(ast.types[i], isDecoding));
      }
      return (input2, options) => {
        const es = [];
        let stepKey = 0;
        let candidates = [];
        if (len > 0) {
          if (isRecord(input2)) {
            for (let i = 0; i < len; i++) {
              const name = ownKeys2[i];
              const buckets = searchTree.keys[name].buckets;
              if (Object.prototype.hasOwnProperty.call(input2, name)) {
                const literal2 = String(input2[name]);
                if (Object.prototype.hasOwnProperty.call(buckets, literal2)) {
                  candidates = candidates.concat(buckets[literal2]);
                } else {
                  es.push([stepKey++, key(name, [type(searchTree.keys[name].ast, input2[name])])]);
                }
              } else {
                es.push([stepKey++, key(name, [missing])]);
              }
            }
          } else {
            es.push([stepKey++, type(ast, input2)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = void 0;
        for (let i = 0; i < candidates.length; i++) {
          const pr = map12.get(candidates[i])(input2, options);
          const eu = !queue || queue.length === 0 ? eitherOrUndefined(pr) : void 0;
          if (eu) {
            if (isRight2(eu)) {
              return succeed2(eu.right);
            } else {
              es.push([stepKey++, unionMember(eu.left.errors)]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) => suspend2(() => {
              if ("finalResult" in state) {
                return unit2;
              } else {
                return flatMap7(either3(pr), (t) => {
                  if (isRight2(t)) {
                    state.finalResult = succeed2(t.right);
                  } else {
                    state.es.push([nk, unionMember(t.left.errors)]);
                  }
                  return unit2;
                });
              }
            }));
          }
        }
        const computeResult = (es2) => isNonEmptyArray2(es2) ? fail3(sortByIndex(es2)) : (
          // this should never happen
          fail3(type(neverKeyword, input2))
        );
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend2(() => {
            const state = {
              es: Array.from(es)
            };
            return flatMap7(forEach6(cqueue, (f) => f(state), {
              concurrency: 1,
              discard: true
            }), () => {
              if ("finalResult" in state) {
                return state.finalResult;
              }
              return computeResult(state.es);
            });
          });
        }
        return computeResult(es);
      };
    }
    case "Lazy": {
      const get10 = memoizeThunk(() => goMemo(ast.f(), isDecoding));
      return (a, options) => get10()(a, options);
    }
  }
};
var fromRefinement = (ast, refinement) => (u) => refinement(u) ? succeed2(u) : fail3(type(ast, u));
var getLiterals = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration":
      return getLiterals(ast.type, isDecoding);
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature = ast.propertySignatures[i];
        const type2 = isDecoding ? from(propertySignature.type) : to(propertySignature.type);
        if (isLiteral(type2) && !propertySignature.isOptional) {
          out.push([propertySignature.name, type2]);
        }
      }
      return out;
    }
    case "Refinement":
      return getLiterals(ast.from, isDecoding);
    case "Transform":
      return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
  }
  return [];
};
var getSearchTree = (members, isDecoding) => {
  const keys5 = {};
  const otherwise = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const tags = getLiterals(member, isDecoding);
    if (tags.length > 0) {
      for (let j = 0; j < tags.length; j++) {
        const [key2, literal2] = tags[j];
        const hash2 = String(literal2.literal);
        keys5[key2] = keys5[key2] || {
          buckets: {},
          ast: neverKeyword
        };
        const buckets = keys5[key2].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash2)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash2].push(member);
          keys5[key2].ast = createUnion([keys5[key2].ast, literal2]);
        } else {
          buckets[hash2] = [member];
          keys5[key2].ast = createUnion([keys5[key2].ast, literal2]);
          break;
        }
      }
    } else {
      otherwise.push(member);
    }
  }
  return {
    keys: keys5,
    otherwise
  };
};
var dropRightRefinement = (ast) => isRefinement(ast) ? dropRightRefinement(ast.from) : ast;
var handleForbidden = (conditional, options) => {
  const eu = eitherOrUndefined(conditional);
  return eu ? eu : options?.isEffectAllowed === true ? conditional : fail3(forbidden);
};
var mutableAppend = (self, a) => {
  self.push(a);
  return self;
};
var getTemplateLiteralRegex = (ast) => {
  let pattern = `^${ast.head}`;
  for (const span of ast.spans) {
    if (isStringKeyword(span.type)) {
      pattern += ".*";
    } else if (isNumberKeyword(span.type)) {
      pattern += "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
    }
    pattern += span.literal;
  }
  pattern += "$";
  return new RegExp(pattern);
};
function sortByIndex(es) {
  return es.sort(([a], [b]) => a > b ? 1 : a < b ? -1 : 0).map(([_, a]) => a);
}
var getFinalPropertySignatureTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalPropertySignatureTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
  }
};
var getFinalTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return succeed2;
    case "TypeLiteralTransformation":
      return (input2) => {
        let out = right2(input2);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from2, to2] = isDecoding ? [pst.from, pst.to] : [pst.to, pst.from];
          const transform2 = getFinalPropertySignatureTransformation(pst.propertySignatureTransformation, isDecoding);
          const f = (input3) => {
            const o = transform2(Object.prototype.hasOwnProperty.call(input3, from2) ? some2(input3[from2]) : none2());
            delete input3[from2];
            if (isSome2(o)) {
              input3[to2] = o.value;
            }
            return input3;
          };
          out = map11(out, f);
        }
        return out;
      };
  }
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/Arbitrary.js
var ArbitraryHookId2 = ArbitraryHookId;
var unsafeTo = (schema) => go3(schema.ast, {});
var depthSize = 1;
var record = (fc, key2, value, options) => {
  return (options.isLazy ? fc.oneof({
    depthSize
  }, fc.constant([]), fc.array(fc.tuple(key2, value), {
    minLength: 1,
    maxLength: 2
  })) : fc.array(fc.tuple(key2, value))).map((tuples) => {
    const out = {};
    for (const [k, v] of tuples) {
      out[k] = v;
    }
    return out;
  });
};
var getHook = /* @__PURE__ */ getAnnotation(ArbitraryHookId2);
var go3 = (ast, options) => {
  switch (ast._tag) {
    case "Declaration":
      return pipe(getHook(ast), match({
        onNone: () => go3(ast.type, options),
        onSome: (handler) => handler(...ast.typeParameters.map((p) => go3(p, options)))
      }));
    case "Literal":
      return (fc) => fc.constant(ast.literal);
    case "UniqueSymbol":
      return (fc) => fc.constant(ast.symbol);
    case "UndefinedKeyword":
      return (fc) => fc.constant(void 0);
    case "VoidKeyword":
      return (fc) => fc.constant(void 0);
    case "NeverKeyword":
      return () => {
        throw new Error("cannot build an Arbitrary for `never`");
      };
    case "UnknownKeyword":
    case "AnyKeyword":
      return (fc) => fc.anything();
    case "StringKeyword":
      return (fc) => {
        if (options.constraints) {
          switch (options.constraints._tag) {
            case "StringConstraints":
              return fc.string(options.constraints.constraints);
          }
        }
        return fc.string();
      };
    case "NumberKeyword":
      return (fc) => {
        if (options.constraints) {
          switch (options.constraints._tag) {
            case "NumberConstraints":
              return fc.float(options.constraints.constraints);
            case "IntegerConstraints":
              return fc.integer(options.constraints.constraints);
          }
        }
        return fc.float();
      };
    case "BooleanKeyword":
      return (fc) => fc.boolean();
    case "BigIntKeyword":
      return (fc) => {
        if (options.constraints) {
          switch (options.constraints._tag) {
            case "BigIntConstraints":
              return fc.bigInt(options.constraints.constraints);
          }
        }
        return fc.bigInt();
      };
    case "SymbolKeyword":
      return (fc) => fc.string().map((s) => Symbol.for(s));
    case "ObjectKeyword":
      return (fc) => fc.oneof(fc.object(), fc.array(fc.anything()));
    case "TemplateLiteral": {
      return (fc) => {
        const string3 = fc.string({
          maxLength: 5
        });
        const number5 = fc.float({
          noDefaultInfinity: true
        }).filter((n) => !Number.isNaN(n));
        const components = [fc.constant(ast.head)];
        for (const span of ast.spans) {
          if (isStringKeyword(span.type)) {
            components.push(string3);
          } else {
            components.push(number5);
          }
          components.push(fc.constant(span.literal));
        }
        return fc.tuple(...components).map((spans) => spans.join(""));
      };
    }
    case "Tuple": {
      const elements = [];
      let hasOptionals = false;
      for (const element of ast.elements) {
        elements.push(go3(element.type, options));
        if (element.isOptional) {
          hasOptionals = true;
        }
      }
      const rest = map(ast.rest, map2((e) => go3(e, options)));
      return (fc) => {
        let output = fc.tuple(...elements.map((arb) => arb(fc)));
        if (hasOptionals) {
          const indexes = fc.tuple(...ast.elements.map((element) => element.isOptional ? fc.boolean() : fc.constant(true)));
          output = output.chain((tuple3) => indexes.map((booleans) => {
            for (const [i, b] of booleans.reverse().entries()) {
              if (!b) {
                tuple3.splice(booleans.length - i, 1);
              }
            }
            return tuple3;
          }));
        }
        if (isSome2(rest)) {
          const [head3, ...tail] = rest.value;
          const arb = head3(fc);
          const constraints = options.constraints;
          output = output.chain((as2) => {
            let out = fc.array(arb);
            if (options.isLazy) {
              out = fc.oneof({
                depthSize
              }, fc.constant([]), fc.array(arb, {
                minLength: 1,
                maxLength: 2
              }));
            } else if (constraints && constraints._tag === "ArrayConstraints") {
              out = fc.array(arb, constraints.constraints);
            }
            return out.map((rest2) => [...as2, ...rest2]);
          });
          for (let j = 0; j < tail.length; j++) {
            output = output.chain((as2) => tail[j](fc).map((a) => [...as2, a]));
          }
        }
        return output;
      };
    }
    case "TypeLiteral": {
      const propertySignaturesTypes = ast.propertySignatures.map((f) => go3(f.type, options));
      const indexSignatures = ast.indexSignatures.map((is2) => [go3(is2.parameter, options), go3(is2.type, options)]);
      return (fc) => {
        const arbs = {};
        const requiredKeys = [];
        for (let i = 0; i < propertySignaturesTypes.length; i++) {
          const ps = ast.propertySignatures[i];
          const name = ps.name;
          if (!ps.isOptional) {
            requiredKeys.push(name);
          }
          arbs[name] = propertySignaturesTypes[i](fc);
        }
        let output = fc.record(arbs, {
          requiredKeys
        });
        for (let i = 0; i < indexSignatures.length; i++) {
          const parameter = indexSignatures[i][0](fc);
          const type2 = indexSignatures[i][1](fc);
          output = output.chain((o) => {
            return record(fc, parameter, type2, options).map((d) => ({
              ...d,
              ...o
            }));
          });
        }
        return output;
      };
    }
    case "Union": {
      const types = ast.types.map((t) => go3(t, options));
      return (fc) => fc.oneof({
        depthSize
      }, ...types.map((arb) => arb(fc)));
    }
    case "Enums": {
      if (ast.enums.length === 0) {
        throw new Error("cannot build an Arbitrary for an empty enum");
      }
      return (fc) => fc.oneof(...ast.enums.map(([_, value]) => fc.constant(value)));
    }
    case "Refinement": {
      const constraints = combineConstraints(options.constraints, getConstraints(ast));
      const from2 = go3(ast.from, constraints ? {
        ...options,
        constraints
      } : options);
      return pipe(getHook(ast), match({
        onNone: () => (fc) => from2(fc).filter((a) => isNone2(ast.filter(a, defaultParseOption, ast))),
        onSome: (handler) => handler(from2)
      }));
    }
    case "Lazy": {
      return pipe(getHook(ast), match({
        onNone: () => {
          const get10 = memoizeThunk(() => go3(ast.f(), {
            ...options,
            isLazy: true
          }));
          return (fc) => fc.constant(null).chain(() => get10()(fc));
        },
        onSome: (handler) => handler()
      }));
    }
    case "Transform":
      throw new Error("cannot build an Arbitrary for transformations");
  }
};
var numberConstraints = (constraints) => {
  if (isNumber(constraints.min)) {
    constraints.min = Math.fround(constraints.min);
  }
  if (isNumber(constraints.max)) {
    constraints.max = Math.fround(constraints.max);
  }
  return {
    _tag: "NumberConstraints",
    constraints
  };
};
var stringConstraints = (constraints) => {
  return {
    _tag: "StringConstraints",
    constraints
  };
};
var integerConstraints = (constraints) => {
  return {
    _tag: "IntegerConstraints",
    constraints
  };
};
var arrayConstraints = (constraints) => {
  return {
    _tag: "ArrayConstraints",
    constraints
  };
};
var bigintConstraints = (constraints) => {
  return {
    _tag: "BigIntConstraints",
    constraints
  };
};
var getConstraints = (ast) => {
  const TypeAnnotationId2 = ast.annotations[TypeAnnotationId];
  const jsonSchema = ast.annotations[JSONSchemaAnnotationId];
  switch (TypeAnnotationId2) {
    case GreaterThanTypeId:
    case GreaterThanOrEqualToTypeId:
      return numberConstraints({
        min: jsonSchema.exclusiveMinimum ?? jsonSchema.minimum
      });
    case LessThanTypeId:
    case LessThanOrEqualToTypeId:
      return numberConstraints({
        max: jsonSchema.exclusiveMaximum ?? jsonSchema.maximum
      });
    case IntTypeId:
      return integerConstraints({});
    case BetweenTypeId: {
      const min2 = jsonSchema.minimum;
      const max2 = jsonSchema.maximum;
      const constraints = {};
      if (isNumber(min2)) {
        constraints.min = min2;
      }
      if (isNumber(max2)) {
        constraints.max = max2;
      }
      return numberConstraints(constraints);
    }
    case GreaterThanBigintTypeId:
    case GreaterThanOrEqualToBigintTypeId: {
      const params = ast.annotations[TypeAnnotationId2];
      return bigintConstraints({
        min: params.min
      });
    }
    case LessThanBigintTypeId:
    case LessThanOrEqualToBigintTypeId: {
      const params = ast.annotations[TypeAnnotationId2];
      return bigintConstraints({
        max: params.max
      });
    }
    case BetweenBigintTypeId: {
      const params = ast.annotations[TypeAnnotationId2];
      const min2 = params.min;
      const max2 = params.max;
      const constraints = {};
      if (isBigInt(min2)) {
        constraints.min = min2;
      }
      if (isBigInt(max2)) {
        constraints.max = max2;
      }
      return bigintConstraints(constraints);
    }
    case MinLengthTypeId:
      return stringConstraints({
        minLength: jsonSchema.minLength
      });
    case MaxLengthTypeId:
      return stringConstraints({
        maxLength: jsonSchema.maxLength
      });
    case LengthTypeId:
      return stringConstraints({
        minLength: jsonSchema.minLength,
        maxLength: jsonSchema.maxLength
      });
    case MinItemsTypeId:
      return arrayConstraints({
        minLength: jsonSchema.minItems
      });
    case MaxItemsTypeId:
      return arrayConstraints({
        maxLength: jsonSchema.maxItems
      });
    case ItemsCountTypeId:
      return arrayConstraints({
        minLength: jsonSchema.minItems,
        maxLength: jsonSchema.maxItems
      });
  }
};
var combineConstraints = (c1, c2) => {
  if (c1 === void 0) {
    return c2;
  }
  if (c2 === void 0) {
    return c1;
  }
  switch (c1._tag) {
    case "ArrayConstraints": {
      switch (c2._tag) {
        case "ArrayConstraints": {
          const c = {
            ...c1.constraints,
            ...c2.constraints
          };
          const minLength = getMax(c1.constraints.minLength, c2.constraints.minLength);
          if (isNumber(minLength)) {
            c.minLength = minLength;
          }
          const maxLength = getMin(c1.constraints.maxLength, c2.constraints.maxLength);
          if (isNumber(maxLength)) {
            c.maxLength = maxLength;
          }
          return arrayConstraints(c);
        }
      }
      break;
    }
    case "NumberConstraints": {
      switch (c2._tag) {
        case "NumberConstraints": {
          const c = {
            ...c1.constraints,
            ...c2.constraints
          };
          const min2 = getMax(c1.constraints.min, c2.constraints.min);
          if (isNumber(min2)) {
            c.min = min2;
          }
          const max2 = getMin(c1.constraints.max, c2.constraints.max);
          if (isNumber(max2)) {
            c.max = max2;
          }
          return numberConstraints(c);
        }
        case "IntegerConstraints": {
          const c = {
            ...c2.constraints
          };
          const min2 = getMax(c1.constraints.min, c2.constraints.min);
          if (isNumber(min2)) {
            c.min = min2;
          }
          const max2 = getMin(c1.constraints.max, c2.constraints.max);
          if (isNumber(max2)) {
            c.max = max2;
          }
          return integerConstraints(c);
        }
      }
      break;
    }
    case "BigIntConstraints": {
      switch (c2._tag) {
        case "BigIntConstraints": {
          const c = {
            ...c1.constraints,
            ...c2.constraints
          };
          const min2 = getMax(c1.constraints.min, c2.constraints.min);
          if (isBigInt(min2)) {
            c.min = min2;
          }
          const max2 = getMin(c1.constraints.max, c2.constraints.max);
          if (isBigInt(max2)) {
            c.max = max2;
          }
          return bigintConstraints(c);
        }
      }
      break;
    }
    case "StringConstraints": {
      switch (c2._tag) {
        case "StringConstraints": {
          const c = {
            ...c1.constraints,
            ...c2.constraints
          };
          const minLength = getMax(c1.constraints.minLength, c2.constraints.minLength);
          if (isNumber(minLength)) {
            c.minLength = minLength;
          }
          const maxLength = getMin(c1.constraints.maxLength, c2.constraints.maxLength);
          if (isNumber(maxLength)) {
            c.maxLength = maxLength;
          }
          return stringConstraints(c);
        }
      }
      break;
    }
    case "IntegerConstraints": {
      switch (c2._tag) {
        case "NumberConstraints":
        case "IntegerConstraints": {
          const c = {
            ...c1.constraints
          };
          const min2 = getMax(c1.constraints.min, c2.constraints.min);
          if (isNumber(min2)) {
            c.min = min2;
          }
          const max2 = getMin(c1.constraints.max, c2.constraints.max);
          if (isNumber(max2)) {
            c.max = max2;
          }
          return integerConstraints(c);
        }
      }
      break;
    }
  }
};
function getMax(n1, n2) {
  return n1 === void 0 ? n2 : n2 === void 0 ? n1 : n1 <= n2 ? n2 : n1;
}
function getMin(n1, n2) {
  return n1 === void 0 ? n2 : n2 === void 0 ? n1 : n1 <= n2 ? n1 : n2;
}

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/internal/schema.js
var TypeId12 = /* @__PURE__ */ Symbol.for("@effect/schema/Schema");
var variance4 = {
  From: (_) => _,
  To: (_) => _
};
var SchemaImpl = class {
  ast;
  [TypeId12] = variance4;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// node_modules/.pnpm/@effect+schema@0.51.2_effect@2.0.0-next.58_fast-check@3.14.0/node_modules/@effect/schema/dist/esm/Schema.js
var TypeId13 = TypeId12;
var variance5 = {
  From: (_) => _,
  To: (_) => _
};
var SchemaImpl2 = class {
  ast;
  [TypeId13] = variance5;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make31 = (ast) => new SchemaImpl2(ast);
var makeLiteral = (value) => make31(createLiteral(value));
var literal = (...literals) => union5(...literals.map((literal2) => makeLiteral(literal2)));
var declare = (typeParameters, type2, decode3, annotations2) => make31(createDeclaration(typeParameters.map((tp) => tp.ast), type2.ast, (isDecoding, ...typeParameters2) => decode3(isDecoding, ...typeParameters2.map(make31)), annotations2));
var any = /* @__PURE__ */ make31(anyKeyword);
var string2 = /* @__PURE__ */ make31(stringKeyword);
var number4 = /* @__PURE__ */ make31(numberKeyword);
var union5 = (...members) => make31(createUnion(members.map((m) => m.ast)));
var tuple2 = (...elements) => make31(createTuple(elements.map((schema) => createElement(schema.ast, false)), none2(), true));
var PropertySignatureImpl = class _PropertySignatureImpl {
  config;
  [TypeId13] = variance5;
  FromIsOptional;
  ToIsOptional;
  constructor(config) {
    this.config = config;
  }
  withDefault(value) {
    return new _PropertySignatureImpl({
      _tag: "Default",
      ast: this.config.ast,
      value,
      annotations: this.config.annotations
    });
  }
  toOption() {
    return new _PropertySignatureImpl({
      _tag: "Option",
      ast: this.config.ast,
      annotations: this.config.annotations
    });
  }
};
var struct = (fields) => {
  const ownKeys2 = ownKeys(fields);
  const pss = [];
  const froms = [];
  const tos = [];
  const propertySignatureTransformations = [];
  for (let i = 0; i < ownKeys2.length; i++) {
    const key2 = ownKeys2[i];
    const field = fields[key2];
    if ("config" in field) {
      const config = field.config;
      const from2 = config.ast;
      const to2 = to(from2);
      const annotations2 = config.annotations;
      switch (config._tag) {
        case "PropertySignature":
          pss.push(createPropertySignature(key2, from2, false, true, annotations2));
          froms.push(createPropertySignature(key2, from2, false, true));
          tos.push(createPropertySignature(key2, to2, false, true, annotations2));
          break;
        case "Optional":
          pss.push(createPropertySignature(key2, from2, true, true, annotations2));
          froms.push(createPropertySignature(key2, from2, true, true));
          tos.push(createPropertySignature(key2, to2, true, true, annotations2));
          break;
        case "Default":
          froms.push(createPropertySignature(key2, from2, true, true));
          tos.push(createPropertySignature(key2, to2, false, true, annotations2));
          propertySignatureTransformations.push(createPropertySignatureTransform(key2, key2, createFinalPropertySignatureTransformation(orElse(() => some2(config.value())), identity)));
          break;
        case "Option":
          froms.push(createPropertySignature(key2, from2, true, true));
          tos.push(createPropertySignature(key2, optionFromSelf(make31(to2)).ast, false, true, annotations2));
          propertySignatureTransformations.push(createPropertySignatureTransform(key2, key2, createFinalPropertySignatureTransformation(some2, flatten)));
          break;
      }
    } else {
      pss.push(createPropertySignature(key2, field.ast, false, true));
      froms.push(createPropertySignature(key2, field.ast, false, true));
      tos.push(createPropertySignature(key2, to(field.ast), false, true));
    }
  }
  if (isNonEmptyReadonlyArray(propertySignatureTransformations)) {
    return make31(createTransform(createTypeLiteral(froms, []), createTypeLiteral(tos, []), createTypeLiteralTransformation(propertySignatureTransformations)));
  }
  return make31(createTypeLiteral(pss, []));
};
var lazy = (f, annotations2) => make31(createLazy(() => f().ast, annotations2));
function filter4(predicate, options) {
  return (self) => make31(createRefinement(self.ast, (a, _, ast) => predicate(a) ? none2() : some2(parseError([type(ast, a)])), toAnnotations(options)));
}
var toAnnotations = (options) => {
  if (!options) {
    return {};
  }
  const out = {};
  const custom = Object.getOwnPropertySymbols(options);
  for (const sym of custom) {
    out[sym] = options[sym];
  }
  if (options.typeId !== void 0) {
    const typeId = options.typeId;
    if (typeof typeId === "object") {
      out[TypeAnnotationId] = typeId.id;
      out[typeId.id] = typeId.params;
    } else {
      out[TypeAnnotationId] = typeId;
    }
  }
  const move = (from2, to2) => {
    if (options[from2] !== void 0) {
      out[to2] = options[from2];
    }
  };
  move("message", MessageAnnotationId);
  move("identifier", IdentifierAnnotationId);
  move("title", TitleAnnotationId);
  move("description", DescriptionAnnotationId);
  move("examples", ExamplesAnnotationId);
  move("default", DefaultAnnotationId);
  move("documentation", DocumentationAnnotationId);
  move("jsonSchema", JSONSchemaAnnotationId);
  move("arbitrary", ArbitraryHookId);
  move("pretty", PrettyHookId);
  move("equivalence", EquivalenceHookId);
  return out;
};
var annotations = (annotations2) => (self) => make31(mergeAnnotations(self.ast, annotations2));
var GreaterThanOrEqualToTypeId2 = GreaterThanOrEqualToTypeId;
var greaterThanOrEqualTo4 = (min2, options) => (self) => self.pipe(filter4((a) => a >= min2, {
  typeId: GreaterThanOrEqualToTypeId2,
  description: min2 === 0 ? "a non-negative number" : `a number greater than or equal to ${min2}`,
  jsonSchema: {
    minimum: min2
  },
  ...options
}));
var nonNegative = (options) => greaterThanOrEqualTo4(0, options);
var NonNegative = /* @__PURE__ */ number4.pipe(/* @__PURE__ */ nonNegative());
var DurationFromSelf = /* @__PURE__ */ declare([], /* @__PURE__ */ struct({}), () => (u, _, ast) => !isDuration(u) ? fail3(type(ast, u)) : succeed2(u), {
  [IdentifierAnnotationId]: "Duration",
  [PrettyHookId]: () => match4({
    onMillis: (_) => `Duration.millis(${_})`,
    onNanos: (_) => `Duration.nanos(${_})`
  }),
  [ArbitraryHookId]: () => (fc) => fc.oneof(fc.bigUint().map((_) => nanos(_)), fc.bigUint().map((_) => micros(_)), fc.maxSafeNat().map((_) => millis(_)), fc.maxSafeNat().map((_) => seconds(_)), fc.maxSafeNat().map((_) => minutes(_)), fc.maxSafeNat().map((_) => hours(_)), fc.maxSafeNat().map((_) => days(_)), fc.maxSafeNat().map((_) => weeks(_))),
  [EquivalenceHookId]: () => Equivalence2
});
var hrTime = /* @__PURE__ */ tuple2(NonNegative.pipe(annotations({
  [TitleAnnotationId]: "seconds",
  [DescriptionAnnotationId]: "seconds"
})), NonNegative.pipe(annotations({
  [TitleAnnotationId]: "nanos",
  [DescriptionAnnotationId]: "nanos"
}))).pipe(/* @__PURE__ */ annotations({
  [TitleAnnotationId]: "a high resolution time tuple",
  [DescriptionAnnotationId]: "a high resolution time tuple"
}));
var Uint8ArrayFromSelf = /* @__PURE__ */ declare([], /* @__PURE__ */ struct({}), () => (u, _, ast) => !isUint8Array(u) ? fail3(type(ast, u)) : succeed2(u), {
  [IdentifierAnnotationId]: "Uint8Array",
  [PrettyHookId]: () => (u8arr) => `new Uint8Array(${JSON.stringify(Array.from(u8arr))})`,
  [ArbitraryHookId]: () => (fc) => fc.uint8Array(),
  [EquivalenceHookId]: () => getEquivalence2(strict())
});
var dateArbitrary = () => (fc) => fc.date({
  noInvalidDate: false
});
var datePretty = () => (date) => `new Date(${JSON.stringify(date)})`;
var DateFromSelf = /* @__PURE__ */ declare([], /* @__PURE__ */ struct({}), () => (u, _, ast) => !isDate(u) ? fail3(type(ast, u)) : succeed2(u), {
  [IdentifierAnnotationId]: "Date",
  [PrettyHookId]: datePretty,
  [ArbitraryHookId]: dateArbitrary,
  [EquivalenceHookId]: () => Date2
});
var optionFrom = (value) => union5(struct({
  _tag: literal("None")
}), struct({
  _tag: literal("Some"),
  value
}));
var optionDecode = (o) => o._tag === "None" ? none2() : some2(o.value);
var optionArbitrary = (value) => {
  const placeholder = lazy(() => any).pipe(annotations({
    [ArbitraryHookId]: () => value
  }));
  const arb = unsafeTo(optionFrom(placeholder));
  return (fc) => arb(fc).map(optionDecode);
};
var optionPretty = (value) => match({
  onNone: () => "none()",
  onSome: (a) => `some(${value(a)})`
});
var optionFromSelf = (value) => {
  return declare([value], optionFrom(value), (isDecoding, value2) => {
    const parse2 = isDecoding ? parse(value2) : encode(value2);
    return (u, options, ast) => !isOption2(u) ? fail3(type(ast, u)) : isNone2(u) ? succeed2(none2()) : map11(parse2(u.value, options), some2);
  }, {
    [IdentifierAnnotationId]: "Option",
    [PrettyHookId]: optionPretty,
    [ArbitraryHookId]: optionArbitrary,
    [EquivalenceHookId]: getEquivalence
  });
};
var bigDecimalPretty = () => (val) => `BigDecimal(${format2(normalize(val))})`;
var bigDecimalArbitrary = () => (fc) => fc.tuple(fc.bigInt(), fc.integer()).map(([value, scale2]) => make3(value, scale2));
var BigDecimalFromSelf = /* @__PURE__ */ declare([], /* @__PURE__ */ struct({}), () => (u, _, ast) => !isBigDecimal(u) ? fail3(type(ast, u)) : succeed2(u), {
  [IdentifierAnnotationId]: "BigDecimal",
  [PrettyHookId]: bigDecimalPretty,
  [ArbitraryHookId]: bigDecimalArbitrary,
  [EquivalenceHookId]: () => Equivalence
});

// src/effect.ts
var Person = struct({
  name: string2,
  age: number4
});
var parsePerson = parse(Person);
var input = { name: "Alice", age: 30 };
var result1 = parsePerson(input);
console.log(result1);
