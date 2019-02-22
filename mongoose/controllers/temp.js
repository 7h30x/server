static async addData(req, res) {
  try {
    let id = Number(req.params.id)
    let userObj = await userModel.findOneAndUpdate({
      _id: req.decoded._id
    }, {
        $push: { timbangans: id }
      }, {
        new: true
      })
    let payload = userObj.toObject()
    delete payload.password
    res.status(200).json({
      message: 'updated user timbangans.',
      data: payload
    })
  } catch (err) {
    console.log('error: ', err)
    res.status(400).json({
      error: 'error updating data'
    })
  }
}

  static async deleteData(req, res) {
  try {
    let id = Number(req.params.id)
    let userObj = await userModel.findOneAndUpdate({
      _id: req.decoded._id
    }, {
        $pull: {
          timbangans: id
        }
      }, {
        new: true
      })
    let payload = userObj.toObject()
    delete payload.password
    res.status(200).json({
      message: 'Successfully deleted user timbangan with id:' + id,
      data: payload
    })
  } catch (err) {
    console.log('error: ', err)
    res.status(400).json({
      error: 'error updating data'
    })
  }
}