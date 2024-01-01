import type { Kv } from "@deno/kv";
import { Entity } from "../aws/entity.js";

export class IttyKv<T extends Entity> {
  constructor(readonly client: Kv, readonly entity: T) {}
}
