
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PaymentInstance
 * 
 */
export type PaymentInstance = $Result.DefaultSelection<Prisma.$PaymentInstancePayload>
/**
 * Model PaymentType
 * 
 */
export type PaymentType = $Result.DefaultSelection<Prisma.$PaymentTypePayload>
/**
 * Model PaymentCollection
 * 
 */
export type PaymentCollection = $Result.DefaultSelection<Prisma.$PaymentCollectionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentInstance`: Exposes CRUD operations for the **PaymentInstance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentInstances
    * const paymentInstances = await prisma.paymentInstance.findMany()
    * ```
    */
  get paymentInstance(): Prisma.PaymentInstanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentType`: Exposes CRUD operations for the **PaymentType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentTypes
    * const paymentTypes = await prisma.paymentType.findMany()
    * ```
    */
  get paymentType(): Prisma.PaymentTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentCollection`: Exposes CRUD operations for the **PaymentCollection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentCollections
    * const paymentCollections = await prisma.paymentCollection.findMany()
    * ```
    */
  get paymentCollection(): Prisma.PaymentCollectionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PaymentInstance: 'PaymentInstance',
    PaymentType: 'PaymentType',
    PaymentCollection: 'PaymentCollection'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "paymentInstance" | "paymentType" | "paymentCollection"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PaymentInstance: {
        payload: Prisma.$PaymentInstancePayload<ExtArgs>
        fields: Prisma.PaymentInstanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentInstanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentInstanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          findFirst: {
            args: Prisma.PaymentInstanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentInstanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          findMany: {
            args: Prisma.PaymentInstanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>[]
          }
          create: {
            args: Prisma.PaymentInstanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          createMany: {
            args: Prisma.PaymentInstanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentInstanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>[]
          }
          delete: {
            args: Prisma.PaymentInstanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          update: {
            args: Prisma.PaymentInstanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          deleteMany: {
            args: Prisma.PaymentInstanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentInstanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentInstanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>[]
          }
          upsert: {
            args: Prisma.PaymentInstanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentInstancePayload>
          }
          aggregate: {
            args: Prisma.PaymentInstanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentInstance>
          }
          groupBy: {
            args: Prisma.PaymentInstanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentInstanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentInstanceCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentInstanceCountAggregateOutputType> | number
          }
        }
      }
      PaymentType: {
        payload: Prisma.$PaymentTypePayload<ExtArgs>
        fields: Prisma.PaymentTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          findFirst: {
            args: Prisma.PaymentTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          findMany: {
            args: Prisma.PaymentTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>[]
          }
          create: {
            args: Prisma.PaymentTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          createMany: {
            args: Prisma.PaymentTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>[]
          }
          delete: {
            args: Prisma.PaymentTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          update: {
            args: Prisma.PaymentTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          deleteMany: {
            args: Prisma.PaymentTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>[]
          }
          upsert: {
            args: Prisma.PaymentTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentTypePayload>
          }
          aggregate: {
            args: Prisma.PaymentTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentType>
          }
          groupBy: {
            args: Prisma.PaymentTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentTypeCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentTypeCountAggregateOutputType> | number
          }
        }
      }
      PaymentCollection: {
        payload: Prisma.$PaymentCollectionPayload<ExtArgs>
        fields: Prisma.PaymentCollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentCollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentCollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          findFirst: {
            args: Prisma.PaymentCollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentCollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          findMany: {
            args: Prisma.PaymentCollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>[]
          }
          create: {
            args: Prisma.PaymentCollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          createMany: {
            args: Prisma.PaymentCollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>[]
          }
          delete: {
            args: Prisma.PaymentCollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          update: {
            args: Prisma.PaymentCollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          deleteMany: {
            args: Prisma.PaymentCollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentCollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentCollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>[]
          }
          upsert: {
            args: Prisma.PaymentCollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentCollectionPayload>
          }
          aggregate: {
            args: Prisma.PaymentCollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentCollection>
          }
          groupBy: {
            args: Prisma.PaymentCollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentCollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCollectionCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCollectionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    paymentInstance?: PaymentInstanceOmit
    paymentType?: PaymentTypeOmit
    paymentCollection?: PaymentCollectionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PaymentInstanceCountOutputType
   */

  export type PaymentInstanceCountOutputType = {
    collections: number
    paymentTypes: number
  }

  export type PaymentInstanceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collections?: boolean | PaymentInstanceCountOutputTypeCountCollectionsArgs
    paymentTypes?: boolean | PaymentInstanceCountOutputTypeCountPaymentTypesArgs
  }

  // Custom InputTypes
  /**
   * PaymentInstanceCountOutputType without action
   */
  export type PaymentInstanceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstanceCountOutputType
     */
    select?: PaymentInstanceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaymentInstanceCountOutputType without action
   */
  export type PaymentInstanceCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentCollectionWhereInput
  }

  /**
   * PaymentInstanceCountOutputType without action
   */
  export type PaymentInstanceCountOutputTypeCountPaymentTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentTypeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    plainPassword: string | null
    role: string | null
    instanceId: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    plainPassword: string | null
    role: string | null
    instanceId: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    plainPassword: number
    role: number
    instanceId: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    plainPassword?: true
    role?: true
    instanceId?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    plainPassword?: true
    role?: true
    instanceId?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    plainPassword?: true
    role?: true
    instanceId?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    plainPassword: string | null
    role: string
    instanceId: string | null
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    plainPassword?: boolean
    role?: boolean
    instanceId?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | User$instanceArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    plainPassword?: boolean
    role?: boolean
    instanceId?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | User$instanceArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    plainPassword?: boolean
    role?: boolean
    instanceId?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | User$instanceArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    plainPassword?: boolean
    role?: boolean
    instanceId?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "plainPassword" | "role" | "instanceId" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | User$instanceArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | User$instanceArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | User$instanceArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      instance: Prisma.$PaymentInstancePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      plainPassword: string | null
      role: string
      instanceId: string | null
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    instance<T extends User$instanceArgs<ExtArgs> = {}>(args?: Subset<T, User$instanceArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly plainPassword: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly instanceId: FieldRef<"User", 'String'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.instance
   */
  export type User$instanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    where?: PaymentInstanceWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PaymentInstance
   */

  export type AggregatePaymentInstance = {
    _count: PaymentInstanceCountAggregateOutputType | null
    _avg: PaymentInstanceAvgAggregateOutputType | null
    _sum: PaymentInstanceSumAggregateOutputType | null
    _min: PaymentInstanceMinAggregateOutputType | null
    _max: PaymentInstanceMaxAggregateOutputType | null
  }

  export type PaymentInstanceAvgAggregateOutputType = {
    idclPercent: number | null
  }

  export type PaymentInstanceSumAggregateOutputType = {
    idclPercent: number | null
  }

  export type PaymentInstanceMinAggregateOutputType = {
    id: string | null
    name: string | null
    splitCode: string | null
    idclPercent: number | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentInstanceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    splitCode: string | null
    idclPercent: number | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentInstanceCountAggregateOutputType = {
    id: number
    name: number
    splitCode: number
    idclPercent: number
    summary: number
    entities: number
    formFields: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentInstanceAvgAggregateInputType = {
    idclPercent?: true
  }

  export type PaymentInstanceSumAggregateInputType = {
    idclPercent?: true
  }

  export type PaymentInstanceMinAggregateInputType = {
    id?: true
    name?: true
    splitCode?: true
    idclPercent?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentInstanceMaxAggregateInputType = {
    id?: true
    name?: true
    splitCode?: true
    idclPercent?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentInstanceCountAggregateInputType = {
    id?: true
    name?: true
    splitCode?: true
    idclPercent?: true
    summary?: true
    entities?: true
    formFields?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentInstanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentInstance to aggregate.
     */
    where?: PaymentInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentInstances to fetch.
     */
    orderBy?: PaymentInstanceOrderByWithRelationInput | PaymentInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentInstances
    **/
    _count?: true | PaymentInstanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentInstanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentInstanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentInstanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentInstanceMaxAggregateInputType
  }

  export type GetPaymentInstanceAggregateType<T extends PaymentInstanceAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentInstance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentInstance[P]>
      : GetScalarType<T[P], AggregatePaymentInstance[P]>
  }




  export type PaymentInstanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentInstanceWhereInput
    orderBy?: PaymentInstanceOrderByWithAggregationInput | PaymentInstanceOrderByWithAggregationInput[]
    by: PaymentInstanceScalarFieldEnum[] | PaymentInstanceScalarFieldEnum
    having?: PaymentInstanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentInstanceCountAggregateInputType | true
    _avg?: PaymentInstanceAvgAggregateInputType
    _sum?: PaymentInstanceSumAggregateInputType
    _min?: PaymentInstanceMinAggregateInputType
    _max?: PaymentInstanceMaxAggregateInputType
  }

  export type PaymentInstanceGroupByOutputType = {
    id: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonValue
    formFields: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PaymentInstanceCountAggregateOutputType | null
    _avg: PaymentInstanceAvgAggregateOutputType | null
    _sum: PaymentInstanceSumAggregateOutputType | null
    _min: PaymentInstanceMinAggregateOutputType | null
    _max: PaymentInstanceMaxAggregateOutputType | null
  }

  type GetPaymentInstanceGroupByPayload<T extends PaymentInstanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentInstanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentInstanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentInstanceGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentInstanceGroupByOutputType[P]>
        }
      >
    >


  export type PaymentInstanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    splitCode?: boolean
    idclPercent?: boolean
    summary?: boolean
    entities?: boolean
    formFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    collections?: boolean | PaymentInstance$collectionsArgs<ExtArgs>
    paymentTypes?: boolean | PaymentInstance$paymentTypesArgs<ExtArgs>
    operator?: boolean | PaymentInstance$operatorArgs<ExtArgs>
    _count?: boolean | PaymentInstanceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentInstance"]>

  export type PaymentInstanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    splitCode?: boolean
    idclPercent?: boolean
    summary?: boolean
    entities?: boolean
    formFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["paymentInstance"]>

  export type PaymentInstanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    splitCode?: boolean
    idclPercent?: boolean
    summary?: boolean
    entities?: boolean
    formFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["paymentInstance"]>

  export type PaymentInstanceSelectScalar = {
    id?: boolean
    name?: boolean
    splitCode?: boolean
    idclPercent?: boolean
    summary?: boolean
    entities?: boolean
    formFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentInstanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "splitCode" | "idclPercent" | "summary" | "entities" | "formFields" | "createdAt" | "updatedAt", ExtArgs["result"]["paymentInstance"]>
  export type PaymentInstanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collections?: boolean | PaymentInstance$collectionsArgs<ExtArgs>
    paymentTypes?: boolean | PaymentInstance$paymentTypesArgs<ExtArgs>
    operator?: boolean | PaymentInstance$operatorArgs<ExtArgs>
    _count?: boolean | PaymentInstanceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaymentInstanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PaymentInstanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PaymentInstancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentInstance"
    objects: {
      collections: Prisma.$PaymentCollectionPayload<ExtArgs>[]
      paymentTypes: Prisma.$PaymentTypePayload<ExtArgs>[]
      operator: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      splitCode: string
      idclPercent: number
      summary: string
      entities: Prisma.JsonValue
      formFields: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["paymentInstance"]>
    composites: {}
  }

  type PaymentInstanceGetPayload<S extends boolean | null | undefined | PaymentInstanceDefaultArgs> = $Result.GetResult<Prisma.$PaymentInstancePayload, S>

  type PaymentInstanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentInstanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentInstanceCountAggregateInputType | true
    }

  export interface PaymentInstanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentInstance'], meta: { name: 'PaymentInstance' } }
    /**
     * Find zero or one PaymentInstance that matches the filter.
     * @param {PaymentInstanceFindUniqueArgs} args - Arguments to find a PaymentInstance
     * @example
     * // Get one PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentInstanceFindUniqueArgs>(args: SelectSubset<T, PaymentInstanceFindUniqueArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentInstance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentInstanceFindUniqueOrThrowArgs} args - Arguments to find a PaymentInstance
     * @example
     * // Get one PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentInstanceFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentInstanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentInstance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceFindFirstArgs} args - Arguments to find a PaymentInstance
     * @example
     * // Get one PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentInstanceFindFirstArgs>(args?: SelectSubset<T, PaymentInstanceFindFirstArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentInstance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceFindFirstOrThrowArgs} args - Arguments to find a PaymentInstance
     * @example
     * // Get one PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentInstanceFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentInstanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentInstances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentInstances
     * const paymentInstances = await prisma.paymentInstance.findMany()
     * 
     * // Get first 10 PaymentInstances
     * const paymentInstances = await prisma.paymentInstance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentInstanceWithIdOnly = await prisma.paymentInstance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentInstanceFindManyArgs>(args?: SelectSubset<T, PaymentInstanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentInstance.
     * @param {PaymentInstanceCreateArgs} args - Arguments to create a PaymentInstance.
     * @example
     * // Create one PaymentInstance
     * const PaymentInstance = await prisma.paymentInstance.create({
     *   data: {
     *     // ... data to create a PaymentInstance
     *   }
     * })
     * 
     */
    create<T extends PaymentInstanceCreateArgs>(args: SelectSubset<T, PaymentInstanceCreateArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentInstances.
     * @param {PaymentInstanceCreateManyArgs} args - Arguments to create many PaymentInstances.
     * @example
     * // Create many PaymentInstances
     * const paymentInstance = await prisma.paymentInstance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentInstanceCreateManyArgs>(args?: SelectSubset<T, PaymentInstanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentInstances and returns the data saved in the database.
     * @param {PaymentInstanceCreateManyAndReturnArgs} args - Arguments to create many PaymentInstances.
     * @example
     * // Create many PaymentInstances
     * const paymentInstance = await prisma.paymentInstance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentInstances and only return the `id`
     * const paymentInstanceWithIdOnly = await prisma.paymentInstance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentInstanceCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentInstanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaymentInstance.
     * @param {PaymentInstanceDeleteArgs} args - Arguments to delete one PaymentInstance.
     * @example
     * // Delete one PaymentInstance
     * const PaymentInstance = await prisma.paymentInstance.delete({
     *   where: {
     *     // ... filter to delete one PaymentInstance
     *   }
     * })
     * 
     */
    delete<T extends PaymentInstanceDeleteArgs>(args: SelectSubset<T, PaymentInstanceDeleteArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentInstance.
     * @param {PaymentInstanceUpdateArgs} args - Arguments to update one PaymentInstance.
     * @example
     * // Update one PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentInstanceUpdateArgs>(args: SelectSubset<T, PaymentInstanceUpdateArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentInstances.
     * @param {PaymentInstanceDeleteManyArgs} args - Arguments to filter PaymentInstances to delete.
     * @example
     * // Delete a few PaymentInstances
     * const { count } = await prisma.paymentInstance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentInstanceDeleteManyArgs>(args?: SelectSubset<T, PaymentInstanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentInstances
     * const paymentInstance = await prisma.paymentInstance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentInstanceUpdateManyArgs>(args: SelectSubset<T, PaymentInstanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentInstances and returns the data updated in the database.
     * @param {PaymentInstanceUpdateManyAndReturnArgs} args - Arguments to update many PaymentInstances.
     * @example
     * // Update many PaymentInstances
     * const paymentInstance = await prisma.paymentInstance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaymentInstances and only return the `id`
     * const paymentInstanceWithIdOnly = await prisma.paymentInstance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentInstanceUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentInstanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaymentInstance.
     * @param {PaymentInstanceUpsertArgs} args - Arguments to update or create a PaymentInstance.
     * @example
     * // Update or create a PaymentInstance
     * const paymentInstance = await prisma.paymentInstance.upsert({
     *   create: {
     *     // ... data to create a PaymentInstance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentInstance we want to update
     *   }
     * })
     */
    upsert<T extends PaymentInstanceUpsertArgs>(args: SelectSubset<T, PaymentInstanceUpsertArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceCountArgs} args - Arguments to filter PaymentInstances to count.
     * @example
     * // Count the number of PaymentInstances
     * const count = await prisma.paymentInstance.count({
     *   where: {
     *     // ... the filter for the PaymentInstances we want to count
     *   }
     * })
    **/
    count<T extends PaymentInstanceCountArgs>(
      args?: Subset<T, PaymentInstanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentInstanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentInstanceAggregateArgs>(args: Subset<T, PaymentInstanceAggregateArgs>): Prisma.PrismaPromise<GetPaymentInstanceAggregateType<T>>

    /**
     * Group by PaymentInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentInstanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentInstanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentInstanceGroupByArgs['orderBy'] }
        : { orderBy?: PaymentInstanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentInstanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentInstanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentInstance model
   */
  readonly fields: PaymentInstanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentInstance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentInstanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    collections<T extends PaymentInstance$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, PaymentInstance$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    paymentTypes<T extends PaymentInstance$paymentTypesArgs<ExtArgs> = {}>(args?: Subset<T, PaymentInstance$paymentTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    operator<T extends PaymentInstance$operatorArgs<ExtArgs> = {}>(args?: Subset<T, PaymentInstance$operatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentInstance model
   */
  interface PaymentInstanceFieldRefs {
    readonly id: FieldRef<"PaymentInstance", 'String'>
    readonly name: FieldRef<"PaymentInstance", 'String'>
    readonly splitCode: FieldRef<"PaymentInstance", 'String'>
    readonly idclPercent: FieldRef<"PaymentInstance", 'Float'>
    readonly summary: FieldRef<"PaymentInstance", 'String'>
    readonly entities: FieldRef<"PaymentInstance", 'Json'>
    readonly formFields: FieldRef<"PaymentInstance", 'Json'>
    readonly createdAt: FieldRef<"PaymentInstance", 'DateTime'>
    readonly updatedAt: FieldRef<"PaymentInstance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentInstance findUnique
   */
  export type PaymentInstanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter, which PaymentInstance to fetch.
     */
    where: PaymentInstanceWhereUniqueInput
  }

  /**
   * PaymentInstance findUniqueOrThrow
   */
  export type PaymentInstanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter, which PaymentInstance to fetch.
     */
    where: PaymentInstanceWhereUniqueInput
  }

  /**
   * PaymentInstance findFirst
   */
  export type PaymentInstanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter, which PaymentInstance to fetch.
     */
    where?: PaymentInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentInstances to fetch.
     */
    orderBy?: PaymentInstanceOrderByWithRelationInput | PaymentInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentInstances.
     */
    cursor?: PaymentInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentInstances.
     */
    distinct?: PaymentInstanceScalarFieldEnum | PaymentInstanceScalarFieldEnum[]
  }

  /**
   * PaymentInstance findFirstOrThrow
   */
  export type PaymentInstanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter, which PaymentInstance to fetch.
     */
    where?: PaymentInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentInstances to fetch.
     */
    orderBy?: PaymentInstanceOrderByWithRelationInput | PaymentInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentInstances.
     */
    cursor?: PaymentInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentInstances.
     */
    distinct?: PaymentInstanceScalarFieldEnum | PaymentInstanceScalarFieldEnum[]
  }

  /**
   * PaymentInstance findMany
   */
  export type PaymentInstanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter, which PaymentInstances to fetch.
     */
    where?: PaymentInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentInstances to fetch.
     */
    orderBy?: PaymentInstanceOrderByWithRelationInput | PaymentInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentInstances.
     */
    cursor?: PaymentInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentInstances.
     */
    skip?: number
    distinct?: PaymentInstanceScalarFieldEnum | PaymentInstanceScalarFieldEnum[]
  }

  /**
   * PaymentInstance create
   */
  export type PaymentInstanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentInstance.
     */
    data: XOR<PaymentInstanceCreateInput, PaymentInstanceUncheckedCreateInput>
  }

  /**
   * PaymentInstance createMany
   */
  export type PaymentInstanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentInstances.
     */
    data: PaymentInstanceCreateManyInput | PaymentInstanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentInstance createManyAndReturn
   */
  export type PaymentInstanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * The data used to create many PaymentInstances.
     */
    data: PaymentInstanceCreateManyInput | PaymentInstanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentInstance update
   */
  export type PaymentInstanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentInstance.
     */
    data: XOR<PaymentInstanceUpdateInput, PaymentInstanceUncheckedUpdateInput>
    /**
     * Choose, which PaymentInstance to update.
     */
    where: PaymentInstanceWhereUniqueInput
  }

  /**
   * PaymentInstance updateMany
   */
  export type PaymentInstanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentInstances.
     */
    data: XOR<PaymentInstanceUpdateManyMutationInput, PaymentInstanceUncheckedUpdateManyInput>
    /**
     * Filter which PaymentInstances to update
     */
    where?: PaymentInstanceWhereInput
    /**
     * Limit how many PaymentInstances to update.
     */
    limit?: number
  }

  /**
   * PaymentInstance updateManyAndReturn
   */
  export type PaymentInstanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * The data used to update PaymentInstances.
     */
    data: XOR<PaymentInstanceUpdateManyMutationInput, PaymentInstanceUncheckedUpdateManyInput>
    /**
     * Filter which PaymentInstances to update
     */
    where?: PaymentInstanceWhereInput
    /**
     * Limit how many PaymentInstances to update.
     */
    limit?: number
  }

  /**
   * PaymentInstance upsert
   */
  export type PaymentInstanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentInstance to update in case it exists.
     */
    where: PaymentInstanceWhereUniqueInput
    /**
     * In case the PaymentInstance found by the `where` argument doesn't exist, create a new PaymentInstance with this data.
     */
    create: XOR<PaymentInstanceCreateInput, PaymentInstanceUncheckedCreateInput>
    /**
     * In case the PaymentInstance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentInstanceUpdateInput, PaymentInstanceUncheckedUpdateInput>
  }

  /**
   * PaymentInstance delete
   */
  export type PaymentInstanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
    /**
     * Filter which PaymentInstance to delete.
     */
    where: PaymentInstanceWhereUniqueInput
  }

  /**
   * PaymentInstance deleteMany
   */
  export type PaymentInstanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentInstances to delete
     */
    where?: PaymentInstanceWhereInput
    /**
     * Limit how many PaymentInstances to delete.
     */
    limit?: number
  }

  /**
   * PaymentInstance.collections
   */
  export type PaymentInstance$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    where?: PaymentCollectionWhereInput
    orderBy?: PaymentCollectionOrderByWithRelationInput | PaymentCollectionOrderByWithRelationInput[]
    cursor?: PaymentCollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentCollectionScalarFieldEnum | PaymentCollectionScalarFieldEnum[]
  }

  /**
   * PaymentInstance.paymentTypes
   */
  export type PaymentInstance$paymentTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    where?: PaymentTypeWhereInput
    orderBy?: PaymentTypeOrderByWithRelationInput | PaymentTypeOrderByWithRelationInput[]
    cursor?: PaymentTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentTypeScalarFieldEnum | PaymentTypeScalarFieldEnum[]
  }

  /**
   * PaymentInstance.operator
   */
  export type PaymentInstance$operatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PaymentInstance without action
   */
  export type PaymentInstanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentInstance
     */
    select?: PaymentInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentInstance
     */
    omit?: PaymentInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInstanceInclude<ExtArgs> | null
  }


  /**
   * Model PaymentType
   */

  export type AggregatePaymentType = {
    _count: PaymentTypeCountAggregateOutputType | null
    _avg: PaymentTypeAvgAggregateOutputType | null
    _sum: PaymentTypeSumAggregateOutputType | null
    _min: PaymentTypeMinAggregateOutputType | null
    _max: PaymentTypeMaxAggregateOutputType | null
  }

  export type PaymentTypeAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentTypeSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentTypeMinAggregateOutputType = {
    id: string | null
    instanceId: string | null
    name: string | null
    description: string | null
    amount: number | null
    splitCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentTypeMaxAggregateOutputType = {
    id: string | null
    instanceId: string | null
    name: string | null
    description: string | null
    amount: number | null
    splitCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentTypeCountAggregateOutputType = {
    id: number
    instanceId: number
    name: number
    description: number
    amount: number
    splitCode: number
    splitEntities: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentTypeAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentTypeSumAggregateInputType = {
    amount?: true
  }

  export type PaymentTypeMinAggregateInputType = {
    id?: true
    instanceId?: true
    name?: true
    description?: true
    amount?: true
    splitCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentTypeMaxAggregateInputType = {
    id?: true
    instanceId?: true
    name?: true
    description?: true
    amount?: true
    splitCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentTypeCountAggregateInputType = {
    id?: true
    instanceId?: true
    name?: true
    description?: true
    amount?: true
    splitCode?: true
    splitEntities?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentType to aggregate.
     */
    where?: PaymentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTypes to fetch.
     */
    orderBy?: PaymentTypeOrderByWithRelationInput | PaymentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentTypes
    **/
    _count?: true | PaymentTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentTypeMaxAggregateInputType
  }

  export type GetPaymentTypeAggregateType<T extends PaymentTypeAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentType[P]>
      : GetScalarType<T[P], AggregatePaymentType[P]>
  }




  export type PaymentTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentTypeWhereInput
    orderBy?: PaymentTypeOrderByWithAggregationInput | PaymentTypeOrderByWithAggregationInput[]
    by: PaymentTypeScalarFieldEnum[] | PaymentTypeScalarFieldEnum
    having?: PaymentTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentTypeCountAggregateInputType | true
    _avg?: PaymentTypeAvgAggregateInputType
    _sum?: PaymentTypeSumAggregateInputType
    _min?: PaymentTypeMinAggregateInputType
    _max?: PaymentTypeMaxAggregateInputType
  }

  export type PaymentTypeGroupByOutputType = {
    id: string
    instanceId: string
    name: string
    description: string | null
    amount: number
    splitCode: string | null
    splitEntities: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PaymentTypeCountAggregateOutputType | null
    _avg: PaymentTypeAvgAggregateOutputType | null
    _sum: PaymentTypeSumAggregateOutputType | null
    _min: PaymentTypeMinAggregateOutputType | null
    _max: PaymentTypeMaxAggregateOutputType | null
  }

  type GetPaymentTypeGroupByPayload<T extends PaymentTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentTypeGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentTypeGroupByOutputType[P]>
        }
      >
    >


  export type PaymentTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    name?: boolean
    description?: boolean
    amount?: boolean
    splitCode?: boolean
    splitEntities?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentType"]>

  export type PaymentTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    name?: boolean
    description?: boolean
    amount?: boolean
    splitCode?: boolean
    splitEntities?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentType"]>

  export type PaymentTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    name?: boolean
    description?: boolean
    amount?: boolean
    splitCode?: boolean
    splitEntities?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentType"]>

  export type PaymentTypeSelectScalar = {
    id?: boolean
    instanceId?: boolean
    name?: boolean
    description?: boolean
    amount?: boolean
    splitCode?: boolean
    splitEntities?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "instanceId" | "name" | "description" | "amount" | "splitCode" | "splitEntities" | "createdAt" | "updatedAt", ExtArgs["result"]["paymentType"]>
  export type PaymentTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }
  export type PaymentTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }
  export type PaymentTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }

  export type $PaymentTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentType"
    objects: {
      instance: Prisma.$PaymentInstancePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      instanceId: string
      name: string
      description: string | null
      amount: number
      splitCode: string | null
      splitEntities: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["paymentType"]>
    composites: {}
  }

  type PaymentTypeGetPayload<S extends boolean | null | undefined | PaymentTypeDefaultArgs> = $Result.GetResult<Prisma.$PaymentTypePayload, S>

  type PaymentTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentTypeCountAggregateInputType | true
    }

  export interface PaymentTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentType'], meta: { name: 'PaymentType' } }
    /**
     * Find zero or one PaymentType that matches the filter.
     * @param {PaymentTypeFindUniqueArgs} args - Arguments to find a PaymentType
     * @example
     * // Get one PaymentType
     * const paymentType = await prisma.paymentType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentTypeFindUniqueArgs>(args: SelectSubset<T, PaymentTypeFindUniqueArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentTypeFindUniqueOrThrowArgs} args - Arguments to find a PaymentType
     * @example
     * // Get one PaymentType
     * const paymentType = await prisma.paymentType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeFindFirstArgs} args - Arguments to find a PaymentType
     * @example
     * // Get one PaymentType
     * const paymentType = await prisma.paymentType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentTypeFindFirstArgs>(args?: SelectSubset<T, PaymentTypeFindFirstArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeFindFirstOrThrowArgs} args - Arguments to find a PaymentType
     * @example
     * // Get one PaymentType
     * const paymentType = await prisma.paymentType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentTypes
     * const paymentTypes = await prisma.paymentType.findMany()
     * 
     * // Get first 10 PaymentTypes
     * const paymentTypes = await prisma.paymentType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentTypeWithIdOnly = await prisma.paymentType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentTypeFindManyArgs>(args?: SelectSubset<T, PaymentTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentType.
     * @param {PaymentTypeCreateArgs} args - Arguments to create a PaymentType.
     * @example
     * // Create one PaymentType
     * const PaymentType = await prisma.paymentType.create({
     *   data: {
     *     // ... data to create a PaymentType
     *   }
     * })
     * 
     */
    create<T extends PaymentTypeCreateArgs>(args: SelectSubset<T, PaymentTypeCreateArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentTypes.
     * @param {PaymentTypeCreateManyArgs} args - Arguments to create many PaymentTypes.
     * @example
     * // Create many PaymentTypes
     * const paymentType = await prisma.paymentType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentTypeCreateManyArgs>(args?: SelectSubset<T, PaymentTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentTypes and returns the data saved in the database.
     * @param {PaymentTypeCreateManyAndReturnArgs} args - Arguments to create many PaymentTypes.
     * @example
     * // Create many PaymentTypes
     * const paymentType = await prisma.paymentType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentTypes and only return the `id`
     * const paymentTypeWithIdOnly = await prisma.paymentType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaymentType.
     * @param {PaymentTypeDeleteArgs} args - Arguments to delete one PaymentType.
     * @example
     * // Delete one PaymentType
     * const PaymentType = await prisma.paymentType.delete({
     *   where: {
     *     // ... filter to delete one PaymentType
     *   }
     * })
     * 
     */
    delete<T extends PaymentTypeDeleteArgs>(args: SelectSubset<T, PaymentTypeDeleteArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentType.
     * @param {PaymentTypeUpdateArgs} args - Arguments to update one PaymentType.
     * @example
     * // Update one PaymentType
     * const paymentType = await prisma.paymentType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentTypeUpdateArgs>(args: SelectSubset<T, PaymentTypeUpdateArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentTypes.
     * @param {PaymentTypeDeleteManyArgs} args - Arguments to filter PaymentTypes to delete.
     * @example
     * // Delete a few PaymentTypes
     * const { count } = await prisma.paymentType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentTypeDeleteManyArgs>(args?: SelectSubset<T, PaymentTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentTypes
     * const paymentType = await prisma.paymentType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentTypeUpdateManyArgs>(args: SelectSubset<T, PaymentTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentTypes and returns the data updated in the database.
     * @param {PaymentTypeUpdateManyAndReturnArgs} args - Arguments to update many PaymentTypes.
     * @example
     * // Update many PaymentTypes
     * const paymentType = await prisma.paymentType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaymentTypes and only return the `id`
     * const paymentTypeWithIdOnly = await prisma.paymentType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaymentType.
     * @param {PaymentTypeUpsertArgs} args - Arguments to update or create a PaymentType.
     * @example
     * // Update or create a PaymentType
     * const paymentType = await prisma.paymentType.upsert({
     *   create: {
     *     // ... data to create a PaymentType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentType we want to update
     *   }
     * })
     */
    upsert<T extends PaymentTypeUpsertArgs>(args: SelectSubset<T, PaymentTypeUpsertArgs<ExtArgs>>): Prisma__PaymentTypeClient<$Result.GetResult<Prisma.$PaymentTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeCountArgs} args - Arguments to filter PaymentTypes to count.
     * @example
     * // Count the number of PaymentTypes
     * const count = await prisma.paymentType.count({
     *   where: {
     *     // ... the filter for the PaymentTypes we want to count
     *   }
     * })
    **/
    count<T extends PaymentTypeCountArgs>(
      args?: Subset<T, PaymentTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentTypeAggregateArgs>(args: Subset<T, PaymentTypeAggregateArgs>): Prisma.PrismaPromise<GetPaymentTypeAggregateType<T>>

    /**
     * Group by PaymentType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentTypeGroupByArgs['orderBy'] }
        : { orderBy?: PaymentTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentType model
   */
  readonly fields: PaymentTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    instance<T extends PaymentInstanceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentInstanceDefaultArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentType model
   */
  interface PaymentTypeFieldRefs {
    readonly id: FieldRef<"PaymentType", 'String'>
    readonly instanceId: FieldRef<"PaymentType", 'String'>
    readonly name: FieldRef<"PaymentType", 'String'>
    readonly description: FieldRef<"PaymentType", 'String'>
    readonly amount: FieldRef<"PaymentType", 'Float'>
    readonly splitCode: FieldRef<"PaymentType", 'String'>
    readonly splitEntities: FieldRef<"PaymentType", 'Json'>
    readonly createdAt: FieldRef<"PaymentType", 'DateTime'>
    readonly updatedAt: FieldRef<"PaymentType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentType findUnique
   */
  export type PaymentTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter, which PaymentType to fetch.
     */
    where: PaymentTypeWhereUniqueInput
  }

  /**
   * PaymentType findUniqueOrThrow
   */
  export type PaymentTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter, which PaymentType to fetch.
     */
    where: PaymentTypeWhereUniqueInput
  }

  /**
   * PaymentType findFirst
   */
  export type PaymentTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter, which PaymentType to fetch.
     */
    where?: PaymentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTypes to fetch.
     */
    orderBy?: PaymentTypeOrderByWithRelationInput | PaymentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentTypes.
     */
    cursor?: PaymentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentTypes.
     */
    distinct?: PaymentTypeScalarFieldEnum | PaymentTypeScalarFieldEnum[]
  }

  /**
   * PaymentType findFirstOrThrow
   */
  export type PaymentTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter, which PaymentType to fetch.
     */
    where?: PaymentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTypes to fetch.
     */
    orderBy?: PaymentTypeOrderByWithRelationInput | PaymentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentTypes.
     */
    cursor?: PaymentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentTypes.
     */
    distinct?: PaymentTypeScalarFieldEnum | PaymentTypeScalarFieldEnum[]
  }

  /**
   * PaymentType findMany
   */
  export type PaymentTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter, which PaymentTypes to fetch.
     */
    where?: PaymentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentTypes to fetch.
     */
    orderBy?: PaymentTypeOrderByWithRelationInput | PaymentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentTypes.
     */
    cursor?: PaymentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentTypes.
     */
    skip?: number
    distinct?: PaymentTypeScalarFieldEnum | PaymentTypeScalarFieldEnum[]
  }

  /**
   * PaymentType create
   */
  export type PaymentTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentType.
     */
    data: XOR<PaymentTypeCreateInput, PaymentTypeUncheckedCreateInput>
  }

  /**
   * PaymentType createMany
   */
  export type PaymentTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentTypes.
     */
    data: PaymentTypeCreateManyInput | PaymentTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentType createManyAndReturn
   */
  export type PaymentTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * The data used to create many PaymentTypes.
     */
    data: PaymentTypeCreateManyInput | PaymentTypeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentType update
   */
  export type PaymentTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentType.
     */
    data: XOR<PaymentTypeUpdateInput, PaymentTypeUncheckedUpdateInput>
    /**
     * Choose, which PaymentType to update.
     */
    where: PaymentTypeWhereUniqueInput
  }

  /**
   * PaymentType updateMany
   */
  export type PaymentTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentTypes.
     */
    data: XOR<PaymentTypeUpdateManyMutationInput, PaymentTypeUncheckedUpdateManyInput>
    /**
     * Filter which PaymentTypes to update
     */
    where?: PaymentTypeWhereInput
    /**
     * Limit how many PaymentTypes to update.
     */
    limit?: number
  }

  /**
   * PaymentType updateManyAndReturn
   */
  export type PaymentTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * The data used to update PaymentTypes.
     */
    data: XOR<PaymentTypeUpdateManyMutationInput, PaymentTypeUncheckedUpdateManyInput>
    /**
     * Filter which PaymentTypes to update
     */
    where?: PaymentTypeWhereInput
    /**
     * Limit how many PaymentTypes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentType upsert
   */
  export type PaymentTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentType to update in case it exists.
     */
    where: PaymentTypeWhereUniqueInput
    /**
     * In case the PaymentType found by the `where` argument doesn't exist, create a new PaymentType with this data.
     */
    create: XOR<PaymentTypeCreateInput, PaymentTypeUncheckedCreateInput>
    /**
     * In case the PaymentType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentTypeUpdateInput, PaymentTypeUncheckedUpdateInput>
  }

  /**
   * PaymentType delete
   */
  export type PaymentTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
    /**
     * Filter which PaymentType to delete.
     */
    where: PaymentTypeWhereUniqueInput
  }

  /**
   * PaymentType deleteMany
   */
  export type PaymentTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentTypes to delete
     */
    where?: PaymentTypeWhereInput
    /**
     * Limit how many PaymentTypes to delete.
     */
    limit?: number
  }

  /**
   * PaymentType without action
   */
  export type PaymentTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentType
     */
    select?: PaymentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentType
     */
    omit?: PaymentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentTypeInclude<ExtArgs> | null
  }


  /**
   * Model PaymentCollection
   */

  export type AggregatePaymentCollection = {
    _count: PaymentCollectionCountAggregateOutputType | null
    _avg: PaymentCollectionAvgAggregateOutputType | null
    _sum: PaymentCollectionSumAggregateOutputType | null
    _min: PaymentCollectionMinAggregateOutputType | null
    _max: PaymentCollectionMaxAggregateOutputType | null
  }

  export type PaymentCollectionAvgAggregateOutputType = {
    amount: number | null
    quantity: number | null
    idclAmount: number | null
    motAmount: number | null
  }

  export type PaymentCollectionSumAggregateOutputType = {
    amount: number | null
    quantity: number | null
    idclAmount: number | null
    motAmount: number | null
  }

  export type PaymentCollectionMinAggregateOutputType = {
    id: string | null
    instanceId: string | null
    instanceName: string | null
    splitCode: string | null
    paymentTypeId: string | null
    paymentType: string | null
    payer: string | null
    amount: number | null
    quantity: number | null
    idclAmount: number | null
    motAmount: number | null
    paystackReference: string | null
    collectedAt: string | null
    createdAt: Date | null
  }

  export type PaymentCollectionMaxAggregateOutputType = {
    id: string | null
    instanceId: string | null
    instanceName: string | null
    splitCode: string | null
    paymentTypeId: string | null
    paymentType: string | null
    payer: string | null
    amount: number | null
    quantity: number | null
    idclAmount: number | null
    motAmount: number | null
    paystackReference: string | null
    collectedAt: string | null
    createdAt: Date | null
  }

  export type PaymentCollectionCountAggregateOutputType = {
    id: number
    instanceId: number
    instanceName: number
    splitCode: number
    paymentTypeId: number
    paymentType: number
    payer: number
    amount: number
    quantity: number
    idclAmount: number
    motAmount: number
    metadata: number
    paystackReference: number
    collectedAt: number
    createdAt: number
    _all: number
  }


  export type PaymentCollectionAvgAggregateInputType = {
    amount?: true
    quantity?: true
    idclAmount?: true
    motAmount?: true
  }

  export type PaymentCollectionSumAggregateInputType = {
    amount?: true
    quantity?: true
    idclAmount?: true
    motAmount?: true
  }

  export type PaymentCollectionMinAggregateInputType = {
    id?: true
    instanceId?: true
    instanceName?: true
    splitCode?: true
    paymentTypeId?: true
    paymentType?: true
    payer?: true
    amount?: true
    quantity?: true
    idclAmount?: true
    motAmount?: true
    paystackReference?: true
    collectedAt?: true
    createdAt?: true
  }

  export type PaymentCollectionMaxAggregateInputType = {
    id?: true
    instanceId?: true
    instanceName?: true
    splitCode?: true
    paymentTypeId?: true
    paymentType?: true
    payer?: true
    amount?: true
    quantity?: true
    idclAmount?: true
    motAmount?: true
    paystackReference?: true
    collectedAt?: true
    createdAt?: true
  }

  export type PaymentCollectionCountAggregateInputType = {
    id?: true
    instanceId?: true
    instanceName?: true
    splitCode?: true
    paymentTypeId?: true
    paymentType?: true
    payer?: true
    amount?: true
    quantity?: true
    idclAmount?: true
    motAmount?: true
    metadata?: true
    paystackReference?: true
    collectedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentCollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentCollection to aggregate.
     */
    where?: PaymentCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCollections to fetch.
     */
    orderBy?: PaymentCollectionOrderByWithRelationInput | PaymentCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentCollections
    **/
    _count?: true | PaymentCollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentCollectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentCollectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentCollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentCollectionMaxAggregateInputType
  }

  export type GetPaymentCollectionAggregateType<T extends PaymentCollectionAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentCollection[P]>
      : GetScalarType<T[P], AggregatePaymentCollection[P]>
  }




  export type PaymentCollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentCollectionWhereInput
    orderBy?: PaymentCollectionOrderByWithAggregationInput | PaymentCollectionOrderByWithAggregationInput[]
    by: PaymentCollectionScalarFieldEnum[] | PaymentCollectionScalarFieldEnum
    having?: PaymentCollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCollectionCountAggregateInputType | true
    _avg?: PaymentCollectionAvgAggregateInputType
    _sum?: PaymentCollectionSumAggregateInputType
    _min?: PaymentCollectionMinAggregateInputType
    _max?: PaymentCollectionMaxAggregateInputType
  }

  export type PaymentCollectionGroupByOutputType = {
    id: string
    instanceId: string
    instanceName: string
    splitCode: string
    paymentTypeId: string | null
    paymentType: string | null
    payer: string
    amount: number
    quantity: number
    idclAmount: number
    motAmount: number
    metadata: JsonValue
    paystackReference: string | null
    collectedAt: string
    createdAt: Date
    _count: PaymentCollectionCountAggregateOutputType | null
    _avg: PaymentCollectionAvgAggregateOutputType | null
    _sum: PaymentCollectionSumAggregateOutputType | null
    _min: PaymentCollectionMinAggregateOutputType | null
    _max: PaymentCollectionMaxAggregateOutputType | null
  }

  type GetPaymentCollectionGroupByPayload<T extends PaymentCollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentCollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentCollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentCollectionGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentCollectionGroupByOutputType[P]>
        }
      >
    >


  export type PaymentCollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    instanceName?: boolean
    splitCode?: boolean
    paymentTypeId?: boolean
    paymentType?: boolean
    payer?: boolean
    amount?: boolean
    quantity?: boolean
    idclAmount?: boolean
    motAmount?: boolean
    metadata?: boolean
    paystackReference?: boolean
    collectedAt?: boolean
    createdAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCollection"]>

  export type PaymentCollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    instanceName?: boolean
    splitCode?: boolean
    paymentTypeId?: boolean
    paymentType?: boolean
    payer?: boolean
    amount?: boolean
    quantity?: boolean
    idclAmount?: boolean
    motAmount?: boolean
    metadata?: boolean
    paystackReference?: boolean
    collectedAt?: boolean
    createdAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCollection"]>

  export type PaymentCollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    instanceName?: boolean
    splitCode?: boolean
    paymentTypeId?: boolean
    paymentType?: boolean
    payer?: boolean
    amount?: boolean
    quantity?: boolean
    idclAmount?: boolean
    motAmount?: boolean
    metadata?: boolean
    paystackReference?: boolean
    collectedAt?: boolean
    createdAt?: boolean
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentCollection"]>

  export type PaymentCollectionSelectScalar = {
    id?: boolean
    instanceId?: boolean
    instanceName?: boolean
    splitCode?: boolean
    paymentTypeId?: boolean
    paymentType?: boolean
    payer?: boolean
    amount?: boolean
    quantity?: boolean
    idclAmount?: boolean
    motAmount?: boolean
    metadata?: boolean
    paystackReference?: boolean
    collectedAt?: boolean
    createdAt?: boolean
  }

  export type PaymentCollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "instanceId" | "instanceName" | "splitCode" | "paymentTypeId" | "paymentType" | "payer" | "amount" | "quantity" | "idclAmount" | "motAmount" | "metadata" | "paystackReference" | "collectedAt" | "createdAt", ExtArgs["result"]["paymentCollection"]>
  export type PaymentCollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }
  export type PaymentCollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }
  export type PaymentCollectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instance?: boolean | PaymentInstanceDefaultArgs<ExtArgs>
  }

  export type $PaymentCollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentCollection"
    objects: {
      instance: Prisma.$PaymentInstancePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      instanceId: string
      instanceName: string
      splitCode: string
      paymentTypeId: string | null
      paymentType: string | null
      payer: string
      amount: number
      quantity: number
      idclAmount: number
      motAmount: number
      metadata: Prisma.JsonValue
      paystackReference: string | null
      collectedAt: string
      createdAt: Date
    }, ExtArgs["result"]["paymentCollection"]>
    composites: {}
  }

  type PaymentCollectionGetPayload<S extends boolean | null | undefined | PaymentCollectionDefaultArgs> = $Result.GetResult<Prisma.$PaymentCollectionPayload, S>

  type PaymentCollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentCollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCollectionCountAggregateInputType | true
    }

  export interface PaymentCollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentCollection'], meta: { name: 'PaymentCollection' } }
    /**
     * Find zero or one PaymentCollection that matches the filter.
     * @param {PaymentCollectionFindUniqueArgs} args - Arguments to find a PaymentCollection
     * @example
     * // Get one PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentCollectionFindUniqueArgs>(args: SelectSubset<T, PaymentCollectionFindUniqueArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentCollection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentCollectionFindUniqueOrThrowArgs} args - Arguments to find a PaymentCollection
     * @example
     * // Get one PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentCollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentCollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentCollection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionFindFirstArgs} args - Arguments to find a PaymentCollection
     * @example
     * // Get one PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentCollectionFindFirstArgs>(args?: SelectSubset<T, PaymentCollectionFindFirstArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentCollection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionFindFirstOrThrowArgs} args - Arguments to find a PaymentCollection
     * @example
     * // Get one PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentCollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentCollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentCollections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentCollections
     * const paymentCollections = await prisma.paymentCollection.findMany()
     * 
     * // Get first 10 PaymentCollections
     * const paymentCollections = await prisma.paymentCollection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentCollectionWithIdOnly = await prisma.paymentCollection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentCollectionFindManyArgs>(args?: SelectSubset<T, PaymentCollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentCollection.
     * @param {PaymentCollectionCreateArgs} args - Arguments to create a PaymentCollection.
     * @example
     * // Create one PaymentCollection
     * const PaymentCollection = await prisma.paymentCollection.create({
     *   data: {
     *     // ... data to create a PaymentCollection
     *   }
     * })
     * 
     */
    create<T extends PaymentCollectionCreateArgs>(args: SelectSubset<T, PaymentCollectionCreateArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentCollections.
     * @param {PaymentCollectionCreateManyArgs} args - Arguments to create many PaymentCollections.
     * @example
     * // Create many PaymentCollections
     * const paymentCollection = await prisma.paymentCollection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCollectionCreateManyArgs>(args?: SelectSubset<T, PaymentCollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentCollections and returns the data saved in the database.
     * @param {PaymentCollectionCreateManyAndReturnArgs} args - Arguments to create many PaymentCollections.
     * @example
     * // Create many PaymentCollections
     * const paymentCollection = await prisma.paymentCollection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentCollections and only return the `id`
     * const paymentCollectionWithIdOnly = await prisma.paymentCollection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaymentCollection.
     * @param {PaymentCollectionDeleteArgs} args - Arguments to delete one PaymentCollection.
     * @example
     * // Delete one PaymentCollection
     * const PaymentCollection = await prisma.paymentCollection.delete({
     *   where: {
     *     // ... filter to delete one PaymentCollection
     *   }
     * })
     * 
     */
    delete<T extends PaymentCollectionDeleteArgs>(args: SelectSubset<T, PaymentCollectionDeleteArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentCollection.
     * @param {PaymentCollectionUpdateArgs} args - Arguments to update one PaymentCollection.
     * @example
     * // Update one PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentCollectionUpdateArgs>(args: SelectSubset<T, PaymentCollectionUpdateArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentCollections.
     * @param {PaymentCollectionDeleteManyArgs} args - Arguments to filter PaymentCollections to delete.
     * @example
     * // Delete a few PaymentCollections
     * const { count } = await prisma.paymentCollection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentCollectionDeleteManyArgs>(args?: SelectSubset<T, PaymentCollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentCollections
     * const paymentCollection = await prisma.paymentCollection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentCollectionUpdateManyArgs>(args: SelectSubset<T, PaymentCollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentCollections and returns the data updated in the database.
     * @param {PaymentCollectionUpdateManyAndReturnArgs} args - Arguments to update many PaymentCollections.
     * @example
     * // Update many PaymentCollections
     * const paymentCollection = await prisma.paymentCollection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaymentCollections and only return the `id`
     * const paymentCollectionWithIdOnly = await prisma.paymentCollection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentCollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentCollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaymentCollection.
     * @param {PaymentCollectionUpsertArgs} args - Arguments to update or create a PaymentCollection.
     * @example
     * // Update or create a PaymentCollection
     * const paymentCollection = await prisma.paymentCollection.upsert({
     *   create: {
     *     // ... data to create a PaymentCollection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentCollection we want to update
     *   }
     * })
     */
    upsert<T extends PaymentCollectionUpsertArgs>(args: SelectSubset<T, PaymentCollectionUpsertArgs<ExtArgs>>): Prisma__PaymentCollectionClient<$Result.GetResult<Prisma.$PaymentCollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionCountArgs} args - Arguments to filter PaymentCollections to count.
     * @example
     * // Count the number of PaymentCollections
     * const count = await prisma.paymentCollection.count({
     *   where: {
     *     // ... the filter for the PaymentCollections we want to count
     *   }
     * })
    **/
    count<T extends PaymentCollectionCountArgs>(
      args?: Subset<T, PaymentCollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentCollectionAggregateArgs>(args: Subset<T, PaymentCollectionAggregateArgs>): Prisma.PrismaPromise<GetPaymentCollectionAggregateType<T>>

    /**
     * Group by PaymentCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCollectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentCollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentCollectionGroupByArgs['orderBy'] }
        : { orderBy?: PaymentCollectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentCollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentCollection model
   */
  readonly fields: PaymentCollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentCollection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentCollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    instance<T extends PaymentInstanceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentInstanceDefaultArgs<ExtArgs>>): Prisma__PaymentInstanceClient<$Result.GetResult<Prisma.$PaymentInstancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentCollection model
   */
  interface PaymentCollectionFieldRefs {
    readonly id: FieldRef<"PaymentCollection", 'String'>
    readonly instanceId: FieldRef<"PaymentCollection", 'String'>
    readonly instanceName: FieldRef<"PaymentCollection", 'String'>
    readonly splitCode: FieldRef<"PaymentCollection", 'String'>
    readonly paymentTypeId: FieldRef<"PaymentCollection", 'String'>
    readonly paymentType: FieldRef<"PaymentCollection", 'String'>
    readonly payer: FieldRef<"PaymentCollection", 'String'>
    readonly amount: FieldRef<"PaymentCollection", 'Float'>
    readonly quantity: FieldRef<"PaymentCollection", 'Int'>
    readonly idclAmount: FieldRef<"PaymentCollection", 'Float'>
    readonly motAmount: FieldRef<"PaymentCollection", 'Float'>
    readonly metadata: FieldRef<"PaymentCollection", 'Json'>
    readonly paystackReference: FieldRef<"PaymentCollection", 'String'>
    readonly collectedAt: FieldRef<"PaymentCollection", 'String'>
    readonly createdAt: FieldRef<"PaymentCollection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentCollection findUnique
   */
  export type PaymentCollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCollection to fetch.
     */
    where: PaymentCollectionWhereUniqueInput
  }

  /**
   * PaymentCollection findUniqueOrThrow
   */
  export type PaymentCollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCollection to fetch.
     */
    where: PaymentCollectionWhereUniqueInput
  }

  /**
   * PaymentCollection findFirst
   */
  export type PaymentCollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCollection to fetch.
     */
    where?: PaymentCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCollections to fetch.
     */
    orderBy?: PaymentCollectionOrderByWithRelationInput | PaymentCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentCollections.
     */
    cursor?: PaymentCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentCollections.
     */
    distinct?: PaymentCollectionScalarFieldEnum | PaymentCollectionScalarFieldEnum[]
  }

  /**
   * PaymentCollection findFirstOrThrow
   */
  export type PaymentCollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCollection to fetch.
     */
    where?: PaymentCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCollections to fetch.
     */
    orderBy?: PaymentCollectionOrderByWithRelationInput | PaymentCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentCollections.
     */
    cursor?: PaymentCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentCollections.
     */
    distinct?: PaymentCollectionScalarFieldEnum | PaymentCollectionScalarFieldEnum[]
  }

  /**
   * PaymentCollection findMany
   */
  export type PaymentCollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter, which PaymentCollections to fetch.
     */
    where?: PaymentCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentCollections to fetch.
     */
    orderBy?: PaymentCollectionOrderByWithRelationInput | PaymentCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentCollections.
     */
    cursor?: PaymentCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentCollections.
     */
    skip?: number
    distinct?: PaymentCollectionScalarFieldEnum | PaymentCollectionScalarFieldEnum[]
  }

  /**
   * PaymentCollection create
   */
  export type PaymentCollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentCollection.
     */
    data: XOR<PaymentCollectionCreateInput, PaymentCollectionUncheckedCreateInput>
  }

  /**
   * PaymentCollection createMany
   */
  export type PaymentCollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentCollections.
     */
    data: PaymentCollectionCreateManyInput | PaymentCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentCollection createManyAndReturn
   */
  export type PaymentCollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * The data used to create many PaymentCollections.
     */
    data: PaymentCollectionCreateManyInput | PaymentCollectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentCollection update
   */
  export type PaymentCollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentCollection.
     */
    data: XOR<PaymentCollectionUpdateInput, PaymentCollectionUncheckedUpdateInput>
    /**
     * Choose, which PaymentCollection to update.
     */
    where: PaymentCollectionWhereUniqueInput
  }

  /**
   * PaymentCollection updateMany
   */
  export type PaymentCollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentCollections.
     */
    data: XOR<PaymentCollectionUpdateManyMutationInput, PaymentCollectionUncheckedUpdateManyInput>
    /**
     * Filter which PaymentCollections to update
     */
    where?: PaymentCollectionWhereInput
    /**
     * Limit how many PaymentCollections to update.
     */
    limit?: number
  }

  /**
   * PaymentCollection updateManyAndReturn
   */
  export type PaymentCollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * The data used to update PaymentCollections.
     */
    data: XOR<PaymentCollectionUpdateManyMutationInput, PaymentCollectionUncheckedUpdateManyInput>
    /**
     * Filter which PaymentCollections to update
     */
    where?: PaymentCollectionWhereInput
    /**
     * Limit how many PaymentCollections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentCollection upsert
   */
  export type PaymentCollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentCollection to update in case it exists.
     */
    where: PaymentCollectionWhereUniqueInput
    /**
     * In case the PaymentCollection found by the `where` argument doesn't exist, create a new PaymentCollection with this data.
     */
    create: XOR<PaymentCollectionCreateInput, PaymentCollectionUncheckedCreateInput>
    /**
     * In case the PaymentCollection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentCollectionUpdateInput, PaymentCollectionUncheckedUpdateInput>
  }

  /**
   * PaymentCollection delete
   */
  export type PaymentCollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
    /**
     * Filter which PaymentCollection to delete.
     */
    where: PaymentCollectionWhereUniqueInput
  }

  /**
   * PaymentCollection deleteMany
   */
  export type PaymentCollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentCollections to delete
     */
    where?: PaymentCollectionWhereInput
    /**
     * Limit how many PaymentCollections to delete.
     */
    limit?: number
  }

  /**
   * PaymentCollection without action
   */
  export type PaymentCollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCollection
     */
    select?: PaymentCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentCollection
     */
    omit?: PaymentCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentCollectionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    plainPassword: 'plainPassword',
    role: 'role',
    instanceId: 'instanceId',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PaymentInstanceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    splitCode: 'splitCode',
    idclPercent: 'idclPercent',
    summary: 'summary',
    entities: 'entities',
    formFields: 'formFields',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentInstanceScalarFieldEnum = (typeof PaymentInstanceScalarFieldEnum)[keyof typeof PaymentInstanceScalarFieldEnum]


  export const PaymentTypeScalarFieldEnum: {
    id: 'id',
    instanceId: 'instanceId',
    name: 'name',
    description: 'description',
    amount: 'amount',
    splitCode: 'splitCode',
    splitEntities: 'splitEntities',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentTypeScalarFieldEnum = (typeof PaymentTypeScalarFieldEnum)[keyof typeof PaymentTypeScalarFieldEnum]


  export const PaymentCollectionScalarFieldEnum: {
    id: 'id',
    instanceId: 'instanceId',
    instanceName: 'instanceName',
    splitCode: 'splitCode',
    paymentTypeId: 'paymentTypeId',
    paymentType: 'paymentType',
    payer: 'payer',
    amount: 'amount',
    quantity: 'quantity',
    idclAmount: 'idclAmount',
    motAmount: 'motAmount',
    metadata: 'metadata',
    paystackReference: 'paystackReference',
    collectedAt: 'collectedAt',
    createdAt: 'createdAt'
  };

  export type PaymentCollectionScalarFieldEnum = (typeof PaymentCollectionScalarFieldEnum)[keyof typeof PaymentCollectionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    plainPassword?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    instanceId?: StringNullableFilter<"User"> | string | null
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    instance?: XOR<PaymentInstanceNullableScalarRelationFilter, PaymentInstanceWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    plainPassword?: SortOrderInput | SortOrder
    role?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    instance?: PaymentInstanceOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    instanceId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    plainPassword?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    instance?: XOR<PaymentInstanceNullableScalarRelationFilter, PaymentInstanceWhereInput> | null
  }, "id" | "email" | "instanceId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    plainPassword?: SortOrderInput | SortOrder
    role?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    plainPassword?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    instanceId?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PaymentInstanceWhereInput = {
    AND?: PaymentInstanceWhereInput | PaymentInstanceWhereInput[]
    OR?: PaymentInstanceWhereInput[]
    NOT?: PaymentInstanceWhereInput | PaymentInstanceWhereInput[]
    id?: StringFilter<"PaymentInstance"> | string
    name?: StringFilter<"PaymentInstance"> | string
    splitCode?: StringFilter<"PaymentInstance"> | string
    idclPercent?: FloatFilter<"PaymentInstance"> | number
    summary?: StringFilter<"PaymentInstance"> | string
    entities?: JsonFilter<"PaymentInstance">
    formFields?: JsonFilter<"PaymentInstance">
    createdAt?: DateTimeFilter<"PaymentInstance"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentInstance"> | Date | string
    collections?: PaymentCollectionListRelationFilter
    paymentTypes?: PaymentTypeListRelationFilter
    operator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PaymentInstanceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    splitCode?: SortOrder
    idclPercent?: SortOrder
    summary?: SortOrder
    entities?: SortOrder
    formFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    collections?: PaymentCollectionOrderByRelationAggregateInput
    paymentTypes?: PaymentTypeOrderByRelationAggregateInput
    operator?: UserOrderByWithRelationInput
  }

  export type PaymentInstanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    splitCode?: string
    AND?: PaymentInstanceWhereInput | PaymentInstanceWhereInput[]
    OR?: PaymentInstanceWhereInput[]
    NOT?: PaymentInstanceWhereInput | PaymentInstanceWhereInput[]
    name?: StringFilter<"PaymentInstance"> | string
    idclPercent?: FloatFilter<"PaymentInstance"> | number
    summary?: StringFilter<"PaymentInstance"> | string
    entities?: JsonFilter<"PaymentInstance">
    formFields?: JsonFilter<"PaymentInstance">
    createdAt?: DateTimeFilter<"PaymentInstance"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentInstance"> | Date | string
    collections?: PaymentCollectionListRelationFilter
    paymentTypes?: PaymentTypeListRelationFilter
    operator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "splitCode">

  export type PaymentInstanceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    splitCode?: SortOrder
    idclPercent?: SortOrder
    summary?: SortOrder
    entities?: SortOrder
    formFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentInstanceCountOrderByAggregateInput
    _avg?: PaymentInstanceAvgOrderByAggregateInput
    _max?: PaymentInstanceMaxOrderByAggregateInput
    _min?: PaymentInstanceMinOrderByAggregateInput
    _sum?: PaymentInstanceSumOrderByAggregateInput
  }

  export type PaymentInstanceScalarWhereWithAggregatesInput = {
    AND?: PaymentInstanceScalarWhereWithAggregatesInput | PaymentInstanceScalarWhereWithAggregatesInput[]
    OR?: PaymentInstanceScalarWhereWithAggregatesInput[]
    NOT?: PaymentInstanceScalarWhereWithAggregatesInput | PaymentInstanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentInstance"> | string
    name?: StringWithAggregatesFilter<"PaymentInstance"> | string
    splitCode?: StringWithAggregatesFilter<"PaymentInstance"> | string
    idclPercent?: FloatWithAggregatesFilter<"PaymentInstance"> | number
    summary?: StringWithAggregatesFilter<"PaymentInstance"> | string
    entities?: JsonWithAggregatesFilter<"PaymentInstance">
    formFields?: JsonWithAggregatesFilter<"PaymentInstance">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentInstance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentInstance"> | Date | string
  }

  export type PaymentTypeWhereInput = {
    AND?: PaymentTypeWhereInput | PaymentTypeWhereInput[]
    OR?: PaymentTypeWhereInput[]
    NOT?: PaymentTypeWhereInput | PaymentTypeWhereInput[]
    id?: StringFilter<"PaymentType"> | string
    instanceId?: StringFilter<"PaymentType"> | string
    name?: StringFilter<"PaymentType"> | string
    description?: StringNullableFilter<"PaymentType"> | string | null
    amount?: FloatFilter<"PaymentType"> | number
    splitCode?: StringNullableFilter<"PaymentType"> | string | null
    splitEntities?: JsonFilter<"PaymentType">
    createdAt?: DateTimeFilter<"PaymentType"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentType"> | Date | string
    instance?: XOR<PaymentInstanceScalarRelationFilter, PaymentInstanceWhereInput>
  }

  export type PaymentTypeOrderByWithRelationInput = {
    id?: SortOrder
    instanceId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    splitCode?: SortOrderInput | SortOrder
    splitEntities?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    instance?: PaymentInstanceOrderByWithRelationInput
  }

  export type PaymentTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentTypeWhereInput | PaymentTypeWhereInput[]
    OR?: PaymentTypeWhereInput[]
    NOT?: PaymentTypeWhereInput | PaymentTypeWhereInput[]
    instanceId?: StringFilter<"PaymentType"> | string
    name?: StringFilter<"PaymentType"> | string
    description?: StringNullableFilter<"PaymentType"> | string | null
    amount?: FloatFilter<"PaymentType"> | number
    splitCode?: StringNullableFilter<"PaymentType"> | string | null
    splitEntities?: JsonFilter<"PaymentType">
    createdAt?: DateTimeFilter<"PaymentType"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentType"> | Date | string
    instance?: XOR<PaymentInstanceScalarRelationFilter, PaymentInstanceWhereInput>
  }, "id">

  export type PaymentTypeOrderByWithAggregationInput = {
    id?: SortOrder
    instanceId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    splitCode?: SortOrderInput | SortOrder
    splitEntities?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentTypeCountOrderByAggregateInput
    _avg?: PaymentTypeAvgOrderByAggregateInput
    _max?: PaymentTypeMaxOrderByAggregateInput
    _min?: PaymentTypeMinOrderByAggregateInput
    _sum?: PaymentTypeSumOrderByAggregateInput
  }

  export type PaymentTypeScalarWhereWithAggregatesInput = {
    AND?: PaymentTypeScalarWhereWithAggregatesInput | PaymentTypeScalarWhereWithAggregatesInput[]
    OR?: PaymentTypeScalarWhereWithAggregatesInput[]
    NOT?: PaymentTypeScalarWhereWithAggregatesInput | PaymentTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentType"> | string
    instanceId?: StringWithAggregatesFilter<"PaymentType"> | string
    name?: StringWithAggregatesFilter<"PaymentType"> | string
    description?: StringNullableWithAggregatesFilter<"PaymentType"> | string | null
    amount?: FloatWithAggregatesFilter<"PaymentType"> | number
    splitCode?: StringNullableWithAggregatesFilter<"PaymentType"> | string | null
    splitEntities?: JsonWithAggregatesFilter<"PaymentType">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentType"> | Date | string
  }

  export type PaymentCollectionWhereInput = {
    AND?: PaymentCollectionWhereInput | PaymentCollectionWhereInput[]
    OR?: PaymentCollectionWhereInput[]
    NOT?: PaymentCollectionWhereInput | PaymentCollectionWhereInput[]
    id?: StringFilter<"PaymentCollection"> | string
    instanceId?: StringFilter<"PaymentCollection"> | string
    instanceName?: StringFilter<"PaymentCollection"> | string
    splitCode?: StringFilter<"PaymentCollection"> | string
    paymentTypeId?: StringNullableFilter<"PaymentCollection"> | string | null
    paymentType?: StringNullableFilter<"PaymentCollection"> | string | null
    payer?: StringFilter<"PaymentCollection"> | string
    amount?: FloatFilter<"PaymentCollection"> | number
    quantity?: IntFilter<"PaymentCollection"> | number
    idclAmount?: FloatFilter<"PaymentCollection"> | number
    motAmount?: FloatFilter<"PaymentCollection"> | number
    metadata?: JsonFilter<"PaymentCollection">
    paystackReference?: StringNullableFilter<"PaymentCollection"> | string | null
    collectedAt?: StringFilter<"PaymentCollection"> | string
    createdAt?: DateTimeFilter<"PaymentCollection"> | Date | string
    instance?: XOR<PaymentInstanceScalarRelationFilter, PaymentInstanceWhereInput>
  }

  export type PaymentCollectionOrderByWithRelationInput = {
    id?: SortOrder
    instanceId?: SortOrder
    instanceName?: SortOrder
    splitCode?: SortOrder
    paymentTypeId?: SortOrderInput | SortOrder
    paymentType?: SortOrderInput | SortOrder
    payer?: SortOrder
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
    metadata?: SortOrder
    paystackReference?: SortOrderInput | SortOrder
    collectedAt?: SortOrder
    createdAt?: SortOrder
    instance?: PaymentInstanceOrderByWithRelationInput
  }

  export type PaymentCollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    paystackReference?: string
    AND?: PaymentCollectionWhereInput | PaymentCollectionWhereInput[]
    OR?: PaymentCollectionWhereInput[]
    NOT?: PaymentCollectionWhereInput | PaymentCollectionWhereInput[]
    instanceId?: StringFilter<"PaymentCollection"> | string
    instanceName?: StringFilter<"PaymentCollection"> | string
    splitCode?: StringFilter<"PaymentCollection"> | string
    paymentTypeId?: StringNullableFilter<"PaymentCollection"> | string | null
    paymentType?: StringNullableFilter<"PaymentCollection"> | string | null
    payer?: StringFilter<"PaymentCollection"> | string
    amount?: FloatFilter<"PaymentCollection"> | number
    quantity?: IntFilter<"PaymentCollection"> | number
    idclAmount?: FloatFilter<"PaymentCollection"> | number
    motAmount?: FloatFilter<"PaymentCollection"> | number
    metadata?: JsonFilter<"PaymentCollection">
    collectedAt?: StringFilter<"PaymentCollection"> | string
    createdAt?: DateTimeFilter<"PaymentCollection"> | Date | string
    instance?: XOR<PaymentInstanceScalarRelationFilter, PaymentInstanceWhereInput>
  }, "id" | "paystackReference">

  export type PaymentCollectionOrderByWithAggregationInput = {
    id?: SortOrder
    instanceId?: SortOrder
    instanceName?: SortOrder
    splitCode?: SortOrder
    paymentTypeId?: SortOrderInput | SortOrder
    paymentType?: SortOrderInput | SortOrder
    payer?: SortOrder
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
    metadata?: SortOrder
    paystackReference?: SortOrderInput | SortOrder
    collectedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentCollectionCountOrderByAggregateInput
    _avg?: PaymentCollectionAvgOrderByAggregateInput
    _max?: PaymentCollectionMaxOrderByAggregateInput
    _min?: PaymentCollectionMinOrderByAggregateInput
    _sum?: PaymentCollectionSumOrderByAggregateInput
  }

  export type PaymentCollectionScalarWhereWithAggregatesInput = {
    AND?: PaymentCollectionScalarWhereWithAggregatesInput | PaymentCollectionScalarWhereWithAggregatesInput[]
    OR?: PaymentCollectionScalarWhereWithAggregatesInput[]
    NOT?: PaymentCollectionScalarWhereWithAggregatesInput | PaymentCollectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentCollection"> | string
    instanceId?: StringWithAggregatesFilter<"PaymentCollection"> | string
    instanceName?: StringWithAggregatesFilter<"PaymentCollection"> | string
    splitCode?: StringWithAggregatesFilter<"PaymentCollection"> | string
    paymentTypeId?: StringNullableWithAggregatesFilter<"PaymentCollection"> | string | null
    paymentType?: StringNullableWithAggregatesFilter<"PaymentCollection"> | string | null
    payer?: StringWithAggregatesFilter<"PaymentCollection"> | string
    amount?: FloatWithAggregatesFilter<"PaymentCollection"> | number
    quantity?: IntWithAggregatesFilter<"PaymentCollection"> | number
    idclAmount?: FloatWithAggregatesFilter<"PaymentCollection"> | number
    motAmount?: FloatWithAggregatesFilter<"PaymentCollection"> | number
    metadata?: JsonWithAggregatesFilter<"PaymentCollection">
    paystackReference?: StringNullableWithAggregatesFilter<"PaymentCollection"> | string | null
    collectedAt?: StringWithAggregatesFilter<"PaymentCollection"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PaymentCollection"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    plainPassword?: string | null
    role: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    instance?: PaymentInstanceCreateNestedOneWithoutOperatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    plainPassword?: string | null
    role: string
    instanceId?: string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    instance?: PaymentInstanceUpdateOneWithoutOperatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    plainPassword?: string | null
    role: string
    instanceId?: string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentInstanceCreateInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionCreateNestedManyWithoutInstanceInput
    paymentTypes?: PaymentTypeCreateNestedManyWithoutInstanceInput
    operator?: UserCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceUncheckedCreateInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionUncheckedCreateNestedManyWithoutInstanceInput
    paymentTypes?: PaymentTypeUncheckedCreateNestedManyWithoutInstanceInput
    operator?: UserUncheckedCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUpdateManyWithoutInstanceNestedInput
    paymentTypes?: PaymentTypeUpdateManyWithoutInstanceNestedInput
    operator?: UserUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentInstanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUncheckedUpdateManyWithoutInstanceNestedInput
    paymentTypes?: PaymentTypeUncheckedUpdateManyWithoutInstanceNestedInput
    operator?: UserUncheckedUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentInstanceCreateManyInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentInstanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentInstanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeCreateInput = {
    id?: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    instance: PaymentInstanceCreateNestedOneWithoutPaymentTypesInput
  }

  export type PaymentTypeUncheckedCreateInput = {
    id?: string
    instanceId: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    instance?: PaymentInstanceUpdateOneRequiredWithoutPaymentTypesNestedInput
  }

  export type PaymentTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeCreateManyInput = {
    id?: string
    instanceId: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCollectionCreateInput = {
    id?: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
    instance: PaymentInstanceCreateNestedOneWithoutCollectionsInput
  }

  export type PaymentCollectionUncheckedCreateInput = {
    id?: string
    instanceId: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
  }

  export type PaymentCollectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    instance?: PaymentInstanceUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type PaymentCollectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCollectionCreateManyInput = {
    id?: string
    instanceId: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
  }

  export type PaymentCollectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCollectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PaymentInstanceNullableScalarRelationFilter = {
    is?: PaymentInstanceWhereInput | null
    isNot?: PaymentInstanceWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    plainPassword?: SortOrder
    role?: SortOrder
    instanceId?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    plainPassword?: SortOrder
    role?: SortOrder
    instanceId?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    plainPassword?: SortOrder
    role?: SortOrder
    instanceId?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PaymentCollectionListRelationFilter = {
    every?: PaymentCollectionWhereInput
    some?: PaymentCollectionWhereInput
    none?: PaymentCollectionWhereInput
  }

  export type PaymentTypeListRelationFilter = {
    every?: PaymentTypeWhereInput
    some?: PaymentTypeWhereInput
    none?: PaymentTypeWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PaymentCollectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentTypeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentInstanceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    splitCode?: SortOrder
    idclPercent?: SortOrder
    summary?: SortOrder
    entities?: SortOrder
    formFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentInstanceAvgOrderByAggregateInput = {
    idclPercent?: SortOrder
  }

  export type PaymentInstanceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    splitCode?: SortOrder
    idclPercent?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentInstanceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    splitCode?: SortOrder
    idclPercent?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentInstanceSumOrderByAggregateInput = {
    idclPercent?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type PaymentInstanceScalarRelationFilter = {
    is?: PaymentInstanceWhereInput
    isNot?: PaymentInstanceWhereInput
  }

  export type PaymentTypeCountOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    splitCode?: SortOrder
    splitEntities?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentTypeAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    splitCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentTypeMinOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    splitCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentTypeSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PaymentCollectionCountOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    instanceName?: SortOrder
    splitCode?: SortOrder
    paymentTypeId?: SortOrder
    paymentType?: SortOrder
    payer?: SortOrder
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
    metadata?: SortOrder
    paystackReference?: SortOrder
    collectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentCollectionAvgOrderByAggregateInput = {
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
  }

  export type PaymentCollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    instanceName?: SortOrder
    splitCode?: SortOrder
    paymentTypeId?: SortOrder
    paymentType?: SortOrder
    payer?: SortOrder
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
    paystackReference?: SortOrder
    collectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentCollectionMinOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    instanceName?: SortOrder
    splitCode?: SortOrder
    paymentTypeId?: SortOrder
    paymentType?: SortOrder
    payer?: SortOrder
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
    paystackReference?: SortOrder
    collectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentCollectionSumOrderByAggregateInput = {
    amount?: SortOrder
    quantity?: SortOrder
    idclAmount?: SortOrder
    motAmount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PaymentInstanceCreateNestedOneWithoutOperatorInput = {
    create?: XOR<PaymentInstanceCreateWithoutOperatorInput, PaymentInstanceUncheckedCreateWithoutOperatorInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutOperatorInput
    connect?: PaymentInstanceWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentInstanceUpdateOneWithoutOperatorNestedInput = {
    create?: XOR<PaymentInstanceCreateWithoutOperatorInput, PaymentInstanceUncheckedCreateWithoutOperatorInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutOperatorInput
    upsert?: PaymentInstanceUpsertWithoutOperatorInput
    disconnect?: PaymentInstanceWhereInput | boolean
    delete?: PaymentInstanceWhereInput | boolean
    connect?: PaymentInstanceWhereUniqueInput
    update?: XOR<XOR<PaymentInstanceUpdateToOneWithWhereWithoutOperatorInput, PaymentInstanceUpdateWithoutOperatorInput>, PaymentInstanceUncheckedUpdateWithoutOperatorInput>
  }

  export type PaymentCollectionCreateNestedManyWithoutInstanceInput = {
    create?: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput> | PaymentCollectionCreateWithoutInstanceInput[] | PaymentCollectionUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentCollectionCreateOrConnectWithoutInstanceInput | PaymentCollectionCreateOrConnectWithoutInstanceInput[]
    createMany?: PaymentCollectionCreateManyInstanceInputEnvelope
    connect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
  }

  export type PaymentTypeCreateNestedManyWithoutInstanceInput = {
    create?: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput> | PaymentTypeCreateWithoutInstanceInput[] | PaymentTypeUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentTypeCreateOrConnectWithoutInstanceInput | PaymentTypeCreateOrConnectWithoutInstanceInput[]
    createMany?: PaymentTypeCreateManyInstanceInputEnvelope
    connect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutInstanceInput = {
    create?: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutInstanceInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCollectionUncheckedCreateNestedManyWithoutInstanceInput = {
    create?: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput> | PaymentCollectionCreateWithoutInstanceInput[] | PaymentCollectionUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentCollectionCreateOrConnectWithoutInstanceInput | PaymentCollectionCreateOrConnectWithoutInstanceInput[]
    createMany?: PaymentCollectionCreateManyInstanceInputEnvelope
    connect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
  }

  export type PaymentTypeUncheckedCreateNestedManyWithoutInstanceInput = {
    create?: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput> | PaymentTypeCreateWithoutInstanceInput[] | PaymentTypeUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentTypeCreateOrConnectWithoutInstanceInput | PaymentTypeCreateOrConnectWithoutInstanceInput[]
    createMany?: PaymentTypeCreateManyInstanceInputEnvelope
    connect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedOneWithoutInstanceInput = {
    create?: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutInstanceInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PaymentCollectionUpdateManyWithoutInstanceNestedInput = {
    create?: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput> | PaymentCollectionCreateWithoutInstanceInput[] | PaymentCollectionUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentCollectionCreateOrConnectWithoutInstanceInput | PaymentCollectionCreateOrConnectWithoutInstanceInput[]
    upsert?: PaymentCollectionUpsertWithWhereUniqueWithoutInstanceInput | PaymentCollectionUpsertWithWhereUniqueWithoutInstanceInput[]
    createMany?: PaymentCollectionCreateManyInstanceInputEnvelope
    set?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    disconnect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    delete?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    connect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    update?: PaymentCollectionUpdateWithWhereUniqueWithoutInstanceInput | PaymentCollectionUpdateWithWhereUniqueWithoutInstanceInput[]
    updateMany?: PaymentCollectionUpdateManyWithWhereWithoutInstanceInput | PaymentCollectionUpdateManyWithWhereWithoutInstanceInput[]
    deleteMany?: PaymentCollectionScalarWhereInput | PaymentCollectionScalarWhereInput[]
  }

  export type PaymentTypeUpdateManyWithoutInstanceNestedInput = {
    create?: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput> | PaymentTypeCreateWithoutInstanceInput[] | PaymentTypeUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentTypeCreateOrConnectWithoutInstanceInput | PaymentTypeCreateOrConnectWithoutInstanceInput[]
    upsert?: PaymentTypeUpsertWithWhereUniqueWithoutInstanceInput | PaymentTypeUpsertWithWhereUniqueWithoutInstanceInput[]
    createMany?: PaymentTypeCreateManyInstanceInputEnvelope
    set?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    disconnect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    delete?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    connect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    update?: PaymentTypeUpdateWithWhereUniqueWithoutInstanceInput | PaymentTypeUpdateWithWhereUniqueWithoutInstanceInput[]
    updateMany?: PaymentTypeUpdateManyWithWhereWithoutInstanceInput | PaymentTypeUpdateManyWithWhereWithoutInstanceInput[]
    deleteMany?: PaymentTypeScalarWhereInput | PaymentTypeScalarWhereInput[]
  }

  export type UserUpdateOneWithoutInstanceNestedInput = {
    create?: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutInstanceInput
    upsert?: UserUpsertWithoutInstanceInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInstanceInput, UserUpdateWithoutInstanceInput>, UserUncheckedUpdateWithoutInstanceInput>
  }

  export type PaymentCollectionUncheckedUpdateManyWithoutInstanceNestedInput = {
    create?: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput> | PaymentCollectionCreateWithoutInstanceInput[] | PaymentCollectionUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentCollectionCreateOrConnectWithoutInstanceInput | PaymentCollectionCreateOrConnectWithoutInstanceInput[]
    upsert?: PaymentCollectionUpsertWithWhereUniqueWithoutInstanceInput | PaymentCollectionUpsertWithWhereUniqueWithoutInstanceInput[]
    createMany?: PaymentCollectionCreateManyInstanceInputEnvelope
    set?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    disconnect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    delete?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    connect?: PaymentCollectionWhereUniqueInput | PaymentCollectionWhereUniqueInput[]
    update?: PaymentCollectionUpdateWithWhereUniqueWithoutInstanceInput | PaymentCollectionUpdateWithWhereUniqueWithoutInstanceInput[]
    updateMany?: PaymentCollectionUpdateManyWithWhereWithoutInstanceInput | PaymentCollectionUpdateManyWithWhereWithoutInstanceInput[]
    deleteMany?: PaymentCollectionScalarWhereInput | PaymentCollectionScalarWhereInput[]
  }

  export type PaymentTypeUncheckedUpdateManyWithoutInstanceNestedInput = {
    create?: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput> | PaymentTypeCreateWithoutInstanceInput[] | PaymentTypeUncheckedCreateWithoutInstanceInput[]
    connectOrCreate?: PaymentTypeCreateOrConnectWithoutInstanceInput | PaymentTypeCreateOrConnectWithoutInstanceInput[]
    upsert?: PaymentTypeUpsertWithWhereUniqueWithoutInstanceInput | PaymentTypeUpsertWithWhereUniqueWithoutInstanceInput[]
    createMany?: PaymentTypeCreateManyInstanceInputEnvelope
    set?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    disconnect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    delete?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    connect?: PaymentTypeWhereUniqueInput | PaymentTypeWhereUniqueInput[]
    update?: PaymentTypeUpdateWithWhereUniqueWithoutInstanceInput | PaymentTypeUpdateWithWhereUniqueWithoutInstanceInput[]
    updateMany?: PaymentTypeUpdateManyWithWhereWithoutInstanceInput | PaymentTypeUpdateManyWithWhereWithoutInstanceInput[]
    deleteMany?: PaymentTypeScalarWhereInput | PaymentTypeScalarWhereInput[]
  }

  export type UserUncheckedUpdateOneWithoutInstanceNestedInput = {
    create?: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
    connectOrCreate?: UserCreateOrConnectWithoutInstanceInput
    upsert?: UserUpsertWithoutInstanceInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInstanceInput, UserUpdateWithoutInstanceInput>, UserUncheckedUpdateWithoutInstanceInput>
  }

  export type PaymentInstanceCreateNestedOneWithoutPaymentTypesInput = {
    create?: XOR<PaymentInstanceCreateWithoutPaymentTypesInput, PaymentInstanceUncheckedCreateWithoutPaymentTypesInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutPaymentTypesInput
    connect?: PaymentInstanceWhereUniqueInput
  }

  export type PaymentInstanceUpdateOneRequiredWithoutPaymentTypesNestedInput = {
    create?: XOR<PaymentInstanceCreateWithoutPaymentTypesInput, PaymentInstanceUncheckedCreateWithoutPaymentTypesInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutPaymentTypesInput
    upsert?: PaymentInstanceUpsertWithoutPaymentTypesInput
    connect?: PaymentInstanceWhereUniqueInput
    update?: XOR<XOR<PaymentInstanceUpdateToOneWithWhereWithoutPaymentTypesInput, PaymentInstanceUpdateWithoutPaymentTypesInput>, PaymentInstanceUncheckedUpdateWithoutPaymentTypesInput>
  }

  export type PaymentInstanceCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<PaymentInstanceCreateWithoutCollectionsInput, PaymentInstanceUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutCollectionsInput
    connect?: PaymentInstanceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PaymentInstanceUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<PaymentInstanceCreateWithoutCollectionsInput, PaymentInstanceUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: PaymentInstanceCreateOrConnectWithoutCollectionsInput
    upsert?: PaymentInstanceUpsertWithoutCollectionsInput
    connect?: PaymentInstanceWhereUniqueInput
    update?: XOR<XOR<PaymentInstanceUpdateToOneWithWhereWithoutCollectionsInput, PaymentInstanceUpdateWithoutCollectionsInput>, PaymentInstanceUncheckedUpdateWithoutCollectionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PaymentInstanceCreateWithoutOperatorInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionCreateNestedManyWithoutInstanceInput
    paymentTypes?: PaymentTypeCreateNestedManyWithoutInstanceInput
  }

  export type PaymentInstanceUncheckedCreateWithoutOperatorInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionUncheckedCreateNestedManyWithoutInstanceInput
    paymentTypes?: PaymentTypeUncheckedCreateNestedManyWithoutInstanceInput
  }

  export type PaymentInstanceCreateOrConnectWithoutOperatorInput = {
    where: PaymentInstanceWhereUniqueInput
    create: XOR<PaymentInstanceCreateWithoutOperatorInput, PaymentInstanceUncheckedCreateWithoutOperatorInput>
  }

  export type PaymentInstanceUpsertWithoutOperatorInput = {
    update: XOR<PaymentInstanceUpdateWithoutOperatorInput, PaymentInstanceUncheckedUpdateWithoutOperatorInput>
    create: XOR<PaymentInstanceCreateWithoutOperatorInput, PaymentInstanceUncheckedCreateWithoutOperatorInput>
    where?: PaymentInstanceWhereInput
  }

  export type PaymentInstanceUpdateToOneWithWhereWithoutOperatorInput = {
    where?: PaymentInstanceWhereInput
    data: XOR<PaymentInstanceUpdateWithoutOperatorInput, PaymentInstanceUncheckedUpdateWithoutOperatorInput>
  }

  export type PaymentInstanceUpdateWithoutOperatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUpdateManyWithoutInstanceNestedInput
    paymentTypes?: PaymentTypeUpdateManyWithoutInstanceNestedInput
  }

  export type PaymentInstanceUncheckedUpdateWithoutOperatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUncheckedUpdateManyWithoutInstanceNestedInput
    paymentTypes?: PaymentTypeUncheckedUpdateManyWithoutInstanceNestedInput
  }

  export type PaymentCollectionCreateWithoutInstanceInput = {
    id?: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
  }

  export type PaymentCollectionUncheckedCreateWithoutInstanceInput = {
    id?: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
  }

  export type PaymentCollectionCreateOrConnectWithoutInstanceInput = {
    where: PaymentCollectionWhereUniqueInput
    create: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput>
  }

  export type PaymentCollectionCreateManyInstanceInputEnvelope = {
    data: PaymentCollectionCreateManyInstanceInput | PaymentCollectionCreateManyInstanceInput[]
    skipDuplicates?: boolean
  }

  export type PaymentTypeCreateWithoutInstanceInput = {
    id?: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentTypeUncheckedCreateWithoutInstanceInput = {
    id?: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentTypeCreateOrConnectWithoutInstanceInput = {
    where: PaymentTypeWhereUniqueInput
    create: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput>
  }

  export type PaymentTypeCreateManyInstanceInputEnvelope = {
    data: PaymentTypeCreateManyInstanceInput | PaymentTypeCreateManyInstanceInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutInstanceInput = {
    id?: string
    email: string
    password: string
    plainPassword?: string | null
    role: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutInstanceInput = {
    id?: string
    email: string
    password: string
    plainPassword?: string | null
    role: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutInstanceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
  }

  export type PaymentCollectionUpsertWithWhereUniqueWithoutInstanceInput = {
    where: PaymentCollectionWhereUniqueInput
    update: XOR<PaymentCollectionUpdateWithoutInstanceInput, PaymentCollectionUncheckedUpdateWithoutInstanceInput>
    create: XOR<PaymentCollectionCreateWithoutInstanceInput, PaymentCollectionUncheckedCreateWithoutInstanceInput>
  }

  export type PaymentCollectionUpdateWithWhereUniqueWithoutInstanceInput = {
    where: PaymentCollectionWhereUniqueInput
    data: XOR<PaymentCollectionUpdateWithoutInstanceInput, PaymentCollectionUncheckedUpdateWithoutInstanceInput>
  }

  export type PaymentCollectionUpdateManyWithWhereWithoutInstanceInput = {
    where: PaymentCollectionScalarWhereInput
    data: XOR<PaymentCollectionUpdateManyMutationInput, PaymentCollectionUncheckedUpdateManyWithoutInstanceInput>
  }

  export type PaymentCollectionScalarWhereInput = {
    AND?: PaymentCollectionScalarWhereInput | PaymentCollectionScalarWhereInput[]
    OR?: PaymentCollectionScalarWhereInput[]
    NOT?: PaymentCollectionScalarWhereInput | PaymentCollectionScalarWhereInput[]
    id?: StringFilter<"PaymentCollection"> | string
    instanceId?: StringFilter<"PaymentCollection"> | string
    instanceName?: StringFilter<"PaymentCollection"> | string
    splitCode?: StringFilter<"PaymentCollection"> | string
    paymentTypeId?: StringNullableFilter<"PaymentCollection"> | string | null
    paymentType?: StringNullableFilter<"PaymentCollection"> | string | null
    payer?: StringFilter<"PaymentCollection"> | string
    amount?: FloatFilter<"PaymentCollection"> | number
    quantity?: IntFilter<"PaymentCollection"> | number
    idclAmount?: FloatFilter<"PaymentCollection"> | number
    motAmount?: FloatFilter<"PaymentCollection"> | number
    metadata?: JsonFilter<"PaymentCollection">
    paystackReference?: StringNullableFilter<"PaymentCollection"> | string | null
    collectedAt?: StringFilter<"PaymentCollection"> | string
    createdAt?: DateTimeFilter<"PaymentCollection"> | Date | string
  }

  export type PaymentTypeUpsertWithWhereUniqueWithoutInstanceInput = {
    where: PaymentTypeWhereUniqueInput
    update: XOR<PaymentTypeUpdateWithoutInstanceInput, PaymentTypeUncheckedUpdateWithoutInstanceInput>
    create: XOR<PaymentTypeCreateWithoutInstanceInput, PaymentTypeUncheckedCreateWithoutInstanceInput>
  }

  export type PaymentTypeUpdateWithWhereUniqueWithoutInstanceInput = {
    where: PaymentTypeWhereUniqueInput
    data: XOR<PaymentTypeUpdateWithoutInstanceInput, PaymentTypeUncheckedUpdateWithoutInstanceInput>
  }

  export type PaymentTypeUpdateManyWithWhereWithoutInstanceInput = {
    where: PaymentTypeScalarWhereInput
    data: XOR<PaymentTypeUpdateManyMutationInput, PaymentTypeUncheckedUpdateManyWithoutInstanceInput>
  }

  export type PaymentTypeScalarWhereInput = {
    AND?: PaymentTypeScalarWhereInput | PaymentTypeScalarWhereInput[]
    OR?: PaymentTypeScalarWhereInput[]
    NOT?: PaymentTypeScalarWhereInput | PaymentTypeScalarWhereInput[]
    id?: StringFilter<"PaymentType"> | string
    instanceId?: StringFilter<"PaymentType"> | string
    name?: StringFilter<"PaymentType"> | string
    description?: StringNullableFilter<"PaymentType"> | string | null
    amount?: FloatFilter<"PaymentType"> | number
    splitCode?: StringNullableFilter<"PaymentType"> | string | null
    splitEntities?: JsonFilter<"PaymentType">
    createdAt?: DateTimeFilter<"PaymentType"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentType"> | Date | string
  }

  export type UserUpsertWithoutInstanceInput = {
    update: XOR<UserUpdateWithoutInstanceInput, UserUncheckedUpdateWithoutInstanceInput>
    create: XOR<UserCreateWithoutInstanceInput, UserUncheckedCreateWithoutInstanceInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInstanceInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInstanceInput, UserUncheckedUpdateWithoutInstanceInput>
  }

  export type UserUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    plainPassword?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentInstanceCreateWithoutPaymentTypesInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionCreateNestedManyWithoutInstanceInput
    operator?: UserCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceUncheckedCreateWithoutPaymentTypesInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: PaymentCollectionUncheckedCreateNestedManyWithoutInstanceInput
    operator?: UserUncheckedCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceCreateOrConnectWithoutPaymentTypesInput = {
    where: PaymentInstanceWhereUniqueInput
    create: XOR<PaymentInstanceCreateWithoutPaymentTypesInput, PaymentInstanceUncheckedCreateWithoutPaymentTypesInput>
  }

  export type PaymentInstanceUpsertWithoutPaymentTypesInput = {
    update: XOR<PaymentInstanceUpdateWithoutPaymentTypesInput, PaymentInstanceUncheckedUpdateWithoutPaymentTypesInput>
    create: XOR<PaymentInstanceCreateWithoutPaymentTypesInput, PaymentInstanceUncheckedCreateWithoutPaymentTypesInput>
    where?: PaymentInstanceWhereInput
  }

  export type PaymentInstanceUpdateToOneWithWhereWithoutPaymentTypesInput = {
    where?: PaymentInstanceWhereInput
    data: XOR<PaymentInstanceUpdateWithoutPaymentTypesInput, PaymentInstanceUncheckedUpdateWithoutPaymentTypesInput>
  }

  export type PaymentInstanceUpdateWithoutPaymentTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUpdateManyWithoutInstanceNestedInput
    operator?: UserUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentInstanceUncheckedUpdateWithoutPaymentTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: PaymentCollectionUncheckedUpdateManyWithoutInstanceNestedInput
    operator?: UserUncheckedUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentInstanceCreateWithoutCollectionsInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paymentTypes?: PaymentTypeCreateNestedManyWithoutInstanceInput
    operator?: UserCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceUncheckedCreateWithoutCollectionsInput = {
    id?: string
    name: string
    splitCode: string
    idclPercent: number
    summary: string
    entities: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paymentTypes?: PaymentTypeUncheckedCreateNestedManyWithoutInstanceInput
    operator?: UserUncheckedCreateNestedOneWithoutInstanceInput
  }

  export type PaymentInstanceCreateOrConnectWithoutCollectionsInput = {
    where: PaymentInstanceWhereUniqueInput
    create: XOR<PaymentInstanceCreateWithoutCollectionsInput, PaymentInstanceUncheckedCreateWithoutCollectionsInput>
  }

  export type PaymentInstanceUpsertWithoutCollectionsInput = {
    update: XOR<PaymentInstanceUpdateWithoutCollectionsInput, PaymentInstanceUncheckedUpdateWithoutCollectionsInput>
    create: XOR<PaymentInstanceCreateWithoutCollectionsInput, PaymentInstanceUncheckedCreateWithoutCollectionsInput>
    where?: PaymentInstanceWhereInput
  }

  export type PaymentInstanceUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: PaymentInstanceWhereInput
    data: XOR<PaymentInstanceUpdateWithoutCollectionsInput, PaymentInstanceUncheckedUpdateWithoutCollectionsInput>
  }

  export type PaymentInstanceUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentTypes?: PaymentTypeUpdateManyWithoutInstanceNestedInput
    operator?: UserUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentInstanceUncheckedUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    idclPercent?: FloatFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    entities?: JsonNullValueInput | InputJsonValue
    formFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentTypes?: PaymentTypeUncheckedUpdateManyWithoutInstanceNestedInput
    operator?: UserUncheckedUpdateOneWithoutInstanceNestedInput
  }

  export type PaymentCollectionCreateManyInstanceInput = {
    id?: string
    instanceName: string
    splitCode: string
    paymentTypeId?: string | null
    paymentType?: string | null
    payer: string
    amount: number
    quantity?: number
    idclAmount: number
    motAmount: number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: string | null
    collectedAt: string
    createdAt?: Date | string
  }

  export type PaymentTypeCreateManyInstanceInput = {
    id?: string
    name: string
    description?: string | null
    amount: number
    splitCode?: string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCollectionUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCollectionUncheckedUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCollectionUncheckedUpdateManyWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceName?: StringFieldUpdateOperationsInput | string
    splitCode?: StringFieldUpdateOperationsInput | string
    paymentTypeId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    payer?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    idclAmount?: FloatFieldUpdateOperationsInput | number
    motAmount?: FloatFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    paystackReference?: NullableStringFieldUpdateOperationsInput | string | null
    collectedAt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeUncheckedUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentTypeUncheckedUpdateManyWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    splitCode?: NullableStringFieldUpdateOperationsInput | string | null
    splitEntities?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}