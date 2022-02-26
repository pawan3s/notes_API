import mongoose from 'mongoose'

export interface NoteInput {
  title: string
  description: string
  sharedWith: Array<string>
}
export interface NoteDocument extends NoteInput, mongoose.Document {
  createdAt: Date
  UpdatedAt: Date
}

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    sharedWith: {
      type: Array,
    },
  },
  { timestamps: true }
)

const NoteModel = mongoose.model<NoteDocument>('Note', noteSchema)
export default NoteModel
