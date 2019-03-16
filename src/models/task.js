const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

taskSchema.methods.toJSON = function() {
  const task = this;
  const publicTask = task.toObject();

  delete publicTask.__v;

  return publicTask;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
