import Job from "../Models/jobModel.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { customAPIError } from "../Errors/customError.js";
import dayjs from "dayjs";
// import { nanoid } from 'nanoid'
// let jobs = [
//     {id: nanoid(5), company: 'apple', position: 'front-end'},
//     {id: nanoid(5), company: 'google', position: 'back-end'},
//     {id:nanoid(5),company : 'Zopkit' , position: 'GEN AI Engineer'}
// ]

//get all jobs  - read
export const getAllJobs = async (req, res, next) => {
  try {
    // here we are filtering the jobs to only show the jobs that are created by the user
    console.log(req.query);
    const { search, jobStatus, jobType, sort } = req.query;

    const queryObject = {
      createdBy: req.user.userId,
    };

    // Add jobStatus filter if provided
    if (jobStatus && jobStatus !== "all") {
      queryObject.jobStatus = jobStatus;
    }

    // Add jobType filter if provided
    if (jobType && jobType !== "all") {
      queryObject.jobType = jobType;
    }

    // Search should only search in position and company, not jobStatus
    if (search) {
      queryObject.$or = [
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    const sortOptions = {
      latest: '-createdAt',
      oldest: 'createdAt',
      'a-z': 'position',
      'z-a': '-position',
    }
    const sortKey = sortOptions[sort] || sortOptions.latest;

    //pagination
    const page = Number(req.query.page) || 1 ;
    const limit = Number(req.query.limit) || 10 ;
    const skip = (page - 1) * limit ;

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs /limit)

    
    const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);

    res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage: page, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
    // throw new customAPIError(error.message)
  }
};
// create job  - create
export const createJob = async (req, res, next) => {
  try {
    // const {company, position} = req.body
    // if(!company || !position) {
    //     return res.status(400).json({
    //         message: 'please provide company and position'
    //     })
    // }
    // const id = nanoid(5)
    // const job = {id, company, position}

    // here we are assigning the userId to the job that is created by the user
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    // jobs.push(job)
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
    // throw new customAPIError(error.message)
  }
};
// get single job  - read
export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // try to find the job with the given id
    // const job = jobs.find((job) => {
    //     return job.id === id
    // })
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: `no job with id ${id}` });
    }
    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
    // throw new customAPIError(error.message)
  }
};

// edit job  - update
export const editJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { company , position} = req.body
    // if(!company || !position){
    // return res.status(400).json({ message : 'please provide company and position'})
    // }
    // const job = jobs.find((job)=>{
    //     return job.id === id
    // })
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });

    // if (!job){
    // return res.status(404).json({message: `no job with id ${id}`})
    //  }
    // job.company = company
    // job.position = position
    res.status(StatusCodes.OK).json({ message: "job modified", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
    // throw new customAPIError(error.message)
  }
};

// delete job  - delete
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const job = jobs.find((job)=>{
    //     return job.id === id
    // })
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `no job with id ${id}` });
    }
    // const newJobs = jobs.filter((job)=>{
    //     return job.id !== id
    // })
    // jobs = newJobs
    res.status(StatusCodes.OK).json({ message: "job deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    // throw new customAPIError(error.message)
  }
};

export const showStats = async (req, res, next) => {
  let stat = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  stat = stat.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stat.pending || 0,
    interview: stat.interview || 0,
    declined: stat.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = dayjs()
        .month(month - 1)
        .year(year)
        .format("MMM YYYY");
      return { date, count };
    })
    .reverse();
  //   let monthlyApplications = [
  //     {
  //       date: "May 23",
  //       count: 12,
  //     },
  //     {
  //       date: "Jun 23",
  //       count: 9,
  //     },
  //     {
  //       date: "Jul 23",
  //       count: 3,
  //     },
  //   ];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
