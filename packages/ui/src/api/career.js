import client from './client'

const getAssessments = () => client.get('/career/assessments')
const getAssessment = (type) => client.get(`/career/assessments/${type}`)
const submitAssessment = (type, body) => client.post(`/career/assessments/${type}/submit`, body)

const getUserScores = (userId) => client.get(`/career/scores/${userId}`)
const getUserScore = (userId, type) => client.get(`/career/scores/${userId}/${type}`)

const getBlueprint = (userId) => client.get(`/career/blueprint/${userId}`)
const updateBlueprint = (userId, body) => client.put(`/career/blueprint/${userId}`, body)

const getCheckIns = (userId) => client.get(`/career/checkin/${userId}`)
const createCheckIn = (userId, body) => client.post(`/career/checkin/${userId}`, body)

const getEvidence = (userId) => client.get(`/career/evidence/${userId}`)
const createEvidence = (userId, body) => client.post(`/career/evidence/${userId}`, body)
const updateEvidence = (userId, id, body) => client.put(`/career/evidence/${userId}/${id}`, body)
const deleteEvidence = (userId, id) => client.delete(`/career/evidence/${userId}/${id}`)

const getUserProfile = (userId) => client.get(`/career/profile/${userId}`)
const updateUserProfile = (userId, body) => client.put(`/career/profile/${userId}`, body)

export default {
    getAssessments,
    getAssessment,
    submitAssessment,
    getUserScores,
    getUserScore,
    getBlueprint,
    updateBlueprint,
    getCheckIns,
    createCheckIn,
    getEvidence,
    createEvidence,
    updateEvidence,
    deleteEvidence,
    getUserProfile,
    updateUserProfile
}
