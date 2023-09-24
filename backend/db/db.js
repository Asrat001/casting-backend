const mongoose = require("mongoose");
process.on('unhandledRejection', (err) => {
   
    mongoose.connection.close()
      .then(() => {
        console.log('MongoDB connection closed');
        process.exit(1);
      })
      .catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
  });
const connectDatabase = () =>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data) =>{
        console.log(`mongodb is connected with server`);
    })
}

module.exports = connectDatabase