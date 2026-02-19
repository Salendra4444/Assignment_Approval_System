const AssignmentModel = require("../schema/assignment");

async function getAssignmentStatus() {
  const data = await AssignmentModel.aggregate([
    {
      $group: {
        _id: "$status",
        countAssignments: { $sum: 1 }
      }
    }
  ]);
  return data;
}



module.exports = getAssignmentStatus ;
