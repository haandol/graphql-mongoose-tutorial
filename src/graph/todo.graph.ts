import * as mongoose from 'mongoose';
import { TodoModel } from '../model/todo.model';

export const typeDefs = `
  type Todo {
    id: String
    content: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]
    todo(id: String!): Todo
  }

  type Mutation {
    addTodo(content: String!): Todo
    completeTodo(id: String!): Boolean
  }
`;

export const resolvers = {
  todos: async (args: any, context: any, info: any) => {
    console.log(context);
    const docs = await TodoModel.find({}).exec();
    return docs.map(doc => doc.toObject())
  },
  todo: async (args: any, context: any, info: any) => {
    console.log(context);
    const doc = await TodoModel.findOne({_id: new mongoose.Types.ObjectId(args.id)}).exec();
    return doc && doc.toObject();
  },
  addTodo: async (args: any) => {
    const { content } = args;
    return await TodoModel.create({ content: content, completed: false });
  },
  completeTodo: async (args: any) => {
    const { id } = args;
    const doc: any = await TodoModel.findById(new mongoose.Types.ObjectId(id)).exec();
    return await TodoModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { completed: !doc.completed });
  }
};
