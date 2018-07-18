import * as mongoose from 'mongoose';

const mongooseSchema = new mongoose.Schema({
  content: String,
  completed: Boolean
});
mongooseSchema.set('toObject', {transform: (doc: any, ret: any, _: any) => {
  ret.id = doc._id.toString();
  delete doc._id
}});

export const TodoModel = mongoose.model('Todo', mongooseSchema);