// Replica Set initialization command
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 },
  ],
})

// To execute:
// 1. Connect to mongo1 container:
// docker exec -it mongo1 mongosh
// 2. Paste the above command
