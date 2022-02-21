const { ObjectId } = require("mongodb");

function addPhoto(dbo, validationResult) {
  return function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { label, photoURL } = req.body;
    const db_connect = dbo.getDb();
    const photoObject = {
      label,
      photoURL,
    };

    db_connect
      .collection("photos")
      .insertOne(photoObject, (error, dbResponse) => {
        if (error) throw error;
        res.json(dbResponse);
      });
  };
}

function deletePhoto(dbo) {
  return function (req, res) {
    const { id } = req.params;
    const db_connect = dbo.getDb();
    const query = { _id: ObjectId(id) };

    db_connect.collection("photos").deleteOne(query, (error, dbResponse) => {
      if (error) throw error;
      console.log("1 document deleted");
      res.json(dbResponse);
    });
  };
}

function getPhotos(dbo) {
  return function (req, res) {
    const db_connect = dbo.getDb(`${process.env.DATABASE_NAME}`);
    db_connect
      .collection("photos")
      .find({})
      .toArray((error, result) => {
        if (error) throw error;
        res.json(result);
      });
  };
}

module.exports = {
  addPhoto,
  deletePhoto,
  getPhotos,
};
