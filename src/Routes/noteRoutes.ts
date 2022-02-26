import express from 'express'
import {
  createNotes,
  getAllNotes,
  updateNotes,
  shareNotes,
  getNote,
  deleteNote,
} from '../Controllers/notesController'

const router = express.Router()

router.route('/').get(getAllNotes)
router.route('/').post(createNotes)
router.route('/:id').put(updateNotes).get(getNote).delete(deleteNote)
router.route('/sharenote/:id').put(shareNotes)

export default router
