const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
  
    const comments = commentsByPostId[req.params.id] || [];
  
    comments.push({ id: commentId, content, status: "pending" });
  
    commentsByPostId[req.params.id] = comments;
  
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  
    res.status(201).send(comments);

  } catch (error) {
    console.log('Error in /posts/:id/comments in comment service : ',error);
    res.status(500).send({
      message : `Error in Comment service : ${error}`
    }) 
  }
});

app.post("/events", async (req, res) => {

 try {
   console.log("Event Received:", req.body.type);
 
   const { type, data } = req.body;
 
   if (type === "CommentModerated") {
     const { postId, id, status, content } = data;
     const comments = commentsByPostId[postId];
 
     const comment = comments.find((comment) => {
       return comment.id === id;
     });
     comment.status = status;
 
     await axios.post("http://localhost:4005/events", {
       type: "CommentUpdated",
       data: {
         id,
         status,
         postId,
         content,
       },
     });
   }
 
   res.status(200).send({});

 } catch (error) {
  console.log('Error in /events in Comment service : ', error);
 }
});


const startServer = () => {

  app.listen(4001, () => {
    console.log("Comment service is started on port 4001");
  });
  
}
startServer();
