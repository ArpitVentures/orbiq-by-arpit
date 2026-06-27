const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Arpit:Arpit12345@cluster0.6a8mg5z.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        await client.db("admin").command({ ping: 1 });

        console.log("MongoDB Connected Successfully!");

    } catch (error) {

        console.log(error);

    } finally {

        await client.close();

    }
}

run();