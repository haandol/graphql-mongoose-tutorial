import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as mongoose from 'mongoose';
import { schema, resolvers } from './graph';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const app = express();
app.use((req: express.Request | any, res: express.Response, next: express.NextFunction) => {
  req['user'] = req.headers['authorization'];
  next();
});
app.use('/graphql', graphqlHTTP((req: express.Request | any, res, params) => {
  return {
    schema,
    rootValue: resolvers,
    context: { authorization: req['user'] },
    graphiql: true
  }
}));

app.listen(3000, () => console.log(`Listening on 3000`));