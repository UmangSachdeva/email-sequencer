import { isObjectIdOrHexString } from "mongoose";
import Sequence from "../models/sequence.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scheduleEmails } from "../utils/emailScheduler.js";

const startProcess = asyncHandler(async (req, res) => {
  const { nodes, edges } = req.body;
  try {
    const newSequence = new Sequence({ nodes, edges });
    await newSequence.save();

    await Sequence.aggregate([
      {
        $match: {_id: new ObjectId('user-id')}
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          to: "final-output"
        }
      },
      {
        $group: {
          _id: '$_id',
          user_name: '$final-output.user_name',
          data: '$final-output'
        }
      }

    ])

    await scheduleEmails(newSequence);
    res.status(200).send("Sequence saved and emails scheduled");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export { startProcess };
