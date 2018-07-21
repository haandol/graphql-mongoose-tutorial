import * as mongoose from 'mongoose';
import { UserModel } from '../model/user.model';

export const typeDefs = `
  type User {
    id: String
    name: String
    email: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String): User
    removeUser(id: String!): User
  }
`;

export const resolvers = {
  users: async () => {
    const docs = await UserModel.find({}).exec();
    return docs.map(doc => doc.toObject())
  },
  addUser: async (args: any) => {
    const { name, email } = args;
    return await UserModel.create({ name, email });
  },
  removeUser: async (args: any) => {
    const { id } = args;
    return await UserModel.findByIdAndRemove(new mongoose.Types.ObjectId(id));
  }
};
