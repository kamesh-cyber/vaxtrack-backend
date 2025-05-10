const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const client = async () => {
  console.log("Connecting to mongoDB......__________________________");



  const URI = `mongodb+srv://${process.env.DB_USER_NAME}:${encodeURIComponent(
    process.env.DB_PASSWORD
  )}@${process.env.DB_HOST_NAME}`;

  const clientCon = new MongoClient(URI, {
    retryWrites: true,
    w: "majority",
    appName: "VaccinationPortal"
  });

  try {
    console.log("Connecting......");
    const clientConnection = await clientCon.connect();
    console.log("Connected successfully.");
    return clientConnection.db(process.env.DB_NAME);
  } catch (e) {
    console.log("Error occurred......");
    console.error(e);
  }
};

module.exports = {
  client: client(),
};
