import express, { Application } from "express"
import mongoose, {model, Schema} from "mongoose"

const app: Application = express()
const port = 3004

app.use(express.json());

mongoose.connect