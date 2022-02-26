import express from 'express'
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  login,
} from '../Controllers/userController'

const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/').post(createUser)

router.route('/:id').get(getUser).delete(deleteUser)
router.route('/login').post(login)

export default router
