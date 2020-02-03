import {study_works, personal_works, users, studies} from "../models"

//req.body.study가 1이면 스터디 일정, 0이면 개인 일정

export const create_work = async function(req, res) {
    
    const works = req.body.study == '1' ? study_works : personal_works
    
    const user_id = res.locals.user.id;
    const study_id = req.query.study_id || -1;
    
    const data = req.body;
    data.writer = user_id
    data.study_id = study_id
    
    const study = await studies.findOne({where:{id:study_id}});
    const wrong_id = (!study && req.body.study == '1');

    const same_content_at_date = await works.findOne({where:{start_date:data.start_date, content:data.content}});
    const same_work = !same_content_at_date;
    
    const result = await works.create_work(data, wrong_id, !same_work);
    res.send(result)
}

export const delete_work = async function(req, res) {
    const works = req.body.study === '1' ? study_works : personal_works;
    const user_id =  res.locals.user.id;

    const work_id = req.query.work_id;
    const result = await works.delete_work(work_id, user_id);

    res.send(result);
}

export const update_work = async function(req, res) {
    const works = req.body.study === '1' ? study_works : personal_works;
    const user_id = res.locals.user.id;

    const work_id = req.query.work_id;
    const data = req.body;

    const result = await works.update_work(work_id, data, user_id);
    res.send(result);
}

export const read_work = async function(req, res) {

    const works = req.body.study === '1' ? study_works : personal_works

    const work_id = req.query.work_id

    const result = await works.read_work(work_id)

    if (!result) {
        res.send({
            "state": "fail",
            "detail": "Wrong id"
        })
    }
    else {
        const study = await studies.findOne({where:{id:result.study_id}})
        const user = await users.findOne({where:{id:result.writer}})
        delete result.dataValues.writer

        delete user.dataValues.password
        delete user.dataValues.auth

        result.dataValues.study = study
        result.dataValues.writer = user

        res.send(result)
    }
}