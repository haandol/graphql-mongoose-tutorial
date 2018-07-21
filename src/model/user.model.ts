import * as mongoose from 'mongoose';

const mongooseSchema = new mongoose.Schema({
  name: String,
  email: String
});
mongooseSchema.set('toObject', {transform: (doc: any, ret: any, _: any) => {
  ret.id = doc._id.toString();
  delete doc._id
}});

export const UserModel = mongoose.model('User', mongooseSchema);