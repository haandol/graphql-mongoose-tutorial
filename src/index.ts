import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as mongoose from 'mongoose';
import { schema, resolvers } from './graph';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

app.listen(3000, () => console.log(`Listening on 3000`));