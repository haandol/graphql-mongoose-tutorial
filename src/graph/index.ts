const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
import { buildSchema } from 'graphql';
import * as todoGraph from './todo.graph';
import * as userGraph from './user.graph';

export const schema = buildSchema(mergeTypes([
  todoGraph.typeDefs,
  userGraph.typeDefs,
]));

export const resolvers = mergeResolvers([
  todoGraph.resolvers,
  userGraph.resolvers,
]);