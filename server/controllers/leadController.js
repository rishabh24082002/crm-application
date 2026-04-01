const Lead = require("../models/Lead");

exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user._id 
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const { search, status, startDate, endDate, sort } = req.query;

    let query = req.user.role === "admin" ? {} : { createdBy: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    if (status) query.status = status;

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let sortOption = {};
    if (sort === "latest") sortOption = { createdAt: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };

    const leads = await Lead.find(query)
      .populate("createdBy", "name email")
      .sort(sortOption);

    res.status(200).json({ count: leads.length, leads });
  } catch (error) {
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("createdBy", "name email");

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (req.user.role !== "admin" && lead.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this lead" });
    }

    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (req.user.role !== "admin" && lead.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this lead" });
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ message: "Lead updated successfully", lead: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete leads" });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    next(error);
  }
};