import * as restify from 'restify';
import * as mongoose from 'mongoose';
import {
  GraphQLSchema, GraphQLID, GraphQLString,
  GraphQLBoolean, GraphQLObjectType, GraphQLList, valueFromAST, Source
} from 'graphql';
import { graphqlRestify, graphiqlRestify } from 'apollo-server-restify';


mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const mongooseSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
}, {collection: 'todo'});
mongooseSchema.set('toObject', {transform: (doc: any, ret: any, _: any) => {
  ret.id = doc._id.toString();
}});
const TodoModel = mongoose.model('Todo', mongooseSchema);

const TodoType = new GraphQLObjectType({  
  name: 'todo',
  fields: function () {
    return {
      id: {
        type: GraphQLID
      },
      content: {
        type: GraphQLString
      },
      completed: {
        type: GraphQLBoolean
      }
    }
  }
});

const QueryType = new GraphQLObjectType({  
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => TodoModel.find().exec().then(todos => todos.map((todo) => todo.toObject()))
    }
  }),
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodo: {
      type: TodoType,
      args: {
        content: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { content } = args;
        return await TodoModel.create({ content: content, completed: false });
      }
    },
    completeTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id } = args;
        const doc: any = await TodoModel.findById(new mongoose.Types.ObjectId(id)).exec();
        return await TodoModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { completed: !doc.completed });
      }
    }
  }) 
});
 
const server = restify.createServer({ name: 'Apollo Server' });
const graphQLOptions = {
  schema: new GraphQLSchema({ query: QueryType, mutation: MutationType })
};
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.post('/graphql', graphqlRestify(graphQLOptions));
server.get('/graphql', graphqlRestify(graphQLOptions));
server.get('/graphiql', graphiqlRestify({ endpointURL: '/graphql' }));
 
server.listen(3000, () => console.log(`Listening on 3000`));