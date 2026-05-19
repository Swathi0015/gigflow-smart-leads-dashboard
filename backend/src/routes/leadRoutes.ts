import express from "express";
import Lead from "../models/Lead";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();


// ================= CREATE LEAD =================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
});


// ================= GET LEADS WITH PAGINATION =================

router.get("/", authMiddleware, async (req, res) => {
  try {

    // PAGE NUMBER
    const page =
      Number(req.query.page) || 1;

    // LIMIT PER PAGE
    const limit = 10;

    // SKIP RECORDS
    const skip = (page - 1) * limit;

    // FILTERS
    const search =
      (req.query.search as string) || "";

    const status =
      (req.query.status as string) || "";

    const source =
      (req.query.source as string) || "";

    // FILTER OBJECT
    const filter: any = {};

    // SEARCH BY NAME OR EMAIL
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // FILTER STATUS
    if (status) {
      filter.status = status;
    }

    // FILTER SOURCE
    if (source) {
      filter.source = source;
    }

    // GET LEADS
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // TOTAL LEADS
    const total =
      await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,

      page,

      totalPages: Math.ceil(
        total / limit
      ),

      total,

      leads,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
});


// ================= DELETE LEAD =================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    await Lead.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Lead deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
});

export default router;