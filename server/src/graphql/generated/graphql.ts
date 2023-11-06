import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type Address = {
  __typename?: 'Address'
  city: Scalars['String']['output']
  line1: Scalars['String']['output']
  line2?: Maybe<Scalars['String']['output']>
  state: Scalars['String']['output']
  zip: Scalars['String']['output']
}

export type AddressInput = {
  city: Scalars['String']['input']
  line1: Scalars['String']['input']
  line2?: InputMaybe<Scalars['String']['input']>
  state: Scalars['String']['input']
  zip: Scalars['String']['input']
}

export type Jwt = {
  __typename?: 'JWT'
  accessToken?: Maybe<Scalars['String']['output']>
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  createUser?: Maybe<User>
  login?: Maybe<Jwt>
  updateUser?: Maybe<User>
}

export type MutationCreateUserArgs = {
  userInput: UserInput
}

export type MutationLoginArgs = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type MutationUpdateUserArgs = {
  id: Scalars['String']['input']
  userInput: UserInput
}

export type Name = {
  __typename?: 'Name'
  first: Scalars['String']['output']
  last: Scalars['String']['output']
  middle?: Maybe<Scalars['String']['output']>
}

export type NameInput = {
  first: Scalars['String']['input']
  last: Scalars['String']['input']
  middle?: InputMaybe<Scalars['String']['input']>
}

export type Phone = {
  __typename?: 'Phone'
  digits: Scalars['String']['output']
  type: PhoneType
}

export type PhoneInput = {
  digits: Scalars['String']['input']
  type: PhoneType
}

export enum PhoneType {
  Home = 'home',
  Mobile = 'mobile',
  None = 'none',
  Work = 'work',
}

export type Query = {
  __typename?: 'Query'
  me?: Maybe<User>
  user?: Maybe<User>
  users?: Maybe<Users>
}

export type QueryUserArgs = {
  id: Scalars['String']['input']
}

export type QueryUsersArgs = {
  filter?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  sortKey?: InputMaybe<Scalars['String']['input']>
}

export enum Role {
  Cashier = 'cashier',
  Clerk = 'clerk',
  Manager = 'manager',
  None = 'none',
}

export type User = {
  __typename?: 'User'
  address?: Maybe<Address>
  dateOfBirth?: Maybe<Scalars['String']['output']>
  email: Scalars['String']['output']
  fullName?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  level?: Maybe<Scalars['Float']['output']>
  name: Name
  phones?: Maybe<Array<Maybe<Phone>>>
  picture?: Maybe<Scalars['String']['output']>
  role: Role
  userStatus: Scalars['Boolean']['output']
}

export type UserInput = {
  address?: InputMaybe<AddressInput>
  dateOfBirth?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  level?: InputMaybe<Scalars['Float']['input']>
  name: NameInput
  phones?: InputMaybe<Array<InputMaybe<PhoneInput>>>
  picture?: InputMaybe<Scalars['String']['input']>
  role: Role
  userStatus: Scalars['Boolean']['input']
}

export type Users = {
  __typename?: 'Users'
  data: Array<User>
  total: Scalars['Int']['output']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>
  AddressInput: AddressInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JWT: ResolverTypeWrapper<Jwt>
  LoginInput: LoginInput
  Mutation: ResolverTypeWrapper<{}>
  Name: ResolverTypeWrapper<Name>
  NameInput: NameInput
  Phone: ResolverTypeWrapper<Phone>
  PhoneInput: PhoneInput
  PhoneType: PhoneType
  Query: ResolverTypeWrapper<{}>
  Role: Role
  String: ResolverTypeWrapper<Scalars['String']['output']>
  User: ResolverTypeWrapper<User>
  UserInput: UserInput
  Users: ResolverTypeWrapper<Users>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address
  AddressInput: AddressInput
  Boolean: Scalars['Boolean']['output']
  Float: Scalars['Float']['output']
  Int: Scalars['Int']['output']
  JWT: Jwt
  LoginInput: LoginInput
  Mutation: {}
  Name: Name
  NameInput: NameInput
  Phone: Phone
  PhoneInput: PhoneInput
  Query: {}
  String: Scalars['String']['output']
  User: User
  UserInput: UserInput
  Users: Users
}

export type AddressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address'],
> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  line1?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  zip?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type JwtResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['JWT'] = ResolversParentTypes['JWT'],
> = {
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'userInput'>
  >
  login?: Resolver<
    Maybe<ResolversTypes['JWT']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'email' | 'password'>
  >
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'id' | 'userInput'>
  >
}

export type NameResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Name'] = ResolversParentTypes['Name'],
> = {
  first?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  last?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  middle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PhoneResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Phone'] = ResolversParentTypes['Phone'],
> = {
  digits?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['PhoneType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'id'>
  >
  users?: Resolver<
    Maybe<ResolversTypes['Users']>,
    ParentType,
    ContextType,
    RequireFields<QueryUsersArgs, 'limit' | 'skip' | 'sortKey'>
  >
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>
  dateOfBirth?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  level?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['Name'], ParentType, ContextType>
  phones?: Resolver<Maybe<Array<Maybe<ResolversTypes['Phone']>>>, ParentType, ContextType>
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>
  userStatus?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UsersResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Users'] = ResolversParentTypes['Users'],
> = {
  data?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>
  JWT?: JwtResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Name?: NameResolvers<ContextType>
  Phone?: PhoneResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  User?: UserResolvers<ContextType>
  Users?: UsersResolvers<ContextType>
}
