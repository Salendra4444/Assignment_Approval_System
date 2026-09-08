const AssignmentModel = require("../schema/assignment");

async function getAssignmentStats(studentIds) {
  const stats = await AssignmentModel.aggregate([
    { $match: { studentId: { $in: studentIds } } },

    {
      $facet: {
        statusWise: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ],
        totalAssignments: [
          { $count: "total" }
        ]
      }
    }
  ]);

  return stats[0];
}

module.exports = getAssignmentStats;

