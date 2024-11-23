const express = require('express');

const app = express();

app.use("/api/users", require('./routes/users'));
app.use("/api/profile", require('./routes/profile'));
app.use("/api/auth", require('./routes/auther'));
app.use("/api/posts", require('./routes/posts'));

// Connect to the database
connection();
app.get('/', (req, res) => res.send("Server working Correct"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
