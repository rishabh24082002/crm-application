const Task = require("../models/Task");


exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      createdBy: req.user._id, 
      assignedTo: req.user.role === "admin" && assignedTo
        ? assignedTo           
        : req.user._id        
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};


exports.getTasks = async (req, res, next) => {
  try {
    const query = req.user.role === "admin"
      ? {}                                 
      : { assignedTo: req.user._id };       

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")  
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};


exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

  
    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    let updateData;

    if (req.user.role === "admin") {
      const { title, description, assignedTo, status, dueDate } = req.body;
      updateData = { title, description, assignedTo, status, dueDate };
    } else {
      updateData = { status: req.body.status };
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updated
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteTask = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};