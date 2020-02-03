import {alarms, users} from "../models"

export const create_alarm = async function(req, res) {
    const from = res.locals.user.id;
    const to = req.query.to ? req.query.to : -1;

    const to_user = await users.findOne({where:{id:to}});

    if (!to_user) {
        res.send({
        "state": "fail",
        "detail": "wrong id"
        })
    } else {
        const result = await alarms.create_alarm(from, to, req.body)
        res.send(result)
    }
}

export const delete_alarm = async function(req, res) {
    const user_id = res.locals.user.id;
    const alarm_id = req.query.alarm_id || -1;

    const result = await alarms.delete_alarm(alarm_id, user_id);
    res.send(result);
    
} 

export const read_alarm = async function(req, res) {
    const alarm_id = req.query.alarm_id || -1;

    const result = await alarms.read_alarm(alarm_id);
    res.send(result);
}

export const read_alarms_all = async function(req, res) {
    const user_id = res.locals.user.id;
    const target = req.query.target || -1;
    
    const result = await alarms.read_alarms_all(user_id, target)
    res.send(result)
}