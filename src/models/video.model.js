import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
//is a Mongoose plugin designed to add pagination capabilities to Mongoose aggregate queries. Pagination is the process of dividing a large set of data into smaller chunks, or "pages", making it easier to handle and display. This is especially useful when dealing with large datasets in web applications, where you don't want to load all the data at once.


const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    videos: {
      type: Number,
      default: 0,
    },
    isPublish: {
      type: Boolean,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate); 
export const Video = mongoose.model("Video", videoSchema);
