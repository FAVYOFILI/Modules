import express, {Express, Request, Response} from "express"
import mongoose, {model, Schema} from "mongoose"

const app:Express = express()
const port = 3833

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/TestDB").then(() => {
  console.log("Working DB")
}).catch((err: any) => {
  console.log("An error occured", err.message)
})

interface IUser{
  name: string,
  email: string,
  password: string
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
})

const User = mongoose.model<IUser>("myUsers", UserSchema)

app.get("/", async (req: Request, res: Response)=> {
  res.status(200).json({message: "API Working Successfully"})
})

app.get("/", async (req: Request, res: Response) => {
  try {
    const getAllusers = await User.find()
    res.status(200).json({message: "All Users Gotten Successfully", data: getAllusers})
  } catch (err: any) {
    res.status(500).json({message: "An Error Occurred", err: err.mesage})
  }
})

app.get("/get-one/:id", async (req: Request, res: Response) => {
    try {
      const getAUser = await User.findById(req.params.id);

      if (!getAUser) {
        res.status(404).json({message: "User not found", data: getAUser})
      }
      res.status(200).json({message: "User Gotten Successfully", data: getAUser})
    } catch (err: any) {
      res.status(500).json({ message: "An Error Occurred", err: err.mesage });
    }
})

app.listen (port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})