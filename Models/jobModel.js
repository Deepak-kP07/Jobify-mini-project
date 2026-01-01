import mongoose from 'mongoose'
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js'

const JobSchema = new mongoose.Schema({
    company :{
        type : String ,
        required : [true , 'Please provide company'],
        maxlength : 50
    },
    position : String, 
    jobStatus :{
        type : String,
        enum : Object.values(JOB_STATUS),
        default : JOB_STATUS.PENDING
    },
    jobType : {
        type : String,
        enum : Object.values(JOB_TYPE),
        default : JOB_TYPE.FULL_TIME
    },
    jobLocation : {
        type:String ,
        default : 'my city'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : [true , 'Please provide user']
    }

}, {timestamps : true})

export default mongoose.model('job' , JobSchema)
// this Job is the model name ie. job is the collection name in the database