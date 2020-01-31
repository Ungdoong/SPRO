import axiosAPI from './axiosAPI'

export default {
    async login(email, password) {
        try {
            const loginResponse = await axiosAPI.login(email, password)
            return loginResponse
        } catch (err) {
            console.error(err)
        }
    },
    async socialLogin(email, nickname, gender, platform) {
        try {
            const loginResponse = await axiosAPI.socialLogin(email, nickname, gender, platform)
            return loginResponse
        } catch (err) {
            console.error(err)
        }
    },
    async checkToken(token) {
        try {
            const checkTokenResponse = await axiosAPI.checkToken(token)
            return checkTokenResponse
        } catch (err) {
            console.error(err);
        }
    },
    async signup(email, nickname, name, password, gender, phone) {
        try {
            const singupRespone = await axiosAPI.signup(email, nickname, name, password, gender, phone)
            return singupRespone
        } catch (err) {
            console.error(err)
        }
    },
    async getGroup(id, token) {
        try {
            const getGroupResponse = await axiosAPI.getGroup(id, token)
            return getGroupResponse
        } catch (err) {
            console.log(err)
        }
    },
    async getGroups(payload) {
        try {
            const getGroupsResponse = await axiosAPI.getGroups(payload)
            return getGroupsResponse
        } catch (err) {
            console.log(err)
        }
    },
    async getMajorClasses(payload) {
        try {
            const getMajorClassesReponse = await axiosAPI.getMajorClasses(payload)
            return getMajorClassesReponse
        } catch (err) {
            console.log(err)
        }
    },
    async getMinorClasses(payload) {
        try {
            const getMinorClassesReponse = await axiosAPI.getMinorClasses(payload)
            return getMinorClassesReponse
        } catch (err) {
            console.log(err)
        }
    },
    async createGroup(payload) {
        try {
            const createGroupReponse = await axiosAPI.createGroup(payload)
            return createGroupReponse
        } catch (err) {
            console.log(err)
        }
    },

}