const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


app.post('/events', async (req, res) => {
try {
    const { type, data } = req.body;
  
    if (type === 'CommentCreated') {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';
  
      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      });
    }
  
    res.status(200).send({});

} catch (error) {
  console.log(`Error in Moderation : ${error}`);
  res.status(500).send({
    message : `Error in Moderation : ${error}`
  })
}
});

const startServer = () => {

  app.listen(4003, () => {
    console.log('Moderation is working on port : 4003');
  });
}
startServer();

