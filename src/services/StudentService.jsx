import axios from 'axios'
import { Backend_API_URL } from '../Constants/AppConst';

class StudentService {

    //Get all Students
    async getAllStudents() {
        var return_value = [];
        await axios
            .get(Backend_API_URL + "student")
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

    //Add Student
    async addNewStudent(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "student", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Delete Student
    async deleteStudent(id) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `student/${id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

}

export default new StudentService()

