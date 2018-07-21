import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { graphqlRestify, graphiqlRestify } from 'apollo-server-restify';
import { QueryType, MutationType } from './graph/todo.graph';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const server = restify.createServer({ name: 'Apollo Server' });
const graphQLOptions = {
  schema: new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
  })
};
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.post('/graphql', graphqlRestify(graphQLOptions));
server.get('/graphql', graphqlRestify(graphQLOptions));
server.get('/graphiql', graphiqlRestify({ endpointURL: '/graphql' }));
 
server.listen(3000, () => console.log(`Listening on 3000`));