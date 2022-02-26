import UserModel from '../Models/userModel'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//Get all users
//method:get
//endpoint:api/v1/users
export let getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users = UserModel.find((err: any, users: any) => {
    if (err) {
      res.status(404).json({ success: false, errro: err })
    } else {
      res.status(200).json({ success: true, data: users })
    }
  })
}

//getSingle User
//method:get
//endpoint:api/v1/users/:id

export let getUser = async (req: Request, res: Response) => {
  UserModel.findById(req.params.id, (err: any, user: any) => {
    if (err) {
      res.status(404).json({ success: false, error: err })
    } else {
      res.status(200).json({ success: true, data: user })
    }
  })
}
//create User
//method:post
//endpoint:api/v1/users

export let createUser = async (req: Request, res: Response) => {
  const { email } = req.body
  const userExits = await UserModel.findOne({ email })
  if (userExits) {
    return res
      .status(401)
      .json({ status: false, error: 'User already registered' })
  }
  const user = await UserModel.create(req.body, (err: any) => {
    if (err) {
      res.status(500).json({ status: false, error: err })
    } else {
      res.status(201).json({
        status: 'success',
        data: user,
      })
    }
  })
}

//delete user
//method:delete
//endpoint:api/v1/users/:id

export let deleteUser = async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndDelete(req.params.id)
  if (!user) {
    res.status(401).json({ status: false, error: 'No user found' })
  } else {
    res.status(200).json({
      status: true,
      message: 'successfully deleted',
    })
  }
}
//login user
//method:post
//endpoint:api/v1/users/login

export let login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body
  const user = await UserModel.findOne({ email }).select('+password')
  if (!user) {
    res.status(401).json({
      status: false,
      errror: 'No user found with that email',
    })
  }
  const isMatch = await bcrypt.compare(password, user!.password)

  if (!isMatch) {
    res.status(401).json({
      status: false,
      errror: 'Invalid Email or password',
    })
  }
  const id: any = user!._id
  const secret: any = process.env.JWT_SECRET
  const token = jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
  res.status(200).json({
    Status: 'success',
    token,
    id: user!._id,
  })
}
