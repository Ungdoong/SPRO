import express from "express"
import routes from "../routes"
import {create_study, read_studies, join_study, delete_study, update_study, read_study, search_studies, mark_study, read_marked_studies} from "../controllers/studyController"
import {onlyPrivate} from "../middleware"

const studyRouter = express.Router();


studyRouter.get(routes.home, read_studies);
studyRouter.post(routes.study, onlyPrivate, create_study)
studyRouter.delete(routes.study_detail, delete_study)
studyRouter.put(routes.study_detail, update_study)
studyRouter.get(routes.study_search, search_studies)
studyRouter.get(routes.study_mark, read_marked_studies)
studyRouter.get(routes.study_detail, read_study)
studyRouter.post(routes.study_mark, onlyPrivate, mark_study)
studyRouter.post(routes.study_detail, join_study)

export default studyRouter;
