import express from "express"
import routes from "../routes"
import { create_comment,read_comments, update_comment,delete_comment } from "../controllers/commentController";
import { create_like, delete_like } from "../controllers/commentController";
import { onlyPrivate } from "../middleware";


const commentRouter = express.Router();



commentRouter.get(routes.comment, onlyPrivate, read_comments);
commentRouter.post(routes.comment, create_comment);
commentRouter.put(routes.comment, update_comment);
commentRouter.delete(routes.comment, delete_comment);

commentRouter.post(routes.comment_like, create_like);
commentRouter.delete(routes.comment_like, delete_like);




export default commentRouter;

