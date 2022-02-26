import NoteModel from '../Models/noteModel'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

//create notes
//method:post
//endpoint:api/v1/notes
export let createNotes = async (req: Request, res: Response) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res
      .status(400)
      .json({ status: false, error: 'You are not logged In' })
  }
  const secret: any = process.env.JWT_SECRET
  const decoded: any = jwt.verify(token, secret)

  const { title } = req.body
  const titleExits = await NoteModel.findOne({ title })
  if (titleExits) {
    return res
      .status(401)
      .json({ status: false, error: 'Title already registered' })
  }

  const note = await NoteModel.create(
    {
      title: req.body.title,
      description: req.body.description,
      sharedWith: [decoded.id],
    },
    (err: any) => {
      if (err) {
        res.status(500).json({ status: false, error: err })
      } else {
        res.status(201).json({
          status: 'success',
          data: note,
        })
      }
    }
  )
}

//get all notes
//method:get
//endpoint:api/v1/notes
export const getAllNotes = async (req: Request, res: Response) => {
  let notes = NoteModel.find((err: any, notes: any) => {
    if (err) {
      res.status(404).json({ success: false, errro: err })
    } else {
      res.status(200).json({ success: true, data: notes })
    }
  })
}

//update notes
//method:put
//endpoint:api/v1/notes/:noteid
export const updateNotes = async (req: Request, res: Response) => {
  let note = NoteModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: false, new: true },
    (err: any, note: any) => {
      if (!note) {
        res
          .status(404)
          .json({ success: false, errror: 'No note found with that id' })
      }
      if (err) {
        res.status(404).json({ success: false, errror: err })
      } else {
        res.status(200).json({ success: true, data: note })
      }
    }
  )
}
//share notes
//method:put
//endpoint:api/v1/notes/sharenote/:noteid
export const shareNotes = async (req: Request, res: Response) => {
  let note = NoteModel.findByIdAndUpdate(
    req.params.id,
    { $push: { sharedWith: req.body.sharedWith } },
    { runValidators: false, new: true },
    (err: any, note: any) => {
      if (!note) {
        res
          .status(404)
          .json({ success: false, errror: 'No note found with that id' })
      }
      if (err) {
        res.status(404).json({ success: false, errror: err })
      } else {
        res.status(200).json({ success: true, data: note })
      }
    }
  )
}

//getSingle Note
//method:get
//endpoint:api/v1/notes/:noteid

export let getNote = async (req: Request, res: Response) => {
  NoteModel.findById(req.params.id, (err: any, note: any) => {
    if (err) {
      res.status(404).json({ success: false, error: err })
    } else {
      let token
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1]
      }
      if (!token) {
        return res
          .status(400)
          .json({ status: false, error: 'You are not logged In' })
      }
      const secret: any = process.env.JWT_SECRET
      const decoded: any = jwt.verify(token, secret)
      if (note.sharedWith.includes(decoded.id)) {
        res.status(200).json({ success: true, data: note })
      } else {
        res.status(401).json({ success: true, error: 'You have no access' })
      }
    }
  })
}

//delete Notes
//method:delete
//endpoint:api/v1/notes/:noteid

export let deleteNote = async (req: Request, res: Response) => {
  const note = await NoteModel.findByIdAndDelete(req.params.id)
  if (!note) {
    res
      .status(401)
      .json({ status: false, error: 'No Notes found with thatv Id' })
  } else {
    res.status(200).json({
      status: true,
      message: 'successfully deleted',
    })
  }
}
