import express from "express"
import routes from "../routes"
import {create_post, read_post, update_post, delete_post, list_post, search_post} from "../controllers/postController"
// import {read_study_post, create_study_post, update_study_post,delete_study_post, list_study_post} from "../controllers/postController"



// //Common Post
// const COMMON_POSTS = "/common_posts";
// //Study Post
// const STUDY_POSTS = "/study_posts";

// const POST = "/post"
// const COMMON_POST = "/post/:board";
// const STUDY_POST = "/post/:study_id&:board";
// const COMMON_POST_DETAIL = "/detail/:post_id";
// const STUDY_POST_DETAIL = "/detail/:study_id&:post_id";


const postRouter = express.Router();

// const POST = "/create"
// const POSTS = "/list";
// const POST_DETAIL = "/detail";


postRouter.get(routes.post_list,list_post);
postRouter.post(routes.post_detail,create_post);
postRouter.get(routes.post_detail,read_post);
postRouter.put(routes.post_detail,update_post);
postRouter.delete(routes.post_detail,delete_post);
postRouter.post(routes.post_search,search_post);



export default postRouter;