const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.81ztdua.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const placeCollection = client.db('travioAgency').collection('place');

        app.get('/place', async (req, res) => {
            const query = {};
            const cursor = placeCollection.find(query);
            const places = await cursor.toArray();
            res.send(places);
        });

        app.get('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const place = await placeCollection.findOne(query);
            res.send(place);
        });

        app.post('/place', async (req, res) => {
            const newPlace = req.body;
            const result = await placeCollection.insertOne(newPlace);
            res.send(result);
        });

        app.delete('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await placeCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Travio Running");
});
app.listen(port, () => {
    console.log("Listening to travio", port);
});