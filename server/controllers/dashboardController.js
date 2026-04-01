const User = require("../models/User");
const Lead = require("../models/Lead");
const Task = require("../models/Task");

exports.getDashboardStats = async (req, res, next) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const totalTasks = await Task.countDocuments();

    const totalDeals = await Lead.countDocuments({
      status: "qualified"
    });

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name");

    res.status(200).json({
      stats: {
        totalUsers,
        totalLeads,
        totalTasks,
        totalDeals
      },
      recentActivity: {
        leads: recentLeads,
        tasks: recentTasks
      }
    });
  } catch (error) {
    next(error);
  }
};