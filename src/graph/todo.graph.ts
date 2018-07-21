import {
  GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLList
} from 'graphql';
import * as mongoose from 'mongoose';
import { TodoModel } from '../model/todo.model';

export const TodoType = new GraphQLObjectType({  
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

export const QueryType = new GraphQLObjectType({  
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => TodoModel.find().exec().then(todos => todos.map((todo) => todo.toObject()))
    }
  }),
});

export const MutationType = new GraphQLObjectType({
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
 