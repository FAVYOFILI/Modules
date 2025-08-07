import express, { Application, Request, Response } from "express";
import mongoose, { model, Schema } from "mongoose";

const app: Application = express();
const port = 4000;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/internsDB")
  .then(() => {
    console.log("Working DB");
  })
  .catch((err: any) => {
    console.log("An error occured", err.message);
  });

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>("myUsers", userSchema);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working successfully" });
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const getAllUsers = await User.find();
    res
      .status(200)
      .json({ message: "All users gotten successfully", data: getAllUsers });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

app.get("/get:one/:id", async (req: Request, res: Response) => {
  try {
    // const {id = req.param}
    const getAUser = await User.findById(req.params.id);
    if (!getAUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User gotten", data: getAUser });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

app.post("/create-user", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const checkIfUsersExist = await User.findOne({ email });

    if (checkIfUsersExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createUser = await User.create({ name, email, password });
    res
      .status(201)
      .json({ message: "User created successfully", data: createUser });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as Pick<IUser, "email" | "password">;

    const checkLogin = await User.findOne({ email });

    if (!checkLogin || checkLogin.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      message: "Login successfully",
      name: checkLogin.name,
      email: checkLogin.email,
      _id: checkLogin._id,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "An error occured", status: false, err: err.message });
  }
});

app.patch("/update-user/:id", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as Partial<IUser>;
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User update successfully", updateUser });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

app.delete("/delete-user/:id", async (req: Request, res: Response) => {
  try {
    const findToDelete = await User.findByIdAndDelete(req.params.id);

    if (!findToDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User delete successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

app.delete("/delete-every", async (req: Request, res: Response) => {
  try {
    await User.deleteMany();

    res.status(200).json({ message: "Users deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "An error occured", err: err.message });
  }
});

// app.all("*", async (req: Request, res: Response) => {
//     res.status(404).json({message: "No routes matched"})
// });

app.listen(port, () => {
  console.log(`server is listening to http://localhost:${port}`);
});