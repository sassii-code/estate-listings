import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Form = mongoose.model('Form', formSchema);

export default Form;