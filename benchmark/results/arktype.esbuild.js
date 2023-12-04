// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/errors.js
var InternalArktypeError = class extends Error {
};
var throwInternalError = (message) => {
  throw new InternalArktypeError(message);
};
var ParseError = class extends Error {
};
var throwParseError = (message) => {
  throw new ParseError(message);
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/domains.js
var hasDomain = (data, domain) => domainOf(data) === domain;
var domainOf = (data) => {
  const builtinType = typeof data;
  return builtinType === "object" ? data === null ? "null" : "object" : builtinType === "function" ? "object" : builtinType;
};
var domainDescriptions = {
  bigint: "a bigint",
  boolean: "boolean",
  null: "null",
  number: "a number",
  object: "an object",
  string: "a string",
  symbol: "a symbol",
  undefined: "undefined"
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/generics.js
var isKeyOf = (k, obj) => k in obj;
var entriesOf = (o) => Object.entries(o);
var objectKeysOf = (o) => Object.keys(o);
var prototypeKeysOf = (value) => {
  const result = [];
  while (value !== Object.prototype && value !== null && value !== void 0) {
    for (const k of Object.getOwnPropertyNames(value)) {
      if (!result.includes(k)) {
        result.push(k);
      }
    }
    for (const symbol of Object.getOwnPropertySymbols(value)) {
      if (!result.includes(symbol)) {
        result.push(symbol);
      }
    }
    value = Object.getPrototypeOf(value);
  }
  return result;
};
var hasKey = (o, k) => {
  const valueAtKey = o?.[k];
  return valueAtKey !== void 0 && valueAtKey !== null;
};
var keyCount = (o) => Object.keys(o).length;
var hasKeys = (value) => hasDomain(value, "object") ? Object.keys(value).length !== 0 : false;
var id = Symbol("id");
var listFrom = (data) => Array.isArray(data) ? data : [
  data
];

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/paths.js
var Path = class _Path extends Array {
  static fromString(s, delimiter = "/") {
    return s === delimiter ? new _Path() : new _Path(...s.split(delimiter));
  }
  toString(delimiter = "/") {
    return this.length ? this.join(delimiter) : delimiter;
  }
};
var getPath = (root, path) => {
  let result = root;
  for (const segment of path) {
    if (typeof result !== "object" || result === null) {
      return void 0;
    }
    result = result[segment];
  }
  return result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/numericLiterals.js
var wellFormedNumberMatcher = /^(?!^-0$)-?(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
var isWellFormedNumber = (s) => wellFormedNumberMatcher.test(s);
var numberLikeMatcher = /^-?\d*\.?\d*$/;
var isNumberLike = (s) => s.length !== 0 && numberLikeMatcher.test(s);
var wellFormedIntegerMatcher = /^(?:0|(?:-?[1-9]\d*))$/;
var isWellFormedInteger = (s) => wellFormedIntegerMatcher.test(s);
var wellFormedNonNegativeIntegerMatcher = /^(?:0|(?:[1-9]\d*))$/;
var integerLikeMatcher = /^-?\d+$/;
var isIntegerLike = (s) => integerLikeMatcher.test(s);
var numericLiteralDescriptions = {
  number: "a number",
  bigint: "a bigint",
  integer: "an integer"
};
var writeMalformedNumericLiteralMessage = (def, kind) => `'${def}' was parsed as ${numericLiteralDescriptions[kind]} but could not be narrowed to a literal value. Avoid unnecessary leading or trailing zeros and other abnormal notation`;
var isWellFormed = (def, kind) => kind === "number" ? isWellFormedNumber(def) : isWellFormedInteger(def);
var parseKind = (def, kind) => kind === "number" ? Number(def) : Number.parseInt(def);
var isKindLike = (def, kind) => kind === "number" ? isNumberLike(def) : isIntegerLike(def);
var tryParseWellFormedNumber = (token, errorOnFail) => parseWellFormed(token, "number", errorOnFail);
var tryParseWellFormedInteger = (token, errorOnFail) => parseWellFormed(token, "integer", errorOnFail);
var parseWellFormed = (token, kind, errorOnFail) => {
  const value = parseKind(token, kind);
  if (!Number.isNaN(value)) {
    if (isWellFormed(token, kind)) {
      return value;
    }
    if (isKindLike(token, kind)) {
      return throwParseError(writeMalformedNumericLiteralMessage(token, kind));
    }
  }
  return errorOnFail ? throwParseError(errorOnFail === true ? `Failed to parse ${numericLiteralDescriptions[kind]} from '${token}'` : errorOnFail) : void 0;
};
var tryParseWellFormedBigint = (def) => {
  if (def[def.length - 1] !== "n") {
    return;
  }
  const maybeIntegerLiteral = def.slice(0, -1);
  let value;
  try {
    value = BigInt(maybeIntegerLiteral);
  } catch {
    return;
  }
  if (wellFormedIntegerMatcher.test(maybeIntegerLiteral)) {
    return value;
  }
  if (integerLikeMatcher.test(maybeIntegerLiteral)) {
    return throwParseError(writeMalformedNumericLiteralMessage(def, "bigint"));
  }
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/serialize.js
var stringify = (data, indent) => {
  switch (domainOf(data)) {
    case "object":
      return JSON.stringify(serializeRecurse(data, stringifyOpts, []), null, indent);
    case "symbol":
      return stringifyOpts.onSymbol(data);
    default:
      return serializePrimitive(data);
  }
};
var stringifyOpts = {
  onCycle: () => "(cycle)",
  onSymbol: (v) => `(symbol${v.description && ` ${v.description}`})`,
  onFunction: (v) => `(function${v.name && ` ${v.name}`})`
};
var serializeRecurse = (data, context, seen) => {
  switch (domainOf(data)) {
    case "object":
      if (typeof data === "function") {
        return stringifyOpts.onFunction(data);
      }
      if (seen.includes(data)) {
        return "(cycle)";
      }
      const nextSeen = [
        ...seen,
        data
      ];
      if (Array.isArray(data)) {
        return data.map((item) => serializeRecurse(item, context, nextSeen));
      }
      const result = {};
      for (const k in data) {
        result[k] = serializeRecurse(data[k], context, nextSeen);
      }
      return result;
    case "symbol":
      return stringifyOpts.onSymbol(data);
    case "bigint":
      return `${data}n`;
    case "undefined":
      return "undefined";
    default:
      return data;
  }
};
var serializePrimitive = (value) => typeof value === "string" ? `'${value}'` : typeof value === "bigint" ? `${value}n` : `${value}`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/compose.js
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var composeIntersection = (reducer) => (l, r, state) => l === void 0 ? r === void 0 ? throwInternalError(undefinedOperandsMessage) : r : r === void 0 ? l : reducer(l, r, state);
var undefinedOperandsMessage = `Unexpected operation two undefined operands`;
var disjointDescriptionWriters = {
  domain: ({ l, r }) => `${l.join(", ")} and ${r.join(", ")}`,
  range: ({ l, r }) => `${stringifyRange(l)} and ${stringifyRange(r)}`,
  class: ({ l, r }) => `classes ${typeof l === "string" ? l : l.name} and ${typeof r === "string" ? r : r.name}`,
  tupleLength: ({ l, r }) => `tuples of length ${l} and ${r}`,
  value: ({ l, r }) => `literal values ${stringify(l)} and ${stringify(r)}`,
  leftAssignability: ({ l, r }) => `literal value ${stringify(l.value)} and ${stringify(r)}`,
  rightAssignability: ({ l, r }) => `literal value ${stringify(r.value)} and ${stringify(l)}`,
  union: ({ l, r }) => `branches ${stringify(l)} and branches ${stringify(r)}`
};
var stringifyRange = (range) => "limit" in range ? `the range of exactly ${range.limit}` : range.min ? range.max ? `the range bounded by ${range.min.comparator}${range.min.limit} and ${range.max.comparator}${range.max.limit}` : `${range.min.comparator}${range.min.limit}` : range.max ? `${range.max.comparator}${range.max.limit}` : "the unbounded range";
var _disjoints = /* @__PURE__ */ new WeakMap();
var IntersectionState = class {
  get disjoints() {
    return _classPrivateFieldGet(this, _disjoints);
  }
  addDisjoint(kind, l, r) {
    _classPrivateFieldGet(this, _disjoints)[`${this.path}`] = {
      kind,
      l,
      r,
      lOptional: this.lOptional,
      rOptional: this.rOptional
    };
    return empty;
  }
  constructor(type2, lastOperator) {
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "lastOperator", void 0);
    _defineProperty(this, "path", void 0);
    _defineProperty(this, "lOptional", void 0);
    _defineProperty(this, "rOptional", void 0);
    _defineProperty(this, "domain", void 0);
    _classPrivateFieldInit(this, _disjoints, {
      writable: true,
      value: void 0
    });
    this.type = type2;
    this.lastOperator = lastOperator;
    this.path = new Path();
    this.lOptional = false;
    this.rOptional = false;
    _classPrivateFieldSet(this, _disjoints, {});
  }
};
var empty = Symbol("empty");
var anonymousDisjoint = () => empty;
var isDisjoint = (result) => result === empty;
var equal = Symbol("equal");
var equality = () => equal;
var isEquality = (result) => result === equal;
var composeKeyedIntersection = (reducer, config) => (l, r, state) => {
  const result = {};
  const keys = objectKeysOf({
    ...l,
    ...r
  });
  let lImpliesR = true;
  let rImpliesL = true;
  for (const k of keys) {
    const keyResult = typeof reducer === "function" ? reducer(k, l[k], r[k], state) : reducer[k](l[k], r[k], state);
    if (isEquality(keyResult)) {
      if (l[k] !== void 0) {
        result[k] = l[k];
      }
    } else if (isDisjoint(keyResult)) {
      if (config.onEmpty === "omit") {
        lImpliesR = false;
        rImpliesL = false;
      } else {
        return empty;
      }
    } else {
      if (keyResult !== void 0) {
        result[k] = keyResult;
      }
      lImpliesR && (lImpliesR = keyResult === l[k]);
      rImpliesL && (rImpliesL = keyResult === r[k]);
    }
  }
  return lImpliesR ? rImpliesL ? equality() : l : rImpliesL ? r : result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/intersection.js
var compileDisjointReasonsMessage = (disjoints) => {
  const paths = objectKeysOf(disjoints);
  if (paths.length === 1) {
    const path = paths[0];
    return `${path === "/" ? "" : `At ${path}: `}Intersection of ${disjointDescriptionWriters[disjoints[path].kind](disjoints[path])} results in an unsatisfiable type`;
  }
  let message = `
        "Intersection results in unsatisfiable types at the following paths:
`;
  for (const path in disjoints) {
    message += `  ${path}: ${disjointDescriptionWriters[disjoints[path].kind](disjoints[path])}
`;
  }
  return message;
};
var writeImplicitNeverMessage = (path, operator, description) => `${path.length ? `At ${path}: ` : ""}${operator} ${description ? `${description} ` : ""}results in an unsatisfiable type`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/objectKinds.js
var defaultObjectKinds = {
  Array,
  Date,
  Error,
  Function,
  Map,
  RegExp,
  Set,
  Object,
  String,
  Number,
  Boolean,
  WeakMap,
  WeakSet,
  Promise
};
var objectKindOf = (data, kinds) => {
  if (domainOf(data) !== "object") {
    return void 0;
  }
  const kindSet = kinds ?? defaultObjectKinds;
  let prototype = Object.getPrototypeOf(data);
  while (prototype?.constructor && (!kindSet[prototype.constructor.name] || !(data instanceof kindSet[prototype.constructor.name]))) {
    prototype = Object.getPrototypeOf(prototype);
  }
  return prototype?.constructor?.name;
};
var isArray = (data) => Array.isArray(data);
var objectKindDescriptions = {
  Object: "an object",
  Array: "an array",
  Function: "a function",
  Date: "a Date",
  RegExp: "a RegExp",
  Error: "an Error",
  Map: "a Map",
  Set: "a Set",
  String: "a String object",
  Number: "a Number object",
  Boolean: "a Boolean object",
  Promise: "a Promise",
  WeakMap: "a WeakMap",
  WeakSet: "a WeakSet"
};
var getExactConstructorObjectKind = (constructor) => {
  const constructorName = Object(constructor).name;
  return constructorName && isKeyOf(constructorName, defaultObjectKinds) && defaultObjectKinds[constructorName] === constructor ? constructorName : void 0;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/class.js
var classIntersection = composeIntersection((l, r, state) => {
  return l === r ? equality() : l instanceof r ? l : r instanceof l ? r : state.addDisjoint("class", l, r);
});
var checkClass = (expectedClass, state) => {
  if (typeof expectedClass === "string") {
    return objectKindOf(state.data) === expectedClass || !state.problems.add("class", expectedClass);
  }
  return state.data instanceof expectedClass || !state.problems.add("class", expectedClass);
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/collapsibleSet.js
var collapsibleListUnion = (l, r) => {
  if (Array.isArray(l)) {
    if (Array.isArray(r)) {
      const result = listUnion(l, r);
      return result.length === l.length ? result.length === r.length ? equality() : l : result.length === r.length ? r : result;
    }
    return l.includes(r) ? l : [
      ...l,
      r
    ];
  }
  if (Array.isArray(r)) {
    return r.includes(l) ? r : [
      ...r,
      l
    ];
  }
  return l === r ? equality() : [
    l,
    r
  ];
};
var listUnion = (l, r) => {
  const result = [
    ...l
  ];
  for (const expression of r) {
    if (!l.includes(expression)) {
      result.push(expression);
    }
  }
  return result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/divisor.js
var divisorIntersection = composeIntersection((l, r) => l === r ? equality() : Math.abs(l * r / greatestCommonDivisor(l, r)));
var greatestCommonDivisor = (l, r) => {
  let previous;
  let greatestCommonDivisor2 = l;
  let current = r;
  while (current !== 0) {
    previous = current;
    current = greatestCommonDivisor2 % current;
    greatestCommonDivisor2 = previous;
  }
  return greatestCommonDivisor2;
};
var checkDivisor = (divisor, state) => state.data % divisor === 0 || !state.problems.add("divisor", divisor);

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/props.js
var isOptional = (prop) => prop[0] === "?";
var isPrerequisite = (prop) => prop[0] === "!";
var mappedKeys = {
  index: "[index]"
};
var propToNode = (prop) => isOptional(prop) || isPrerequisite(prop) ? prop[1] : prop;
var getTupleLengthIfPresent = (result) => {
  if (typeof result.length === "object" && isPrerequisite(result.length) && typeof result.length[1] !== "string" && isLiteralNode(result.length[1], "number")) {
    return result.length[1].number.value;
  }
};
var propsIntersection = composeIntersection((l, r, state) => {
  const result = propKeysIntersection(l, r, state);
  if (typeof result === "symbol") {
    return result;
  }
  const lengthValue = getTupleLengthIfPresent(result);
  if (lengthValue === void 0 || !(mappedKeys.index in result)) {
    return result;
  }
  const { [mappedKeys.index]: indexProp, ...updatedResult } = result;
  const indexNode = propToNode(indexProp);
  for (let i = 0; i < lengthValue; i++) {
    if (!updatedResult[i]) {
      updatedResult[i] = indexNode;
      continue;
    }
    const existingNodeAtIndex = propToNode(updatedResult[i]);
    state.path.push(`${i}`);
    const updatedResultAtIndex = nodeIntersection(existingNodeAtIndex, indexNode, state);
    state.path.pop();
    if (isDisjoint(updatedResultAtIndex)) {
      return updatedResultAtIndex;
    } else if (!isEquality(updatedResultAtIndex) && updatedResultAtIndex !== existingNodeAtIndex) {
      updatedResult[i] = updatedResultAtIndex;
    }
  }
  return updatedResult;
});
var propKeysIntersection = composeKeyedIntersection((propKey, l, r, context) => {
  if (l === void 0) {
    return r === void 0 ? equality() : r;
  }
  if (r === void 0) {
    return l;
  }
  context.path.push(propKey);
  const previousLOptional = context.lOptional;
  const previousROptional = context.rOptional;
  (_context = context).lOptional || (_context.lOptional = isOptional(l));
  (_context1 = context).rOptional || (_context1.rOptional = isOptional(r));
  const result = nodeIntersection(propToNode(l), propToNode(r), context);
  const resultIsOptional = context.lOptional && context.rOptional;
  context.rOptional = previousROptional;
  context.lOptional = previousLOptional;
  context.path.pop();
  if (isDisjoint(result) && resultIsOptional) {
    var _context, _context1;
    return {};
  }
  return result;
}, {
  onEmpty: "bubble"
});
var flattenProps = (entries, props, ctx) => {
  const keyConfig = ctx.type.config?.keys ?? ctx.type.scope.config.keys;
  return keyConfig === "loose" ? flattenLooseProps(entries, props, ctx) : flattenPropsRecord(keyConfig, entries, props, ctx);
};
var flattenLooseProps = (entries, props, ctx) => {
  for (const k in props) {
    const prop = props[k];
    ctx.path.push(k);
    if (k === mappedKeys.index) {
      entries.push([
        "indexProp",
        flattenNode(propToNode(prop), ctx)
      ]);
    } else if (isOptional(prop)) {
      entries.push([
        "optionalProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else if (isPrerequisite(prop)) {
      entries.push([
        "prerequisiteProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else {
      entries.push([
        "requiredProp",
        [
          k,
          flattenNode(prop, ctx)
        ]
      ]);
    }
    ctx.path.pop();
  }
};
var flattenPropsRecord = (kind, entries, props, ctx) => {
  const result = {
    required: {},
    optional: {}
  };
  for (const k in props) {
    const prop = props[k];
    ctx.path.push(k);
    if (k === mappedKeys.index) {
      result.index = flattenNode(propToNode(prop), ctx);
    } else if (isOptional(prop)) {
      result.optional[k] = flattenNode(prop[1], ctx);
    } else if (isPrerequisite(prop)) {
      entries.push([
        "prerequisiteProp",
        [
          k,
          flattenNode(prop[1], ctx)
        ]
      ]);
    } else {
      result.required[k] = flattenNode(prop, ctx);
    }
    ctx.path.pop();
  }
  entries.push([
    `${kind}Props`,
    result
  ]);
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/data.js
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var sizeOf = (data) => typeof data === "string" || Array.isArray(data) ? data.length : typeof data === "number" ? data : 0;
var unitsOf = (data) => typeof data === "string" ? "characters" : Array.isArray(data) ? "items long" : "";
var DataWrapper = class {
  toString() {
    return stringify(this.value);
  }
  get domain() {
    return domainOf(this.value);
  }
  get size() {
    return sizeOf(this.value);
  }
  get units() {
    return unitsOf(this.value);
  }
  get className() {
    return Object(this.value).constructor.name;
  }
  constructor(value) {
    _defineProperty2(this, "value", void 0);
    this.value = value;
  }
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/range.js
var minComparators = {
  ">": true,
  ">=": true
};
var maxComparators = {
  "<": true,
  "<=": true
};
var isEqualityRange = (range) => "comparator" in range;
var rangeIntersection = composeIntersection((l, r, state) => {
  if (isEqualityRange(l)) {
    if (isEqualityRange(r)) {
      return l.limit === r.limit ? equality() : state.addDisjoint("range", l, r);
    }
    return rangeAllows(r, l.limit) ? l : state.addDisjoint("range", l, r);
  }
  if (isEqualityRange(r)) {
    return rangeAllows(l, r.limit) ? r : state.addDisjoint("range", l, r);
  }
  const stricterMin = compareStrictness("min", l.min, r.min);
  const stricterMax = compareStrictness("max", l.max, r.max);
  if (stricterMin === "l") {
    if (stricterMax === "r") {
      return compareStrictness("min", l.min, r.max) === "l" ? state.addDisjoint("range", l, r) : {
        min: l.min,
        max: r.max
      };
    }
    return l;
  }
  if (stricterMin === "r") {
    if (stricterMax === "l") {
      return compareStrictness("max", l.max, r.min) === "l" ? state.addDisjoint("range", l, r) : {
        min: r.min,
        max: l.max
      };
    }
    return r;
  }
  return stricterMax === "l" ? l : stricterMax === "r" ? r : equality();
});
var rangeAllows = (range, n) => isEqualityRange(range) ? n === range.limit : minAllows(range.min, n) && maxAllows(range.max, n);
var minAllows = (min, n) => !min || n > min.limit || n === min.limit && !isExclusive(min.comparator);
var maxAllows = (max, n) => !max || n < max.limit || n === max.limit && !isExclusive(max.comparator);
var flattenRange = (entries, range, ctx) => {
  const units = ctx.lastDomain === "string" ? "characters" : ctx.lastDomain === "object" ? "items long" : void 0;
  if (isEqualityRange(range)) {
    return entries.push([
      "bound",
      units ? {
        ...range,
        units
      } : range
    ]);
  }
  if (range.min) {
    entries.push([
      "bound",
      units ? {
        ...range.min,
        units
      } : range.min
    ]);
  }
  if (range.max) {
    entries.push([
      "bound",
      units ? {
        ...range.max,
        units
      } : range.max
    ]);
  }
};
var checkBound = (bound, state) => comparatorCheckers[bound.comparator](sizeOf(state.data), bound.limit) || !state.problems.add("bound", bound);
var comparatorCheckers = {
  "<": (size, limit) => size < limit,
  ">": (size, limit) => size > limit,
  "<=": (size, limit) => size <= limit,
  ">=": (size, limit) => size >= limit,
  "==": (size, limit) => size === limit
};
var compareStrictness = (kind, l, r) => !l ? !r ? "=" : "r" : !r ? "l" : l.limit === r.limit ? isExclusive(l.comparator) ? isExclusive(r.comparator) ? "=" : "l" : isExclusive(r.comparator) ? "r" : "=" : kind === "min" ? l.limit > r.limit ? "l" : "r" : l.limit < r.limit ? "l" : "r";
var isExclusive = (comparator) => comparator.length === 1;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/regex.js
var regexCache = {};
var getRegex = (source) => {
  if (!regexCache[source]) {
    regexCache[source] = new RegExp(source);
  }
  return regexCache[source];
};
var checkRegex = (source, state) => getRegex(source).test(state.data) || !state.problems.add("regex", `/${source}/`);
var regexIntersection = composeIntersection(collapsibleListUnion);

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/rules/rules.js
var rulesIntersection = (l, r, state) => "value" in l ? "value" in r ? l.value === r.value ? equality() : state.addDisjoint("value", l.value, r.value) : literalSatisfiesRules(l.value, r, state) ? l : state.addDisjoint("leftAssignability", l, r) : "value" in r ? literalSatisfiesRules(r.value, l, state) ? r : state.addDisjoint("rightAssignability", l, r) : narrowableRulesIntersection(l, r, state);
var narrowIntersection = composeIntersection(collapsibleListUnion);
var narrowableRulesIntersection = composeKeyedIntersection({
  divisor: divisorIntersection,
  regex: regexIntersection,
  props: propsIntersection,
  class: classIntersection,
  range: rangeIntersection,
  narrow: narrowIntersection
}, {
  onEmpty: "bubble"
});
var flattenRules = (rules, ctx) => {
  const entries = [];
  let k;
  for (k in rules) {
    ruleFlatteners[k](entries, rules[k], ctx);
  }
  return entries.sort((l, r) => precedenceMap[l[0]] - precedenceMap[r[0]]);
};
var ruleFlatteners = {
  regex: (entries, rule) => {
    for (const source of listFrom(rule)) {
      entries.push([
        "regex",
        source
      ]);
    }
  },
  divisor: (entries, rule) => {
    entries.push([
      "divisor",
      rule
    ]);
  },
  range: flattenRange,
  class: (entries, rule) => {
    entries.push([
      "class",
      rule
    ]);
  },
  props: flattenProps,
  narrow: (entries, rule) => {
    for (const narrow2 of listFrom(rule)) {
      entries.push([
        "narrow",
        narrow2
      ]);
    }
  },
  value: (entries, rule) => {
    entries.push([
      "value",
      rule
    ]);
  }
};
var precedenceMap = {
  // Config: Applies before any checks
  config: -1,
  // Critical: No other checks are performed if these fail
  domain: 0,
  value: 0,
  domains: 0,
  branches: 0,
  switch: 0,
  alias: 0,
  class: 0,
  // Shallow: All shallow checks will be performed even if one or more fail
  regex: 1,
  divisor: 1,
  bound: 1,
  // Prerequisite: These are deep checks with special priority, e.g. the
  // length of a tuple, which causes other deep props not to be checked if it
  // is invalid
  prerequisiteProp: 2,
  // Deep: Performed if all shallow checks pass, even if one or more deep checks fail
  distilledProps: 3,
  strictProps: 3,
  requiredProp: 3,
  optionalProp: 3,
  indexProp: 3,
  // Narrow: Only performed if all shallow and deep checks pass
  narrow: 4,
  // Morph: Only performed if all validation passes
  morph: 5
};
var literalSatisfiesRules = (data, rules, state) => !state.type.scope.type([
  "node",
  {
    [state.domain]: rules
  }
])(data).problems;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/branch.js
var isBranchComparison = (comparison) => comparison?.lBranches !== void 0;
var compareBranches = (lConditions, rConditions, state) => {
  const result = {
    lBranches: lConditions,
    rBranches: rConditions,
    lExtendsR: [],
    rExtendsL: [],
    equalities: [],
    distinctIntersections: []
  };
  const pairs = rConditions.map((condition) => ({
    condition,
    distinct: []
  }));
  lConditions.forEach((l, lIndex) => {
    let lImpliesR = false;
    const distinct = pairs.map((rPairs, rIndex) => {
      if (lImpliesR || !rPairs.distinct) {
        return null;
      }
      const r = rPairs.condition;
      const subresult = branchIntersection(l, r, state);
      if (isDisjoint(subresult)) {
        return null;
      } else if (subresult === l) {
        result.lExtendsR.push(lIndex);
        lImpliesR = true;
        return null;
      } else if (subresult === r) {
        result.rExtendsL.push(rIndex);
        rPairs.distinct = null;
        return null;
      } else if (isEquality(subresult)) {
        result.equalities.push([
          lIndex,
          rIndex
        ]);
        lImpliesR = true;
        rPairs.distinct = null;
        return null;
      } else if (hasDomain(subresult, "object")) {
        return subresult;
      }
      return throwInternalError(`Unexpected predicate intersection result of type '${domainOf(subresult)}'`);
    });
    if (!lImpliesR) {
      for (let i = 0; i < pairs.length; i++) {
        if (distinct[i]) {
          pairs[i].distinct?.push(distinct[i]);
        }
      }
    }
  });
  result.distinctIntersections = pairs.flatMap((pairs2) => pairs2.distinct ?? []);
  return result;
};
var isTransformationBranch = (branch) => "rules" in branch;
var flattenBranch = (branch, ctx) => {
  if (isTransformationBranch(branch)) {
    const result = flattenRules(branch.rules, ctx);
    if (branch.morph) {
      if (typeof branch.morph === "function") {
        result.push([
          "morph",
          branch.morph
        ]);
      } else {
        for (const morph2 of branch.morph) {
          result.push([
            "morph",
            morph2
          ]);
        }
      }
    }
    return result;
  }
  return flattenRules(branch, ctx);
};
var rulesOf = (branch) => branch.rules ?? branch;
var branchIntersection = (l, r, state) => {
  const lRules = rulesOf(l);
  const rRules = rulesOf(r);
  const rulesResult = rulesIntersection(lRules, rRules, state);
  if ("morph" in l) {
    if ("morph" in r) {
      if (l.morph === r.morph) {
        return isEquality(rulesResult) || isDisjoint(rulesResult) ? rulesResult : {
          rules: rulesResult,
          morph: l.morph
        };
      }
      return state.lastOperator === "&" ? throwParseError(writeImplicitNeverMessage(state.path, "Intersection", "of morphs")) : {};
    }
    return isDisjoint(rulesResult) ? rulesResult : {
      rules: isEquality(rulesResult) ? l.rules : rulesResult,
      morph: l.morph
    };
  }
  if ("morph" in r) {
    return isDisjoint(rulesResult) ? rulesResult : {
      rules: isEquality(rulesResult) ? r.rules : rulesResult,
      morph: r.morph
    };
  }
  return rulesResult;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/union.js
var writeUndiscriminatableMorphUnionMessage = (path) => `${path === "/" ? "A" : `At ${path}, a`} union including one or more morphs must be discriminatable`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/discriminate.js
var flattenBranches = (branches, ctx) => {
  const discriminants = calculateDiscriminants(branches, ctx);
  const indices = branches.map((_, i) => i);
  return discriminate(branches, indices, discriminants, ctx);
};
var discriminate = (originalBranches, remainingIndices, discriminants, ctx) => {
  if (remainingIndices.length === 1) {
    return flattenBranch(originalBranches[remainingIndices[0]], ctx);
  }
  const bestDiscriminant = findBestDiscriminant(remainingIndices, discriminants);
  if (!bestDiscriminant) {
    return [
      [
        "branches",
        remainingIndices.map((i) => branchIncludesMorph(originalBranches[i], ctx.type.scope) ? throwParseError(writeUndiscriminatableMorphUnionMessage(`${ctx.path}`)) : flattenBranch(originalBranches[i], ctx))
      ]
    ];
  }
  const cases = {};
  for (const caseKey in bestDiscriminant.indexCases) {
    const nextIndices = bestDiscriminant.indexCases[caseKey];
    cases[caseKey] = discriminate(originalBranches, nextIndices, discriminants, ctx);
    if (caseKey !== "default") {
      pruneDiscriminant(cases[caseKey], bestDiscriminant.path, bestDiscriminant, ctx);
    }
  }
  return [
    [
      "switch",
      {
        path: bestDiscriminant.path,
        kind: bestDiscriminant.kind,
        cases
      }
    ]
  ];
};
var pruneDiscriminant = (entries, segments, discriminant, ctx) => {
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    if (!segments.length) {
      if (discriminant.kind === "domain") {
        if (k === "domain" || k === "domains") {
          entries.splice(i, 1);
          return;
        } else if (k === "class" || k === "value") {
          return;
        }
      } else if (discriminant.kind === k) {
        entries.splice(i, 1);
        return;
      }
    } else if ((k === "requiredProp" || k === "prerequisiteProp" || k === "optionalProp") && v[0] === segments[0]) {
      if (typeof v[1] === "string") {
        if (discriminant.kind !== "domain") {
          return throwInternalPruneFailure(discriminant);
        }
        entries.splice(i, 1);
        return;
      }
      pruneDiscriminant(v[1], segments.slice(1), discriminant, ctx);
      if (v[1].length === 0) {
        entries.splice(i, 1);
      }
      return;
    }
    if (k === "domains") {
      if (keyCount(v) !== 1 || !v.object) {
        return throwInternalPruneFailure(discriminant);
      }
      pruneDiscriminant(v.object, segments, discriminant, ctx);
      return;
    } else if (k === "switch") {
      for (const caseKey in v.cases) {
        pruneDiscriminant(v.cases[caseKey], segments, discriminant, ctx);
      }
      return;
    } else if (k === "branches") {
      for (const branch of v) {
        pruneDiscriminant(branch, segments, discriminant, ctx);
      }
      return;
    }
  }
  return throwInternalPruneFailure(discriminant);
};
var throwInternalPruneFailure = (discriminant) => throwInternalError(`Unexpectedly failed to discriminate ${discriminant.kind} at path '${discriminant.path}'`);
var discriminantKinds = {
  domain: true,
  class: true,
  value: true
};
var calculateDiscriminants = (branches, ctx) => {
  const discriminants = {
    disjointsByPair: {},
    casesByDisjoint: {}
  };
  for (let lIndex = 0; lIndex < branches.length - 1; lIndex++) {
    for (let rIndex = lIndex + 1; rIndex < branches.length; rIndex++) {
      const pairKey = `${lIndex}/${rIndex}`;
      const pairDisjoints = [];
      discriminants.disjointsByPair[pairKey] = pairDisjoints;
      const intersectionState = new IntersectionState(ctx.type, "|");
      branchIntersection(branches[lIndex], branches[rIndex], intersectionState);
      for (const path in intersectionState.disjoints) {
        if (path.includes(mappedKeys.index)) {
          continue;
        }
        const { l, r, kind, lOptional, rOptional } = intersectionState.disjoints[path];
        if (!isKeyOf(kind, discriminantKinds)) {
          continue;
        }
        if (lOptional || rOptional) {
          continue;
        }
        const lSerialized = serializeDefinitionIfAllowed(kind, l);
        const rSerialized = serializeDefinitionIfAllowed(kind, r);
        if (lSerialized === void 0 || rSerialized === void 0) {
          continue;
        }
        const qualifiedDisjoint = path === "/" ? kind : `${path}/${kind}`;
        pairDisjoints.push(qualifiedDisjoint);
        if (!discriminants.casesByDisjoint[qualifiedDisjoint]) {
          discriminants.casesByDisjoint[qualifiedDisjoint] = {
            [lSerialized]: [
              lIndex
            ],
            [rSerialized]: [
              rIndex
            ]
          };
          continue;
        }
        const cases = discriminants.casesByDisjoint[qualifiedDisjoint];
        const existingLBranch = cases[lSerialized];
        if (!existingLBranch) {
          cases[lSerialized] = [
            lIndex
          ];
        } else if (!existingLBranch.includes(lIndex)) {
          existingLBranch.push(lIndex);
        }
        const existingRBranch = cases[rSerialized];
        if (!existingRBranch) {
          cases[rSerialized] = [
            rIndex
          ];
        } else if (!existingRBranch.includes(rIndex)) {
          existingRBranch.push(rIndex);
        }
      }
    }
  }
  return discriminants;
};
var parseQualifiedDisjoint = (qualifiedDisjoint) => {
  const path = Path.fromString(qualifiedDisjoint);
  return [
    path,
    path.pop()
  ];
};
var findBestDiscriminant = (remainingIndices, discriminants) => {
  let bestDiscriminant;
  for (let i = 0; i < remainingIndices.length - 1; i++) {
    const lIndex = remainingIndices[i];
    for (let j = i + 1; j < remainingIndices.length; j++) {
      const rIndex = remainingIndices[j];
      const candidates = discriminants.disjointsByPair[`${lIndex}/${rIndex}`];
      for (const qualifiedDisjoint of candidates) {
        const indexCases = discriminants.casesByDisjoint[qualifiedDisjoint];
        const filteredCases = {};
        const defaultCases = [
          ...remainingIndices
        ];
        let score = 0;
        for (const caseKey in indexCases) {
          const filteredIndices = indexCases[caseKey].filter((i2) => {
            const remainingIndex = remainingIndices.indexOf(i2);
            if (remainingIndex !== -1) {
              delete defaultCases[remainingIndex];
              return true;
            }
          });
          if (filteredIndices.length === 0) {
            continue;
          }
          filteredCases[caseKey] = filteredIndices;
          score++;
        }
        const defaultCaseKeys = objectKeysOf(defaultCases);
        if (defaultCaseKeys.length) {
          filteredCases["default"] = defaultCaseKeys.map((k) => parseInt(k));
        }
        if (!bestDiscriminant || score > bestDiscriminant.score) {
          const [path, kind] = parseQualifiedDisjoint(qualifiedDisjoint);
          bestDiscriminant = {
            path,
            kind,
            indexCases: filteredCases,
            score
          };
          if (score === remainingIndices.length) {
            return bestDiscriminant;
          }
        }
      }
    }
  }
  return bestDiscriminant;
};
var serializeDefinitionIfAllowed = (kind, definition) => {
  switch (kind) {
    case "value":
      return serializeIfPrimitive(definition);
    case "domain":
      return definition;
    case "class":
      return getExactConstructorObjectKind(definition);
    default:
      return;
  }
};
var serializeIfPrimitive = (data) => {
  const domain = domainOf(data);
  return domain === "object" || domain === "symbol" ? void 0 : serializePrimitive(data);
};
var serializeData = {
  value: (data) => serializeIfPrimitive(data) ?? "default",
  class: (data) => objectKindOf(data) ?? "default",
  domain: domainOf
};
var serializeCase = (kind, data) => serializeData[kind](data);
var branchIncludesMorph = (branch, $) => "morph" in branch ? true : "props" in branch ? Object.values(branch.props).some((prop) => nodeIncludesMorph(propToNode(prop), $)) : false;
var nodeIncludesMorph = (node, $) => typeof node === "string" ? $.resolve(node).includesMorph : Object.values($.resolveTypeNode(node)).some((predicate) => predicate === true ? false : isArray(predicate) ? predicate.some((branch) => branchIncludesMorph(branch, $)) : branchIncludesMorph(predicate, $));

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/predicate.js
var emptyRulesIfTrue = (predicate) => predicate === true ? {} : predicate;
var comparePredicates = (l, r, context) => {
  if (l === true && r === true) {
    return equality();
  }
  if (!isArray(l) && !isArray(r)) {
    const result = branchIntersection(emptyRulesIfTrue(l), emptyRulesIfTrue(r), context);
    return result === l ? l : result === r ? r : result;
  }
  const lBranches = listFrom(emptyRulesIfTrue(l));
  const rBranches = listFrom(emptyRulesIfTrue(r));
  const comparison = compareBranches(lBranches, rBranches, context);
  if (comparison.equalities.length === lBranches.length && comparison.equalities.length === rBranches.length) {
    return equality();
  }
  if (comparison.lExtendsR.length + comparison.equalities.length === lBranches.length) {
    return l;
  }
  if (comparison.rExtendsL.length + comparison.equalities.length === rBranches.length) {
    return r;
  }
  return comparison;
};
var predicateIntersection = (domain, l, r, state) => {
  state.domain = domain;
  const comparison = comparePredicates(l, r, state);
  if (!isBranchComparison(comparison)) {
    return comparison;
  }
  const resultBranches = [
    ...comparison.distinctIntersections,
    ...comparison.equalities.map((indices) => comparison.lBranches[indices[0]]),
    ...comparison.lExtendsR.map((lIndex) => comparison.lBranches[lIndex]),
    ...comparison.rExtendsL.map((rIndex) => comparison.rBranches[rIndex])
  ];
  if (resultBranches.length === 0) {
    state.addDisjoint("union", comparison.lBranches, comparison.rBranches);
  }
  return resultBranches.length === 1 ? resultBranches[0] : resultBranches;
};
var predicateUnion = (domain, l, r, type2) => {
  const state = new IntersectionState(type2, "|");
  const comparison = comparePredicates(l, r, state);
  if (!isBranchComparison(comparison)) {
    return isEquality(comparison) || comparison === l ? r : comparison === r ? l : (
      // subtype of the other, it consists of two opposite literals
      // and can be simplified to a non-literal boolean.
      domain === "boolean" ? true : [
        emptyRulesIfTrue(l),
        emptyRulesIfTrue(r)
      ]
    );
  }
  const resultBranches = [
    ...comparison.lBranches.filter((_, lIndex) => !comparison.lExtendsR.includes(lIndex) && !comparison.equalities.some((indexPair) => indexPair[0] === lIndex)),
    ...comparison.rBranches.filter((_, rIndex) => !comparison.rExtendsL.includes(rIndex) && !comparison.equalities.some((indexPair) => indexPair[1] === rIndex))
  ];
  return resultBranches.length === 1 ? resultBranches[0] : resultBranches;
};
var flattenPredicate = (predicate, context) => {
  if (predicate === true) {
    return [];
  }
  return isArray(predicate) ? flattenBranches(predicate, context) : flattenBranch(predicate, context);
};
var isLiteralCondition = (predicate) => typeof predicate === "object" && "value" in predicate;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/nodes/node.js
var isConfigNode = (node) => "config" in node;
var nodeIntersection = (l, r, state) => {
  state.domain = void 0;
  const lDomains = state.type.scope.resolveTypeNode(l);
  const rDomains = state.type.scope.resolveTypeNode(r);
  const result = typeNodeIntersection(lDomains, rDomains, state);
  if (typeof result === "object" && !hasKeys(result)) {
    return hasKeys(state.disjoints) ? anonymousDisjoint() : state.addDisjoint("domain", objectKeysOf(lDomains), objectKeysOf(rDomains));
  }
  return result === lDomains ? l : result === rDomains ? r : result;
};
var typeNodeIntersection = composeKeyedIntersection((domain, l, r, context) => {
  if (l === void 0) {
    return r === void 0 ? throwInternalError(undefinedOperandsMessage) : void 0;
  }
  if (r === void 0) {
    return void 0;
  }
  return predicateIntersection(domain, l, r, context);
}, {
  onEmpty: "omit"
});
var rootIntersection = (l, r, type2) => {
  const state = new IntersectionState(type2, "&");
  const result = nodeIntersection(l, r, state);
  return isDisjoint(result) ? throwParseError(compileDisjointReasonsMessage(state.disjoints)) : isEquality(result) ? l : result;
};
var rootUnion = (l, r, type2) => {
  const lDomains = type2.scope.resolveTypeNode(l);
  const rDomains = type2.scope.resolveTypeNode(r);
  const result = {};
  const domains = objectKeysOf({
    ...lDomains,
    ...rDomains
  });
  for (const domain of domains) {
    result[domain] = hasKey(lDomains, domain) ? hasKey(rDomains, domain) ? predicateUnion(domain, lDomains[domain], rDomains[domain], type2) : lDomains[domain] : hasKey(rDomains, domain) ? rDomains[domain] : throwInternalError(undefinedOperandsMessage);
  }
  return result;
};
var hasImpliedDomain = (flatPredicate) => flatPredicate[0] && (flatPredicate[0][0] === "value" || flatPredicate[0][0] === "class");
var flattenType = (type2) => {
  const ctx = {
    type: type2,
    path: new Path(),
    lastDomain: "undefined"
  };
  return flattenNode(type2.node, ctx);
};
var flattenNode = (node, ctx) => {
  if (typeof node === "string") {
    return ctx.type.scope.resolve(node).flat;
  }
  const hasConfig = isConfigNode(node);
  const flattenedTypeNode = flattenTypeNode(hasConfig ? node.node : node, ctx);
  return hasConfig ? [
    [
      "config",
      {
        config: entriesOf(node.config),
        node: flattenedTypeNode
      }
    ]
  ] : flattenedTypeNode;
};
var flattenTypeNode = (node, ctx) => {
  const domains = objectKeysOf(node);
  if (domains.length === 1) {
    const domain = domains[0];
    const predicate = node[domain];
    if (predicate === true) {
      return domain;
    }
    ctx.lastDomain = domain;
    const flatPredicate = flattenPredicate(predicate, ctx);
    return hasImpliedDomain(flatPredicate) ? flatPredicate : [
      [
        "domain",
        domain
      ],
      ...flatPredicate
    ];
  }
  const result = {};
  for (const domain of domains) {
    ctx.lastDomain = domain;
    result[domain] = flattenPredicate(node[domain], ctx);
  }
  return [
    [
      "domains",
      result
    ]
  ];
};
var isLiteralNode = (node, domain) => {
  return resolutionExtendsDomain(node, domain) && isLiteralCondition(node[domain]);
};
var resolutionExtendsDomain = (resolution, domain) => {
  const domains = objectKeysOf(resolution);
  return domains.length === 1 && domains[0] === domain;
};
var toArrayNode = (node) => ({
  object: {
    class: Array,
    props: {
      [mappedKeys.index]: node
    }
  }
});

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/scanner.js
function _defineProperty3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Scanner = class _Scanner {
  /** Get lookahead and advance scanner by one */
  shift() {
    return this.chars[this.i++] ?? "";
  }
  get lookahead() {
    return this.chars[this.i] ?? "";
  }
  shiftUntil(condition) {
    let shifted = "";
    while (this.lookahead) {
      if (condition(this, shifted)) {
        if (shifted[shifted.length - 1] === _Scanner.escapeToken) {
          shifted = shifted.slice(0, -1);
        } else {
          break;
        }
      }
      shifted += this.shift();
    }
    return shifted;
  }
  shiftUntilNextTerminator() {
    this.shiftUntil(_Scanner.lookaheadIsNotWhitespace);
    return this.shiftUntil(_Scanner.lookaheadIsTerminator);
  }
  get unscanned() {
    return this.chars.slice(this.i, this.chars.length).join("");
  }
  lookaheadIs(char) {
    return this.lookahead === char;
  }
  lookaheadIsIn(tokens) {
    return this.lookahead in tokens;
  }
  constructor(def) {
    _defineProperty3(this, "chars", void 0);
    _defineProperty3(this, "i", void 0);
    _defineProperty3(this, "finalized", false);
    this.chars = [
      ...def
    ];
    this.i = 0;
  }
};
(function(Scanner2) {
  var lookaheadIsTerminator = Scanner2.lookaheadIsTerminator = (scanner) => scanner.lookahead in terminatingChars;
  var lookaheadIsNotWhitespace = Scanner2.lookaheadIsNotWhitespace = (scanner) => scanner.lookahead !== whiteSpaceToken;
  var comparatorStartChars = Scanner2.comparatorStartChars = {
    "<": true,
    ">": true,
    "=": true
  };
  var terminatingChars = Scanner2.terminatingChars = {
    ...comparatorStartChars,
    "|": true,
    "&": true,
    ")": true,
    "[": true,
    "%": true,
    " ": true
  };
  var comparators = Scanner2.comparators = {
    "<": true,
    ">": true,
    "<=": true,
    ">=": true,
    "==": true
  };
  var oneCharComparators = Scanner2.oneCharComparators = {
    "<": true,
    ">": true
  };
  var comparatorDescriptions = Scanner2.comparatorDescriptions = {
    "<": "less than",
    ">": "more than",
    "<=": "at most",
    ">=": "at least",
    "==": "exactly"
  };
  var invertedComparators = Scanner2.invertedComparators = {
    "<": ">",
    ">": "<",
    "<=": ">=",
    ">=": "<=",
    "==": "=="
  };
  var branchTokens = Scanner2.branchTokens = {
    "|": true,
    "&": true
  };
  var escapeToken = Scanner2.escapeToken = "\\";
  var whiteSpaceToken = Scanner2.whiteSpaceToken = " ";
})(Scanner || (Scanner = {}));

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/traverse/problems.js
function _checkPrivateRedeclaration2(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet2(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet2(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor2(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet2(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor2(receiver, privateMap, "get");
  return _classApplyDescriptorGet2(receiver, descriptor);
}
function _classPrivateFieldInit2(obj, privateMap, value) {
  _checkPrivateRedeclaration2(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet2(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor2(receiver, privateMap, "set");
  _classApplyDescriptorSet2(receiver, descriptor, value);
  return value;
}
function _defineProperty4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var ArkTypeError = class extends TypeError {
  constructor(problems) {
    super(`${problems}`);
    _defineProperty4(this, "cause", void 0);
    this.cause = problems;
  }
};
var Problem = class {
  toString() {
    return this.message;
  }
  get message() {
    return this.writers.addContext(this.reason, this.path);
  }
  get reason() {
    return this.writers.writeReason(this.mustBe, new DataWrapper(this.data));
  }
  get mustBe() {
    return typeof this.writers.mustBe === "string" ? this.writers.mustBe : this.writers.mustBe(this.source);
  }
  constructor(code, path, data, source, writers) {
    _defineProperty4(this, "code", void 0);
    _defineProperty4(this, "path", void 0);
    _defineProperty4(this, "data", void 0);
    _defineProperty4(this, "source", void 0);
    _defineProperty4(this, "writers", void 0);
    _defineProperty4(this, "parts", void 0);
    this.code = code;
    this.path = path;
    this.data = data;
    this.source = source;
    this.writers = writers;
    if (this.code === "multi") {
      this.parts = this.source;
    }
  }
};
var _state = /* @__PURE__ */ new WeakMap();
var ProblemArray = class extends Array {
  mustBe(description, opts) {
    return this.add("custom", description, opts);
  }
  add(code, source, opts) {
    const path = Path.from(opts?.path ?? _classPrivateFieldGet2(this, _state).path);
    const data = (
      // we have to check for the presence of the key explicitly since the
      // data could be undefined or null
      opts && "data" in opts ? opts.data : _classPrivateFieldGet2(this, _state).data
    );
    const problem = new Problem(
      // avoid a bunch of errors from TS trying to discriminate the
      // problem input based on the code
      code,
      path,
      data,
      source,
      _classPrivateFieldGet2(this, _state).getProblemConfig(code)
    );
    this.addProblem(problem);
    return problem;
  }
  addProblem(problem) {
    const pathKey = `${problem.path}`;
    const existing = this.byPath[pathKey];
    if (existing) {
      if (existing.parts) {
        existing.parts.push(problem);
      } else {
        const problemIntersection = new Problem("multi", existing.path, existing.data, [
          existing,
          problem
        ], _classPrivateFieldGet2(this, _state).getProblemConfig("multi"));
        const existingIndex = this.indexOf(existing);
        this[existingIndex === -1 ? this.length : existingIndex] = problemIntersection;
        this.byPath[pathKey] = problemIntersection;
      }
    } else {
      this.byPath[pathKey] = problem;
      this.push(problem);
    }
    this.count++;
  }
  get summary() {
    return `${this}`;
  }
  toString() {
    return this.join("\n");
  }
  throw() {
    throw new ArkTypeError(this);
  }
  constructor(state) {
    super();
    _defineProperty4(this, "byPath", {});
    _defineProperty4(this, "count", 0);
    _classPrivateFieldInit2(this, _state, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet2(this, _state, state);
  }
};
var Problems = ProblemArray;
var capitalize = (s) => s[0].toUpperCase() + s.slice(1);
var domainsToDescriptions = (domains) => domains.map((objectKind) => domainDescriptions[objectKind]);
var objectKindsToDescriptions = (kinds) => kinds.map((objectKind) => objectKindDescriptions[objectKind]);
var describeBranches = (descriptions) => {
  if (descriptions.length === 0) {
    return "never";
  }
  if (descriptions.length === 1) {
    return descriptions[0];
  }
  let description = "";
  for (let i = 0; i < descriptions.length - 1; i++) {
    description += descriptions[i];
    if (i < descriptions.length - 2) {
      description += ", ";
    }
  }
  description += ` or ${descriptions[descriptions.length - 1]}`;
  return description;
};
var writeDefaultReason = (mustBe, was) => `must be ${mustBe}${was && ` (was ${was})`}`;
var addDefaultContext = (reason, path) => path.length === 0 ? capitalize(reason) : path.length === 1 && isWellFormedInteger(path[0]) ? `Item at index ${path[0]} ${reason}` : `${path} ${reason}`;
var defaultProblemConfig = {
  divisor: {
    mustBe: (divisor) => divisor === 1 ? `an integer` : `a multiple of ${divisor}`
  },
  class: {
    mustBe: (expected) => {
      const possibleObjectKind = getExactConstructorObjectKind(expected);
      return possibleObjectKind ? objectKindDescriptions[possibleObjectKind] : `an instance of ${expected.name}`;
    },
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, data.className)
  },
  domain: {
    mustBe: (domain) => domainDescriptions[domain],
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, data.domain)
  },
  missing: {
    mustBe: () => "defined",
    writeReason: (mustBe) => writeDefaultReason(mustBe, "")
  },
  extraneous: {
    mustBe: () => "removed",
    writeReason: (mustBe) => writeDefaultReason(mustBe, "")
  },
  bound: {
    mustBe: (bound) => `${Scanner.comparatorDescriptions[bound.comparator]} ${bound.limit}${bound.units ? ` ${bound.units}` : ""}`,
    writeReason: (mustBe, data) => writeDefaultReason(mustBe, `${data.size}`)
  },
  regex: {
    mustBe: (expression) => `a string matching ${expression}`
  },
  value: {
    mustBe: stringify
  },
  branches: {
    mustBe: (branchProblems) => describeBranches(branchProblems.map((problem) => `${problem.path} must be ${problem.parts ? describeBranches(problem.parts.map((part) => part.mustBe)) : problem.mustBe}`)),
    writeReason: (mustBe, data) => `${mustBe} (was ${data})`,
    addContext: (reason, path) => path.length ? `At ${path}, ${reason}` : reason
  },
  multi: {
    mustBe: (problems) => "\u2022 " + problems.map((_) => _.mustBe).join("\n\u2022 "),
    writeReason: (mustBe, data) => `${data} must be...
${mustBe}`,
    addContext: (reason, path) => path.length ? `At ${path}, ${reason}` : reason
  },
  custom: {
    mustBe: (mustBe) => mustBe
  },
  cases: {
    mustBe: (cases) => describeBranches(cases)
  }
};
var problemCodes = objectKeysOf(defaultProblemConfig);
var compileDefaultProblemWriters = () => {
  const result = {};
  let code;
  for (code of problemCodes) {
    result[code] = {
      mustBe: defaultProblemConfig[code].mustBe,
      writeReason: defaultProblemConfig[code].writeReason ?? writeDefaultReason,
      addContext: defaultProblemConfig[code].addContext ?? addDefaultContext
    };
  }
  return result;
};
var defaultProblemWriters = compileDefaultProblemWriters();
var compileProblemWriters = (input) => {
  if (!input) {
    return defaultProblemWriters;
  }
  const result = {};
  for (const code of problemCodes) {
    result[code] = {
      mustBe: input[code]?.mustBe ?? defaultProblemConfig[code].mustBe,
      writeReason: input[code]?.writeReason ?? defaultProblemConfig[code].writeReason ?? input.writeReason ?? writeDefaultReason,
      addContext: input[code]?.addContext ?? defaultProblemConfig[code].addContext ?? input.addContext ?? addDefaultContext
    };
  }
  return result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/traverse/traverse.js
function _checkPrivateRedeclaration3(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet3(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet3(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor3(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet3(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor3(receiver, privateMap, "get");
  return _classApplyDescriptorGet3(receiver, descriptor);
}
function _classPrivateFieldInit3(obj, privateMap, value) {
  _checkPrivateRedeclaration3(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet3(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor3(receiver, privateMap, "set");
  _classApplyDescriptorSet3(receiver, descriptor, value);
  return value;
}
function _defineProperty5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var initializeTraversalConfig = () => ({
  mustBe: [],
  writeReason: [],
  addContext: [],
  keys: []
});
var problemWriterKeys = [
  "mustBe",
  "writeReason",
  "addContext"
];
var traverseRoot = (t, data) => {
  const state = new TraversalState(data, t);
  traverse(t.flat, state);
  const result = new CheckResult(state);
  if (state.problems.count) {
    result.problems = state.problems;
  } else {
    for (const [o, k] of state.entriesToPrune) {
      delete o[k];
    }
    result.data = state.data;
  }
  return result;
};
var CheckResult = class {
  constructor() {
    _defineProperty5(this, "data", void 0);
    _defineProperty5(this, "problems", void 0);
  }
};
var _seen = /* @__PURE__ */ new WeakMap();
var TraversalState = class {
  getProblemConfig(code) {
    const result = {};
    for (const k of problemWriterKeys) {
      result[k] = this.traversalConfig[k][0] ?? this.rootScope.config.codes[code][k];
    }
    return result;
  }
  traverseConfig(configEntries, node) {
    for (const entry of configEntries) {
      this.traversalConfig[entry[0]].unshift(entry[1]);
    }
    const isValid = traverse(node, this);
    for (const entry of configEntries) {
      this.traversalConfig[entry[0]].shift();
    }
    return isValid;
  }
  traverseKey(key, node) {
    const lastData = this.data;
    this.data = this.data[key];
    this.path.push(key);
    const isValid = traverse(node, this);
    this.path.pop();
    if (lastData[key] !== this.data) {
      lastData[key] = this.data;
    }
    this.data = lastData;
    return isValid;
  }
  traverseResolution(name) {
    const resolution = this.type.scope.resolve(name);
    const id2 = resolution.qualifiedName;
    const data = this.data;
    const isObject = hasDomain(data, "object");
    if (isObject) {
      const seenByCurrentType = _classPrivateFieldGet3(this, _seen)[id2];
      if (seenByCurrentType) {
        if (seenByCurrentType.includes(data)) {
          return true;
        }
        seenByCurrentType.push(data);
      } else {
        _classPrivateFieldGet3(this, _seen)[id2] = [
          data
        ];
      }
    }
    const lastType = this.type;
    this.type = resolution;
    const isValid = traverse(resolution.flat, this);
    this.type = lastType;
    if (isObject) {
      _classPrivateFieldGet3(this, _seen)[id2].pop();
    }
    return isValid;
  }
  traverseBranches(branches) {
    const lastFailFast = this.failFast;
    this.failFast = true;
    const lastProblems = this.problems;
    const branchProblems = new Problems(this);
    this.problems = branchProblems;
    const lastPath = this.path;
    const lastKeysToPrune = this.entriesToPrune;
    let hasValidBranch = false;
    for (const branch of branches) {
      this.path = new Path();
      this.entriesToPrune = [];
      if (checkEntries(branch, this)) {
        hasValidBranch = true;
        lastKeysToPrune.push(...this.entriesToPrune);
        break;
      }
    }
    this.path = lastPath;
    this.entriesToPrune = lastKeysToPrune;
    this.problems = lastProblems;
    this.failFast = lastFailFast;
    return hasValidBranch || !this.problems.add("branches", branchProblems);
  }
  constructor(data, type2) {
    _defineProperty5(this, "data", void 0);
    _defineProperty5(this, "type", void 0);
    _defineProperty5(this, "path", void 0);
    _defineProperty5(this, "problems", void 0);
    _defineProperty5(this, "entriesToPrune", void 0);
    _defineProperty5(this, "failFast", void 0);
    _defineProperty5(this, "traversalConfig", void 0);
    _defineProperty5(this, "rootScope", void 0);
    _classPrivateFieldInit3(this, _seen, {
      writable: true,
      value: void 0
    });
    this.data = data;
    this.type = type2;
    this.path = new Path();
    this.problems = new Problems(this);
    this.entriesToPrune = [];
    this.failFast = false;
    this.traversalConfig = initializeTraversalConfig();
    _classPrivateFieldSet3(this, _seen, {});
    this.rootScope = type2.scope;
  }
};
var traverse = (node, state) => typeof node === "string" ? domainOf(state.data) === node || !state.problems.add("domain", node) : checkEntries(node, state);
var checkEntries = (entries, state) => {
  let isValid = true;
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    const entryAllowsData = entryCheckers[k](v, state);
    isValid && (isValid = entryAllowsData);
    if (!isValid) {
      if (state.failFast) {
        return false;
      }
      if (i < entries.length - 1 && precedenceMap[k] < precedenceMap[entries[i + 1][0]]) {
        return false;
      }
    }
  }
  return isValid;
};
var checkRequiredProp = (prop, state) => {
  if (prop[0] in state.data) {
    return state.traverseKey(prop[0], prop[1]);
  }
  state.problems.add("missing", void 0, {
    path: state.path.concat(prop[0]),
    data: void 0
  });
  return false;
};
var createPropChecker = (kind) => (props, state) => {
  let isValid = true;
  const remainingUnseenRequired = {
    ...props.required
  };
  for (const k in state.data) {
    if (props.required[k]) {
      isValid = state.traverseKey(k, props.required[k]) && isValid;
      delete remainingUnseenRequired[k];
    } else if (props.optional[k]) {
      isValid = state.traverseKey(k, props.optional[k]) && isValid;
    } else if (props.index && wellFormedIntegerMatcher.test(k)) {
      isValid = state.traverseKey(k, props.index) && isValid;
    } else if (kind === "distilledProps") {
      if (state.failFast) {
        state.entriesToPrune.push([
          state.data,
          k
        ]);
      } else {
        delete state.data[k];
      }
    } else {
      isValid = false;
      state.problems.add("extraneous", state.data[k], {
        path: state.path.concat(k)
      });
    }
    if (!isValid && state.failFast) {
      return false;
    }
  }
  const unseenRequired = Object.keys(remainingUnseenRequired);
  if (unseenRequired.length) {
    for (const k of unseenRequired) {
      state.problems.add("missing", void 0, {
        path: state.path.concat(k)
      });
    }
    return false;
  }
  return isValid;
};
var entryCheckers = {
  regex: checkRegex,
  divisor: checkDivisor,
  domains: (domains, state) => {
    const entries = domains[domainOf(state.data)];
    return entries ? checkEntries(entries, state) : !state.problems.add("cases", domainsToDescriptions(objectKeysOf(domains)));
  },
  domain: (domain, state) => domainOf(state.data) === domain || !state.problems.add("domain", domain),
  bound: checkBound,
  optionalProp: (prop, state) => {
    if (prop[0] in state.data) {
      return state.traverseKey(prop[0], prop[1]);
    }
    return true;
  },
  // these checks work the same way, the keys are only distinct so that
  // prerequisite props can have a higher precedence
  requiredProp: checkRequiredProp,
  prerequisiteProp: checkRequiredProp,
  indexProp: (node, state) => {
    if (!Array.isArray(state.data)) {
      state.problems.add("class", Array);
      return false;
    }
    let isValid = true;
    for (let i = 0; i < state.data.length; i++) {
      isValid = state.traverseKey(`${i}`, node) && isValid;
      if (!isValid && state.failFast) {
        return false;
      }
    }
    return isValid;
  },
  branches: (branches, state) => state.traverseBranches(branches),
  switch: (rule, state) => {
    const dataAtPath = getPath(state.data, rule.path);
    const caseKey = serializeCase(rule.kind, dataAtPath);
    if (hasKey(rule.cases, caseKey)) {
      return checkEntries(rule.cases[caseKey], state);
    }
    const caseKeys = objectKeysOf(rule.cases);
    const missingCasePath = state.path.concat(rule.path);
    const caseDescriptions = rule.kind === "value" ? caseKeys : rule.kind === "domain" ? domainsToDescriptions(caseKeys) : rule.kind === "class" ? objectKindsToDescriptions(caseKeys) : throwInternalError(`Unexpectedly encountered rule kind '${rule.kind}' during traversal`);
    state.problems.add("cases", caseDescriptions, {
      path: missingCasePath,
      data: dataAtPath
    });
    return false;
  },
  alias: (name, state) => state.traverseResolution(name),
  class: checkClass,
  narrow: (narrow2, state) => {
    const lastProblemsCount = state.problems.count;
    const result = narrow2(state.data, state.problems);
    if (!result && state.problems.count === lastProblemsCount) {
      state.problems.mustBe(narrow2.name ? `valid according to ${narrow2.name}` : "valid");
    }
    return result;
  },
  config: ({ config, node }, state) => state.traverseConfig(config, node),
  value: (value, state) => state.data === value || !state.problems.add("value", value),
  morph: (morph2, state) => {
    const out = morph2(state.data, state.problems);
    if (state.problems.length) {
      return false;
    }
    if (out instanceof Problem) {
      state.problems.addProblem(out);
      return false;
    }
    if (out instanceof CheckResult) {
      if (out.problems) {
        for (const problem of out.problems) {
          state.problems.addProblem(problem);
        }
        return false;
      }
      state.data = out.data;
      return true;
    }
    state.data = out;
    return true;
  },
  distilledProps: createPropChecker("distilledProps"),
  strictProps: createPropChecker("strictProps")
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/chainableNoOpProxy.js
var chainableNoOpProxy = new Proxy(() => chainableNoOpProxy, {
  get: () => chainableNoOpProxy
});

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/type.js
var initializeType = (name, definition, config, scope2) => {
  const root = {
    // temporarily initialize node/flat to aliases that will be included in
    // the final type in case of cyclic resolutions
    node: name,
    flat: [
      [
        "alias",
        name
      ]
    ],
    allows: (data) => !namedTraverse(data).problems,
    assert: (data) => {
      const result = namedTraverse(data);
      return result.problems ? result.problems.throw() : result.data;
    },
    infer: chainableNoOpProxy,
    inferIn: chainableNoOpProxy,
    qualifiedName: isAnonymousName(name) ? scope2.getAnonymousQualifiedName(name) : `${scope2.name}.${name}`,
    definition,
    scope: scope2,
    includesMorph: false,
    config
  };
  const namedTraverse = {
    [name]: (data) => traverseRoot(namedTraverse, data)
  }[name];
  const t = Object.assign(namedTraverse, root);
  return t;
};
var isType = (value) => value?.infer === chainableNoOpProxy;
var isAnonymousName = (name) => name[0] === "\u03BB";

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operand/unenclosed.js
var parseUnenclosed = (s) => {
  const token = s.scanner.shiftUntilNextTerminator();
  s.setRoot(unenclosedToNode(s, token));
};
var unenclosedToNode = (s, token) => {
  if (s.ctx.type.scope.addParsedReferenceIfResolvable(token, s.ctx)) {
    return token;
  }
  return maybeParseUnenclosedLiteral(token) ?? s.error(token === "" ? writeMissingOperandMessage(s) : writeUnresolvableMessage(token));
};
var maybeParseUnenclosedLiteral = (token) => {
  const maybeNumber = tryParseWellFormedNumber(token);
  if (maybeNumber !== void 0) {
    return {
      number: {
        value: maybeNumber
      }
    };
  }
  const maybeBigint = tryParseWellFormedBigint(token);
  if (maybeBigint !== void 0) {
    return {
      bigint: {
        value: maybeBigint
      }
    };
  }
};
var writeUnresolvableMessage = (token) => `'${token}' is unresolvable`;
var writeMissingOperandMessage = (s) => {
  const operator = s.previousOperator();
  return operator ? writeMissingRightOperandMessage(operator, s.scanner.unscanned) : writeExpressionExpectedMessage(s.scanner.unscanned);
};
var writeMissingRightOperandMessage = (token, unscanned) => `Token '${token}' requires a right operand${unscanned ? ` before '${unscanned}'` : ""}`;
var writeExpressionExpectedMessage = (unscanned) => `Expected an expression${unscanned ? ` before '${unscanned}'` : ""}`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/config.js
var parseConfigTuple = (def, ctx) => ({
  node: ctx.type.scope.resolveTypeNode(parseDefinition(def[0], ctx)),
  config: def[2]
});

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/utils/freeze.js
var deepFreeze = (value) => Object.isFrozen(value) ? value : Array.isArray(value) ? Object.freeze(value.map(deepFreeze)) : deepFreezeDictionary(value);
var deepFreezeDictionary = (value) => {
  for (const k in value) {
    deepFreeze(value[k]);
  }
  return value;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/keyof.js
var arrayIndexStringBranch = deepFreeze({
  regex: wellFormedNonNegativeIntegerMatcher.source
});
var arrayIndexNumberBranch = deepFreeze({
  range: {
    min: {
      comparator: ">=",
      limit: 0
    }
  },
  divisor: 1
});
var parseKeyOfTuple = (def, ctx) => {
  const resolution = ctx.type.scope.resolveNode(parseDefinition(def[1], ctx));
  const predicateKeys = objectKeysOf(resolution).map((domain) => keysOfPredicate(domain, resolution[domain]));
  const sharedKeys = sharedKeysOf(predicateKeys);
  if (!sharedKeys.length) {
    return writeImplicitNeverMessage(ctx.path, "keyof");
  }
  const keyNode = {};
  for (const key of sharedKeys) {
    const keyType = typeof key;
    if (keyType === "string" || keyType === "number" || keyType === "symbol") {
      var _keyNode, _keyType;
      (_keyNode = keyNode)[_keyType = keyType] ?? (_keyNode[_keyType] = []);
      keyNode[keyType].push({
        value: key
      });
    } else if (key === wellFormedNonNegativeIntegerMatcher) {
      var _keyNode1, _keyNode2;
      (_keyNode1 = keyNode).string ?? (_keyNode1.string = []);
      keyNode.string.push(arrayIndexStringBranch);
      (_keyNode2 = keyNode).number ?? (_keyNode2.number = []);
      keyNode.number.push(arrayIndexNumberBranch);
    } else {
      return throwInternalError(`Unexpected keyof key '${stringify(key)}'`);
    }
  }
  return Object.fromEntries(Object.entries(keyNode).map(([domain, branches]) => [
    domain,
    branches.length === 1 ? branches[0] : branches
  ]));
};
var baseKeysByDomain = {
  bigint: prototypeKeysOf(0n),
  boolean: prototypeKeysOf(false),
  null: [],
  number: prototypeKeysOf(0),
  // TS doesn't include the Object prototype in keyof, so keyof object is never
  object: [],
  string: prototypeKeysOf(""),
  symbol: prototypeKeysOf(Symbol()),
  undefined: []
};
var keysOfPredicate = (domain, predicate) => domain !== "object" || predicate === true ? baseKeysByDomain[domain] : sharedKeysOf(listFrom(predicate).map((branch) => keysOfObjectBranch(branch)));
var sharedKeysOf = (keyBranches) => {
  if (!keyBranches.length) {
    return [];
  }
  let sharedKeys = keyBranches[0];
  for (let i = 1; i < keyBranches.length; i++) {
    sharedKeys = sharedKeys.filter((k) => keyBranches[i].includes(k));
  }
  return sharedKeys;
};
var keysOfObjectBranch = (branch) => {
  const result = [];
  if ("props" in branch) {
    for (const key of Object.keys(branch.props)) {
      if (key === mappedKeys.index) {
        result.push(wellFormedNonNegativeIntegerMatcher);
      } else if (!result.includes(key)) {
        result.push(key);
        if (wellFormedNonNegativeIntegerMatcher.test(key)) {
          result.push(tryParseWellFormedInteger(key, `Unexpectedly failed to parse an integer from key '${key}'`));
        }
      }
    }
  }
  if ("class" in branch) {
    const constructor = typeof branch.class === "string" ? defaultObjectKinds[branch.class] : branch.class;
    for (const key of prototypeKeysOf(constructor.prototype)) {
      if (!result.includes(key)) {
        result.push(key);
      }
    }
  }
  return result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/morph.js
var parseMorphTuple = (def, ctx) => {
  if (typeof def[2] !== "function") {
    return throwParseError(writeMalformedMorphExpressionMessage(def[2]));
  }
  const node = parseDefinition(def[0], ctx);
  const resolution = ctx.type.scope.resolveTypeNode(node);
  const morph2 = def[2];
  ctx.type.includesMorph = true;
  let domain;
  const result = {};
  for (domain in resolution) {
    const predicate = resolution[domain];
    if (predicate === true) {
      result[domain] = {
        rules: {},
        morph: morph2
      };
    } else if (typeof predicate === "object") {
      result[domain] = isArray(predicate) ? predicate.map((branch) => applyMorph(branch, morph2)) : applyMorph(predicate, morph2);
    } else {
      throwInternalError(`Unexpected predicate value for domain '${domain}': ${stringify(predicate)}`);
    }
  }
  return result;
};
var applyMorph = (branch, morph2) => isTransformationBranch(branch) ? {
  ...branch,
  morph: branch.morph ? Array.isArray(branch.morph) ? [
    ...branch.morph,
    morph2
  ] : [
    branch.morph,
    morph2
  ] : morph2
} : {
  rules: branch,
  morph: morph2
};
var writeMalformedMorphExpressionMessage = (value) => `Morph expression requires a function following '|>' (was ${typeof value})`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/distributableFunction.js
var writeMalformedDistributableFunctionMessage = (def) => `Expected a Function or Record<Domain, Function> operand (${stringify(def)} was invalid)`;
var distributeFunctionToNode = (distributableFunction, node, ctx, ruleKey) => {
  const domains = objectKeysOf(node);
  if (!hasDomain(distributableFunction, "object")) {
    return throwParseError(writeMalformedDistributableFunctionMessage(distributableFunction));
  }
  const distributed = {};
  if (typeof distributableFunction === "function") {
    const domainFunction = {
      [ruleKey]: distributableFunction
    };
    for (const domain of domains) {
      distributed[domain] = domainFunction;
    }
  } else {
    for (const domain of domains) {
      if (distributableFunction[domain] === void 0) {
        continue;
      }
      const functionInDomain = {
        [ruleKey]: distributableFunction[domain]
      };
      if (typeof functionInDomain[ruleKey] !== "function") {
        return throwParseError(writeMalformedDistributableFunctionMessage(functionInDomain));
      }
      distributed[domain] = functionInDomain;
    }
  }
  return distributed;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/narrow.js
var parseNarrowTuple = (def, ctx) => {
  const inputNode = parseDefinition(def[0], ctx);
  const resolution = ctx.type.scope.resolveNode(inputNode);
  const hasConfig = isConfigNode(resolution);
  const typeNode = hasConfig ? resolution.node : resolution;
  const result = rootIntersection(inputNode, distributeFunctionToNode(def[2], typeNode, ctx, "narrow"), ctx.type);
  return hasConfig ? {
    config: resolution.config,
    node: result
  } : result;
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/tuple.js
var parseTuple = (def, ctx) => {
  if (isIndexOneExpression(def)) {
    return indexOneParsers[def[1]](def, ctx);
  }
  if (isIndexZeroExpression(def)) {
    return prefixParsers[def[0]](def, ctx);
  }
  const props = {
    //  length is created as a prerequisite prop, ensuring if it is invalid,
    //  no other props will be checked, which is usually desirable for tuple
    //  definitions.
    length: [
      "!",
      {
        number: {
          value: def.length
        }
      }
    ]
  };
  for (let i = 0; i < def.length; i++) {
    ctx.path.push(`${i}`);
    props[i] = parseDefinition(def[i], ctx);
    ctx.path.pop();
  }
  return {
    object: {
      class: Array,
      props
    }
  };
};
var parseBranchTuple = (def, ctx) => {
  if (def[2] === void 0) {
    return throwParseError(writeMissingRightOperandMessage(def[1], ""));
  }
  const l = parseDefinition(def[0], ctx);
  const r = parseDefinition(def[2], ctx);
  return def[1] === "&" ? rootIntersection(l, r, ctx.type) : rootUnion(l, r, ctx.type);
};
var parseArrayTuple = (def, scope2) => toArrayNode(parseDefinition(def[0], scope2));
var isIndexOneExpression = (def) => indexOneParsers[def[1]] !== void 0;
var indexOneParsers = {
  "|": parseBranchTuple,
  "&": parseBranchTuple,
  "[]": parseArrayTuple,
  "=>": parseNarrowTuple,
  "|>": parseMorphTuple,
  ":": parseConfigTuple
};
var prefixParsers = {
  keyof: parseKeyOfTuple,
  instanceof: (def) => {
    if (typeof def[1] !== "function") {
      return throwParseError(`Expected a constructor following 'instanceof' operator (was ${typeof def[1]}).`);
    }
    return {
      object: {
        class: def[1]
      }
    };
  },
  "===": (def) => ({
    [domainOf(def[1])]: {
      value: def[1]
    }
  }),
  node: (def) => def[1]
};
var isIndexZeroExpression = (def) => prefixParsers[def[0]] !== void 0;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/record.js
var parseRecord = (def, ctx) => {
  const props = {};
  for (const definitionKey in def) {
    let keyName = definitionKey;
    let isOptional2 = false;
    if (definitionKey[definitionKey.length - 1] === "?") {
      if (definitionKey[definitionKey.length - 2] === Scanner.escapeToken) {
        keyName = `${definitionKey.slice(0, -2)}?`;
      } else {
        keyName = definitionKey.slice(0, -1);
        isOptional2 = true;
      }
    }
    ctx.path.push(keyName);
    const propNode = parseDefinition(def[definitionKey], ctx);
    ctx.path.pop();
    props[keyName] = isOptional2 ? [
      "?",
      propNode
    ] : propNode;
  }
  return {
    object: {
      props
    }
  };
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/reduce/shared.js
var writeUnmatchedGroupCloseMessage = (unscanned) => `Unmatched )${unscanned === "" ? "" : ` before ${unscanned}`}`;
var unclosedGroupMessage = "Missing )";
var writeOpenRangeMessage = (min, comparator) => `Left bounds are only valid when paired with right bounds (try ...${comparator}${min})`;
var writeUnpairableComparatorMessage = (comparator) => `Left-bounded expressions must specify their limits using < or <= (was ${comparator})`;
var writeMultipleLeftBoundsMessage = (openLimit, openComparator, limit, comparator) => `An expression may have at most one left bound (parsed ${openLimit}${Scanner.invertedComparators[openComparator]}, ${limit}${Scanner.invertedComparators[comparator]})`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/reduce/dynamic.js
function _defineProperty6(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DynamicState = class {
  error(message) {
    return throwParseError(message);
  }
  hasRoot() {
    return this.root !== void 0;
  }
  resolveRoot() {
    this.assertHasRoot();
    return this.ctx.type.scope.resolveTypeNode(this.root);
  }
  rootToString() {
    this.assertHasRoot();
    return stringify(this.root);
  }
  ejectRootIfLimit() {
    this.assertHasRoot();
    const resolution = typeof this.root === "string" ? this.ctx.type.scope.resolveNode(this.root) : this.root;
    if (isLiteralNode(resolution, "number")) {
      const limit = resolution.number.value;
      this.root = void 0;
      return limit;
    }
  }
  ejectRangeIfOpen() {
    if (this.branches.range) {
      const range = this.branches.range;
      delete this.branches.range;
      return range;
    }
  }
  assertHasRoot() {
    if (this.root === void 0) {
      return throwInternalError("Unexpected interaction with unset root");
    }
  }
  assertUnsetRoot() {
    if (this.root !== void 0) {
      return throwInternalError("Unexpected attempt to overwrite root");
    }
  }
  setRoot(node) {
    this.assertUnsetRoot();
    this.root = node;
  }
  rootToArray() {
    this.root = toArrayNode(this.ejectRoot());
  }
  intersect(node) {
    this.root = rootIntersection(this.ejectRoot(), node, this.ctx.type);
  }
  ejectRoot() {
    this.assertHasRoot();
    const root = this.root;
    this.root = void 0;
    return root;
  }
  ejectFinalizedRoot() {
    this.assertHasRoot();
    const root = this.root;
    this.root = ejectedProxy;
    return root;
  }
  finalize() {
    if (this.groups.length) {
      return this.error(unclosedGroupMessage);
    }
    this.finalizeBranches();
    this.scanner.finalized = true;
  }
  reduceLeftBound(limit, comparator) {
    const invertedComparator = Scanner.invertedComparators[comparator];
    if (!isKeyOf(invertedComparator, minComparators)) {
      return this.error(writeUnpairableComparatorMessage(comparator));
    }
    if (this.branches.range) {
      return this.error(writeMultipleLeftBoundsMessage(`${this.branches.range.limit}`, this.branches.range.comparator, `${limit}`, invertedComparator));
    }
    this.branches.range = {
      limit,
      comparator: invertedComparator
    };
  }
  finalizeBranches() {
    this.assertRangeUnset();
    if (this.branches.union) {
      this.pushRootToBranch("|");
      this.setRoot(this.branches.union);
    } else if (this.branches.intersection) {
      this.setRoot(rootIntersection(this.branches.intersection, this.ejectRoot(), this.ctx.type));
    }
  }
  finalizeGroup() {
    this.finalizeBranches();
    const topBranchState = this.groups.pop();
    if (!topBranchState) {
      return this.error(writeUnmatchedGroupCloseMessage(this.scanner.unscanned));
    }
    this.branches = topBranchState;
  }
  pushRootToBranch(token) {
    this.assertRangeUnset();
    this.branches.intersection = this.branches.intersection ? rootIntersection(this.branches.intersection, this.ejectRoot(), this.ctx.type) : this.ejectRoot();
    if (token === "|") {
      this.branches.union = this.branches.union ? rootUnion(this.branches.union, this.branches.intersection, this.ctx.type) : this.branches.intersection;
      delete this.branches.intersection;
    }
  }
  assertRangeUnset() {
    if (this.branches.range) {
      return this.error(writeOpenRangeMessage(`${this.branches.range.limit}`, this.branches.range.comparator));
    }
  }
  reduceGroupOpen() {
    this.groups.push(this.branches);
    this.branches = {};
  }
  previousOperator() {
    return this.branches.range?.comparator ?? this.branches.intersection ? "&" : this.branches.union ? "|" : void 0;
  }
  shiftedByOne() {
    this.scanner.shift();
    return this;
  }
  constructor(def, ctx) {
    _defineProperty6(this, "ctx", void 0);
    _defineProperty6(this, "scanner", void 0);
    _defineProperty6(this, "root", void 0);
    _defineProperty6(this, "branches", void 0);
    _defineProperty6(this, "groups", void 0);
    this.ctx = ctx;
    this.branches = {};
    this.groups = [];
    this.scanner = new Scanner(def);
  }
};
var ejectedProxy = new Proxy({}, {
  get: () => throwInternalError(`Unexpected attempt to access ejected attributes`)
});

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operand/enclosed.js
var parseEnclosed = (s, enclosing) => {
  const token = s.scanner.shiftUntil(untilLookaheadIsClosing[enclosing]);
  if (s.scanner.lookahead === "") {
    return s.error(writeUnterminatedEnclosedMessage(token, enclosing));
  }
  if (s.scanner.shift() === "/") {
    getRegex(token);
    s.setRoot({
      string: {
        regex: token
      }
    });
  } else {
    s.setRoot({
      string: {
        value: token
      }
    });
  }
};
var enclosingChar = {
  "'": 1,
  '"': 1,
  "/": 1
};
var untilLookaheadIsClosing = {
  "'": (scanner) => scanner.lookahead === `'`,
  '"': (scanner) => scanner.lookahead === `"`,
  "/": (scanner) => scanner.lookahead === `/`
};
var enclosingCharDescriptions = {
  '"': "double-quote",
  "'": "single-quote",
  "/": "forward slash"
};
var writeUnterminatedEnclosedMessage = (fragment, enclosing) => `${enclosing}${fragment} requires a closing ${enclosingCharDescriptions[enclosing]}`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operand/operand.js
var parseOperand = (s) => s.scanner.lookahead === "" ? s.error(writeMissingOperandMessage(s)) : s.scanner.lookahead === "(" ? s.shiftedByOne().reduceGroupOpen() : s.scanner.lookaheadIsIn(enclosingChar) ? parseEnclosed(s, s.scanner.shift()) : s.scanner.lookahead === " " ? parseOperand(s.shiftedByOne()) : parseUnenclosed(s);

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/bound.js
var writeUnboundableMessage = (root) => `Bounded expression ${root} must be a number, string or array`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operator/bounds.js
var parseBound = (s, start) => {
  const comparator = shiftComparator(s, start);
  const maybeMin = s.ejectRootIfLimit();
  return maybeMin === void 0 ? parseRightBound(s, comparator) : s.reduceLeftBound(maybeMin, comparator);
};
var shiftComparator = (s, start) => s.scanner.lookaheadIs("=") ? `${start}${s.scanner.shift()}` : isKeyOf(start, Scanner.oneCharComparators) ? start : s.error(singleEqualsMessage);
var singleEqualsMessage = `= is not a valid comparator. Use == to check for equality`;
var parseRightBound = (s, comparator) => {
  const limitToken = s.scanner.shiftUntilNextTerminator();
  const limit = tryParseWellFormedNumber(limitToken, writeInvalidLimitMessage(comparator, limitToken + s.scanner.unscanned));
  const openRange = s.ejectRangeIfOpen();
  const rightBound = {
    comparator,
    limit
  };
  const range = openRange ? !hasComparatorIn(rightBound, maxComparators) ? s.error(writeUnpairableComparatorMessage(comparator)) : compareStrictness("min", openRange, rightBound) === "l" ? s.error(writeEmptyRangeMessage({
    min: openRange,
    max: rightBound
  })) : {
    min: openRange,
    max: rightBound
  } : hasComparator(rightBound, "==") ? rightBound : hasComparatorIn(rightBound, minComparators) ? {
    min: rightBound
  } : hasComparatorIn(rightBound, maxComparators) ? {
    max: rightBound
  } : throwInternalError(`Unexpected comparator '${rightBound.comparator}'`);
  s.intersect(distributeRange(range, s));
};
var distributeRange = (range, s) => {
  const resolution = s.resolveRoot();
  const domains = objectKeysOf(resolution);
  const distributedRange = {};
  const rangePredicate = {
    range
  };
  const isBoundable = domains.every((domain) => {
    switch (domain) {
      case "string":
        distributedRange.string = rangePredicate;
        return true;
      case "number":
        distributedRange.number = rangePredicate;
        return true;
      case "object":
        distributedRange.object = rangePredicate;
        if (resolution.object === true) {
          return false;
        }
        return listFrom(resolution.object).every((branch) => "class" in branch && branch.class === Array);
      default:
        return false;
    }
  });
  if (!isBoundable) {
    s.error(writeUnboundableMessage(s.rootToString()));
  }
  return distributedRange;
};
var hasComparator = (bound, comparator) => bound.comparator === comparator;
var hasComparatorIn = (bound, comparators) => bound.comparator in comparators;
var writeInvalidLimitMessage = (comparator, limit) => `Comparator ${comparator} must be followed by a number literal (was '${limit}')`;
var writeEmptyRangeMessage = (range) => `${stringifyRange(range)} is empty`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/ast/divisor.js
var writeIndivisibleMessage = (root) => `Divisibility operand ${root} must be a number`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operator/divisor.js
var parseDivisor = (s) => {
  const divisorToken = s.scanner.shiftUntilNextTerminator();
  const divisor = tryParseWellFormedInteger(divisorToken, writeInvalidDivisorMessage(divisorToken));
  if (divisor === 0) {
    s.error(writeInvalidDivisorMessage(0));
  }
  const rootDomains = objectKeysOf(s.resolveRoot());
  if (rootDomains.length === 1 && rootDomains[0] === "number") {
    s.intersect({
      number: {
        divisor
      }
    });
  } else {
    s.error(writeIndivisibleMessage(s.rootToString()));
  }
};
var writeInvalidDivisorMessage = (divisor) => `% operator must be followed by a non-zero integer literal (was ${divisor})`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/shift/operator/operator.js
var parseOperator = (s) => {
  const lookahead = s.scanner.shift();
  return lookahead === "" ? s.finalize() : lookahead === "[" ? s.scanner.shift() === "]" ? s.rootToArray() : s.error(incompleteArrayTokenMessage) : isKeyOf(lookahead, Scanner.branchTokens) ? s.pushRootToBranch(lookahead) : lookahead === ")" ? s.finalizeGroup() : isKeyOf(lookahead, Scanner.comparatorStartChars) ? parseBound(s, lookahead) : lookahead === "%" ? parseDivisor(s) : lookahead === " " ? parseOperator(s) : throwInternalError(writeUnexpectedCharacterMessage(lookahead));
};
var writeUnexpectedCharacterMessage = (char) => `Unexpected character '${char}'`;
var incompleteArrayTokenMessage = `Missing expected ']'`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/string/string.js
var parseString = (def, ctx) => ctx.type.scope.parseCache.get(def) ?? ctx.type.scope.parseCache.set(def, maybeNaiveParse(def, ctx) ?? fullStringParse(def, ctx));
var maybeNaiveParse = (def, ctx) => {
  if (ctx.type.scope.addParsedReferenceIfResolvable(def, ctx)) {
    return def;
  }
  if (def.endsWith("[]")) {
    const elementDef = def.slice(0, -2);
    if (ctx.type.scope.addParsedReferenceIfResolvable(def, ctx)) {
      return toArrayNode(elementDef);
    }
  }
};
var fullStringParse = (def, ctx) => {
  const s = new DynamicState(def, ctx);
  parseOperand(s);
  return loop(s);
};
var loop = (s) => {
  while (!s.scanner.finalized) {
    next(s);
  }
  return s.ejectFinalizedRoot();
};
var next = (s) => s.hasRoot() ? parseOperator(s) : parseOperand(s);

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/parse/definition.js
var parseDefinition = (def, ctx) => {
  const domain = domainOf(def);
  if (domain === "string") {
    return parseString(def, ctx);
  }
  if (domain !== "object") {
    return throwParseError(writeBadDefinitionTypeMessage(domain));
  }
  const objectKind = objectKindOf(def);
  switch (objectKind) {
    case "Object":
      return parseRecord(def, ctx);
    case "Array":
      return parseTuple(def, ctx);
    case "RegExp":
      return {
        string: {
          regex: def.source
        }
      };
    case "Function":
      if (isType(def)) {
        return ctx.type.scope.addAnonymousTypeReference(def, ctx);
      }
      if (isThunk(def)) {
        const returned = def();
        if (isType(returned)) {
          return ctx.type.scope.addAnonymousTypeReference(returned, ctx);
        }
      }
      return throwParseError(writeBadDefinitionTypeMessage("Function"));
    default:
      return throwParseError(writeBadDefinitionTypeMessage(objectKind ?? stringify(def)));
  }
};
var as = Symbol("as");
var isThunk = (def) => typeof def === "function" && def.length === 0;
var writeBadDefinitionTypeMessage = (actual) => `Type definitions must be strings or objects (was ${actual})`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/cache.js
function _defineProperty7(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Cache = class {
  get root() {
    return this.cache;
  }
  has(name) {
    return name in this.cache;
  }
  get(name) {
    return this.cache[name];
  }
  set(name, item) {
    this.cache[name] = item;
    return item;
  }
  constructor() {
    _defineProperty7(this, "cache", {});
  }
};
var FreezingCache = class extends Cache {
  set(name, item) {
    this.cache[name] = deepFreeze(item);
    return item;
  }
};

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/scope.js
function _checkPrivateRedeclaration4(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classApplyDescriptorGet4(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet4(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classExtractFieldDescriptor4(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classPrivateFieldGet4(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor4(receiver, privateMap, "get");
  return _classApplyDescriptorGet4(receiver, descriptor);
}
function _classPrivateFieldInit4(obj, privateMap, value) {
  _checkPrivateRedeclaration4(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateFieldSet4(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor4(receiver, privateMap, "set");
  _classApplyDescriptorSet4(receiver, descriptor, value);
  return value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
  _checkPrivateRedeclaration4(obj, privateSet);
  privateSet.add(obj);
}
function _defineProperty8(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var compileScopeOptions = (opts) => ({
  codes: compileProblemWriters(opts.codes),
  keys: opts.keys ?? "loose"
});
var anonymousScopeCount = 0;
var scopeRegistry = {};
var spaceRegistry = {};
var _resolutions = /* @__PURE__ */ new WeakMap();
var _exports = /* @__PURE__ */ new WeakMap();
var _register = /* @__PURE__ */ new WeakSet();
var _cacheSpaces = /* @__PURE__ */ new WeakSet();
var _initializeContext = /* @__PURE__ */ new WeakSet();
var _resolveRecurse = /* @__PURE__ */ new WeakSet();
var Scope = class {
  getAnonymousQualifiedName(base) {
    let increment = 0;
    let id2 = base;
    while (this.isResolvable(id2)) {
      id2 = `${base}${increment++}`;
    }
    return `${this.name}.${id2}`;
  }
  addAnonymousTypeReference(referencedType, ctx) {
    var _ctx_type;
    (_ctx_type = ctx.type).includesMorph || (_ctx_type.includesMorph = referencedType.includesMorph);
    return referencedType.node;
  }
  get infer() {
    return chainableNoOpProxy;
  }
  compile() {
    if (!spaceRegistry[this.name]) {
      for (const name in this.aliases) {
        this.resolve(name);
      }
      spaceRegistry[this.name] = _classPrivateFieldGet4(this, _exports).root;
    }
    return _classPrivateFieldGet4(this, _exports).root;
  }
  addParsedReferenceIfResolvable(name, ctx) {
    var _ctx_type;
    const resolution = _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, name, "undefined", [
      name
    ]);
    if (!resolution) {
      return false;
    }
    (_ctx_type = ctx.type).includesMorph || (_ctx_type.includesMorph = resolution.includesMorph);
    return true;
  }
  resolve(name) {
    return _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, name, "throw", [
      name
    ]);
  }
  resolveNode(node) {
    return typeof node === "string" ? this.resolveNode(this.resolve(node).node) : node;
  }
  resolveTypeNode(node) {
    const resolution = this.resolveNode(node);
    return isConfigNode(resolution) ? resolution.node : resolution;
  }
  isResolvable(name) {
    return _classPrivateFieldGet4(this, _resolutions).has(name) || this.aliases[name];
  }
  constructor(aliases, opts = {}) {
    _classPrivateMethodInit(this, _register);
    _classPrivateMethodInit(this, _cacheSpaces);
    _classPrivateMethodInit(this, _initializeContext);
    _classPrivateMethodInit(this, _resolveRecurse);
    _defineProperty8(this, "aliases", void 0);
    _defineProperty8(this, "name", void 0);
    _defineProperty8(this, "config", void 0);
    _defineProperty8(this, "parseCache", void 0);
    _classPrivateFieldInit4(this, _resolutions, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInit4(this, _exports, {
      writable: true,
      value: void 0
    });
    _defineProperty8(this, "expressions", void 0);
    _defineProperty8(this, "intersection", void 0);
    _defineProperty8(this, "union", void 0);
    _defineProperty8(this, "arrayOf", void 0);
    _defineProperty8(this, "keyOf", void 0);
    _defineProperty8(this, "valueOf", void 0);
    _defineProperty8(this, "instanceOf", void 0);
    _defineProperty8(this, "narrow", void 0);
    _defineProperty8(this, "morph", void 0);
    _defineProperty8(this, "type", void 0);
    this.aliases = aliases;
    this.parseCache = new FreezingCache();
    _classPrivateFieldSet4(this, _resolutions, new Cache());
    _classPrivateFieldSet4(this, _exports, new Cache());
    this.expressions = {
      intersection: (l, r, opts2) => this.type([
        l,
        "&",
        r
      ], opts2),
      union: (l, r, opts2) => this.type([
        l,
        "|",
        r
      ], opts2),
      arrayOf: (def, opts2) => this.type([
        def,
        "[]"
      ], opts2),
      keyOf: (def, opts2) => this.type([
        "keyof",
        def
      ], opts2),
      node: (def, opts2) => this.type([
        "node",
        def
      ], opts2),
      instanceOf: (def, opts2) => this.type([
        "instanceof",
        def
      ], opts2),
      valueOf: (def, opts2) => this.type([
        "===",
        def
      ], opts2),
      narrow: (def, fn, opts2) => this.type([
        def,
        "=>",
        fn
      ], opts2),
      morph: (def, fn, opts2) => this.type([
        def,
        "|>",
        fn
      ], opts2)
    };
    this.intersection = this.expressions.intersection;
    this.union = this.expressions.union;
    this.arrayOf = this.expressions.arrayOf;
    this.keyOf = this.expressions.keyOf;
    this.valueOf = this.expressions.valueOf;
    this.instanceOf = this.expressions.instanceOf;
    this.narrow = this.expressions.narrow;
    this.morph = this.expressions.morph;
    this.type = Object.assign((def, config = {}) => {
      const t = initializeType("\u03BBtype", def, config, this);
      const ctx = _classPrivateMethodGet(this, _initializeContext, initializeContext).call(this, t);
      const root = parseDefinition(def, ctx);
      t.node = deepFreeze(hasKeys(config) ? {
        config,
        node: this.resolveTypeNode(root)
      } : root);
      t.flat = deepFreeze(flattenType(t));
      return t;
    }, {
      from: this.expressions.node
    });
    this.name = _classPrivateMethodGet(this, _register, register).call(this, opts);
    if (opts.standard !== false) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, [
        spaceRegistry["standard"]
      ], "imports");
    }
    if (opts.imports) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, opts.imports, "imports");
    }
    if (opts.includes) {
      _classPrivateMethodGet(this, _cacheSpaces, cacheSpaces).call(this, opts.includes, "includes");
    }
    this.config = compileScopeOptions(opts);
  }
};
function register(opts) {
  const name = opts.name ? scopeRegistry[opts.name] ? throwParseError(`A scope named '${opts.name}' already exists`) : opts.name : `scope${++anonymousScopeCount}`;
  scopeRegistry[name] = this;
  return name;
}
function cacheSpaces(spaces, kind) {
  for (const space of spaces) {
    for (const name in space) {
      if (_classPrivateFieldGet4(this, _resolutions).has(name) || name in this.aliases) {
        throwParseError(writeDuplicateAliasesMessage(name));
      }
      _classPrivateFieldGet4(this, _resolutions).set(name, space[name]);
      if (kind === "includes") {
        _classPrivateFieldGet4(this, _exports).set(name, space[name]);
      }
    }
  }
}
function initializeContext(type2) {
  return {
    type: type2,
    path: new Path()
  };
}
function resolveRecurse(name, onUnresolvable, seen) {
  const maybeCacheResult = _classPrivateFieldGet4(this, _resolutions).get(name);
  if (maybeCacheResult) {
    return maybeCacheResult;
  }
  const aliasDef = this.aliases[name];
  if (!aliasDef) {
    return onUnresolvable === "throw" ? throwInternalError(`Unexpectedly failed to resolve alias '${name}'`) : void 0;
  }
  const t = initializeType(name, aliasDef, {}, this);
  const ctx = _classPrivateMethodGet(this, _initializeContext, initializeContext).call(this, t);
  _classPrivateFieldGet4(this, _resolutions).set(name, t);
  _classPrivateFieldGet4(this, _exports).set(name, t);
  let node = parseDefinition(aliasDef, ctx);
  if (typeof node === "string") {
    if (seen.includes(node)) {
      return throwParseError(writeShallowCycleErrorMessage(name, seen));
    }
    seen.push(node);
    node = _classPrivateMethodGet(this, _resolveRecurse, resolveRecurse).call(this, node, "throw", seen).node;
  }
  t.node = deepFreeze(node);
  t.flat = deepFreeze(flattenType(t));
  return t;
}
var scope = (aliases, opts = {}) => new Scope(aliases, opts);
var rootScope = scope({}, {
  name: "root",
  standard: false
});
var rootType = rootScope.type;
var writeShallowCycleErrorMessage = (name, seen) => `Alias '${name}' has a shallow resolution cycle: ${[
  ...seen,
  name
].join("=>")}`;
var writeDuplicateAliasesMessage = (name) => `Alias '${name}' is already defined`;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/jsObjects.js
var jsObjectsScope = scope({
  Function: [
    "node",
    {
      object: {
        class: Function
      }
    }
  ],
  Date: [
    "node",
    {
      object: {
        class: Date
      }
    }
  ],
  Error: [
    "node",
    {
      object: {
        class: Error
      }
    }
  ],
  Map: [
    "node",
    {
      object: {
        class: Map
      }
    }
  ],
  RegExp: [
    "node",
    {
      object: {
        class: RegExp
      }
    }
  ],
  Set: [
    "node",
    {
      object: {
        class: Set
      }
    }
  ],
  WeakMap: [
    "node",
    {
      object: {
        class: WeakMap
      }
    }
  ],
  WeakSet: [
    "node",
    {
      object: {
        class: WeakSet
      }
    }
  ],
  Promise: [
    "node",
    {
      object: {
        class: Promise
      }
    }
  ]
}, {
  name: "jsObjects",
  standard: false
});
var jsObjects = jsObjectsScope.compile();

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/tsKeywords.js
var always = {
  bigint: true,
  boolean: true,
  null: true,
  number: true,
  object: true,
  string: true,
  symbol: true,
  undefined: true
};
var tsKeywordsScope = scope({
  any: [
    "node",
    always
  ],
  bigint: [
    "node",
    {
      bigint: true
    }
  ],
  boolean: [
    "node",
    {
      boolean: true
    }
  ],
  false: [
    "node",
    {
      boolean: {
        value: false
      }
    }
  ],
  never: [
    "node",
    {}
  ],
  null: [
    "node",
    {
      null: true
    }
  ],
  number: [
    "node",
    {
      number: true
    }
  ],
  object: [
    "node",
    {
      object: true
    }
  ],
  string: [
    "node",
    {
      string: true
    }
  ],
  symbol: [
    "node",
    {
      symbol: true
    }
  ],
  true: [
    "node",
    {
      boolean: {
        value: true
      }
    }
  ],
  unknown: [
    "node",
    always
  ],
  void: [
    "node",
    {
      undefined: true
    }
  ],
  undefined: [
    "node",
    {
      undefined: true
    }
  ]
}, {
  name: "ts",
  standard: false
});
var tsKeywords = tsKeywordsScope.compile();

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/validation/creditCard.js
var isLuhnValid = (creditCardInput) => {
  const sanitized = creditCardInput.replace(/[- ]+/g, "");
  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
};
var creditCardMatcher = /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
var creditCard = rootType([
  creditCardMatcher,
  "=>",
  (s, problems) => isLuhnValid(s) || !problems.mustBe("a valid credit card number")
], {
  mustBe: "a valid credit card number"
});

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/validation/date.js
var dayDelimiterMatcher = /^[./-]$/;
var iso8601Matcher = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
var isValidDateInstance = (date) => !isNaN(date);
var writeFormattedMustBe = (format) => `a ${format}-formatted date`;
var tryParseDate = (data, opts) => {
  if (!opts?.format) {
    const result = new Date(data);
    return isValidDateInstance(result) ? result : "a valid date";
  }
  if (opts.format === "iso8601") {
    return iso8601Matcher.test(data) ? new Date(data) : writeFormattedMustBe("iso8601");
  }
  const dataParts = data.split(dayDelimiterMatcher);
  const delimiter = data[dataParts[0].length];
  const formatParts = delimiter ? opts.format.split(delimiter) : [
    opts.format
  ];
  if (dataParts.length !== formatParts.length) {
    return writeFormattedMustBe(opts.format);
  }
  const parsedParts = {};
  for (let i = 0; i < formatParts.length; i++) {
    if (dataParts[i].length !== formatParts[i].length && // if format is "m" or "d", data is allowed to be 1 or 2 characters
    !(formatParts[i].length === 1 && dataParts[i].length === 2)) {
      return writeFormattedMustBe(opts.format);
    }
    parsedParts[formatParts[i][0]] = dataParts[i];
  }
  const date = /* @__PURE__ */ new Date(`${parsedParts.m}/${parsedParts.d}/${parsedParts.y}`);
  if (`${date.getDate()}` === parsedParts.d) {
    return date;
  }
  return writeFormattedMustBe(opts.format);
};
var parsedDate = rootType([
  tsKeywords.string,
  "|>",
  (s, problems) => {
    const result = tryParseDate(s);
    return typeof result === "string" ? problems.mustBe(result) : result;
  }
]);

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/validation/validation.js
var parsedNumber = rootType([
  wellFormedNumberMatcher,
  "|>",
  (s) => parseFloat(s)
], {
  mustBe: "a well-formed numeric string"
});
var parsedInteger = rootType([
  tsKeywords.string,
  "|>",
  (s, problems) => {
    if (!isWellFormedInteger(s)) {
      return problems.mustBe("a well-formed integer string");
    }
    const parsed = parseInt(s);
    return Number.isSafeInteger(parsed) ? parsed : problems.mustBe("an integer in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER");
  }
]);
var email = rootType(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
  mustBe: "a valid email"
});
var uuid = rootType(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/, {
  mustBe: "a valid UUID"
});
var semver = rootType(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/, {
  mustBe: "a valid semantic version (see https://semver.org/)"
});
var json = rootType([
  tsKeywords.string,
  "|>",
  (s) => JSON.parse(s)
], {
  mustBe: "a JSON-parsable string"
});
var validationScope = scope({
  // Character sets
  alpha: [
    /^[A-Za-z]*$/,
    ":",
    {
      mustBe: "only letters"
    }
  ],
  alphanumeric: [
    /^[A-Za-z\d]*$/,
    ":",
    {
      mustBe: "only letters and digits"
    }
  ],
  lowercase: [
    /^[a-z]*$/,
    ":",
    {
      mustBe: "only lowercase letters"
    }
  ],
  uppercase: [
    /^[A-Z]*$/,
    ":",
    {
      mustBe: "only uppercase letters"
    }
  ],
  creditCard,
  email,
  uuid,
  parsedNumber,
  parsedInteger,
  parsedDate,
  semver,
  json,
  integer: [
    "node",
    {
      number: {
        divisor: 1
      }
    }
  ]
}, {
  name: "validation",
  standard: false
});
var validation = validationScope.compile();

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/ark.js
var arkScope = scope({}, {
  name: "standard",
  includes: [
    tsKeywords,
    jsObjects,
    validation
  ],
  standard: false
});
var ark = arkScope.compile();
var scopes = {
  root: rootScope,
  tsKeywords: tsKeywordsScope,
  jsObjects: jsObjectsScope,
  validation: validationScope,
  ark: arkScope
};
var type = arkScope.type;

// node_modules/.pnpm/arktype@1.0.28-alpha/node_modules/arktype/dist/mjs/scopes/expressions.js
var intersection = scopes.ark.intersection;
var union = scopes.ark.union;
var arrayOf = scopes.ark.arrayOf;
var keyOf = scopes.ark.keyOf;
var instanceOf = scopes.ark.instanceOf;
var valueOf = scopes.ark.valueOf;
var narrow = scopes.ark.narrow;
var morph = scopes.ark.morph;

// src/arktype.ts
var T = type({
  name: "string",
  age: "number"
});
export {
  T
};
