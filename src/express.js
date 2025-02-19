import express from "express";
import cors from "cors";
import getDb from "./db.js";
import { ObjectId } from "mongodb";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {res.json("hello aneroodh")})
app.get('/loadData', async (req,res) => {
  try{
      console.log("load api called");
      const db = await getDb('keeperApp');
      const collection = db.collection('user_notes')
      console.log("connected to collection user_notes");
      const user1 = req.query.user;
      console.log("Received user:", user1);
      if (!user1) {
          return res.status(400).json({ error: "User parameter is required" });
      }
      const data = await collection.find({user:user1}).toArray();
      res.json(data);
  }
  catch(error){
      console.error(error);
      res.status(500).json({error : "Internal Server Error"})
  }
})

app.post('/addNote', async (req, res) => {
  try {
    console.log("addNote API called");

    const db = await getDb('keeperApp');
    const collection = db.collection('user_notes');
    console.log("Connected to collection user_notes");

    const { user, title, content } = req.body;
    console.log("Received data:", { user, title, content });

    if (!user || !title || !content) {
      return res.status(400).json({ error: "User, title, and content are required" });
    }

    const newNote = { user, title, content, createdAt: new Date() };
    const result = await collection.insertOne(newNote);

    if (!result.insertedId) {
      return res.status(500).json({ error: "Failed to add note" });
    }

    // Fetch the newly inserted note
    const insertedNote = await collection.findOne({ _id: result.insertedId });

    res.status(201).json({ message: "Note added successfully", note: insertedNote });

  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// import { ObjectId } from "mongodb";

app.delete("/deleteNote/:id", async (req, res) => {
  try {
    console.log("Delete API called");

    const db = await getDb("keeperApp");
    const collection = db.collection("user_notes");
    console.log("Connected to collection user_notes");

    const noteId = req.params.id;
    console.log("Received Note ID:", noteId);

    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(noteId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });

  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateNote/:id", async (req, res) => {
  try {
    console.log("Update API called");

    const db = await getDb("keeperApp");
    const collection = db.collection("user_notes");
    console.log("Connected to collection user_notes");

    const noteId = req.params.id;
    const { title, content } = req.body;
    console.log("Received Note ID:", noteId);
    console.log("Received Data:", { title, content });

    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Update the note in the database
    const updatedNote = await collection.findOneAndUpdate(
      { _id: new ObjectId(noteId) },
      { $set: { title, content, updatedAt: new Date() } }, // Update the note with new data
      // { returnDocument: "after" } // Return the updated document
    );

    // if (!updatedNote.value) {
    //   return res.status(404).json({ error: "Note not found" });
    // }

    res.status(200);

  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.listen(5000, () => console.log("Server ready on port 5000."));
export default app;
