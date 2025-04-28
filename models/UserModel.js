const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
  
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required:[true, 'name required']
  },
  slug:{
    type: String,
    lowercase: true,
  },
  email:{
    type: String,
    required:[true, 'email required'],
    unique : true,
   lowercase: true,
  },
  phone: String,
  profileImg: String,

  password:{
    type: String,
    required: [true, 'password required'],
    minlength: [6, 'Too short password']
  },
  passwordChangedAt: Date ,
  resetCode :String ,
  passwordResetExpire : Date,
  passwordResetVerified : Boolean,
  role:{
    type: String,
    enum:['Orphanage','Donor' ,'admin'],
    default: 'Donor'
  },
  active:{
    type : Boolean,
    default: true
  },
  // addresses:[
  //  {
  //   id:{type: mongoose.Mongoose.Schema.Types.ObjectId}
  //  }
  // ]
}, 
{timestamps: true}
);
const setImageURL = (doc)=>{
  if(doc.profileImg){
    const imageUrl =`${process.env.BASE_URL}/users/${doc.profileImg}`
    doc.profileImg = imageUrl;
  }
}
// getAll / update / getOne
userSchema.post('init', (doc) => {
  setImageURL(doc)
});
//create
userSchema.post('save', (doc) => {
  setImageURL(doc)
});
userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next(); 
  //hashing user password
  this.password = await bcrypt.hash(this.password, 12)
   next();
})
const User = mongoose.model('User', userSchema);
module.exports = User;