import axios from 'axios'
import { Backend_API_URL } from '../Constants/AppConst';

class TeacherService {

    //Get all Teachers
    async getAllTeachers() {
        var return_value = [];
        await axios
            .get(Backend_API_URL + "teacher")
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
            })
        return return_value
    }

    //Add Teacher
    async addNewTeacher(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "teacher", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Delete Teacher
    async deleteTeacher(id) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `teacher/${id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Allocate Teacher Subject
    async allocateSubjectsToTeacher(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "teacher/subjects", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //DeAllocate Teacher Subject
    async deAllocateSubjectsFromTeacher(data) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `teacher/subjects/${data.teacher_id}/${data.subject_id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Get all Teacher subjects
    async getTeacherAllocatedSubjects(id) {
        var return_value = [];
        await axios
            .get(Backend_API_URL + `teacher/${id}/subjects`)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
            })
        return return_value
    }

    //Get all Teacher Classrooms
    async getTeacherAllocatedClassrooms(id) {
        var return_value = [];
        await axios
            .get(Backend_API_URL + `teacher/${id}/classrooms`)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
            })
        return return_value
    }

    //Allocate Teacher Classroom
    async allocateClassroomToTeacher(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "teacher/classrooms", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //DeAllocate Teacher Classroom
    async deAllocateClassroomFromTeacher(data) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `teacher/classrooms/${data.teacher_id}/${data.classroom_id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

}

export default new TeacherService()

