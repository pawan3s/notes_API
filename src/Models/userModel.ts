import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserInput {
  email: string
  fullName: string
  password: string
}
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date
  UpdatedAt: Date
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
)
userSchema.pre('save', async function (next) {
  let user = this as UserDocument

  if (!user.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hashSync(user.password, salt)
  user.password = hashedPassword
  return next()
})

const UserModel = mongoose.model<UserDocument>('User', userSchema)
export default UserModel
