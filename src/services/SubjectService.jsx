import axios from 'axios'
import { Backend_API_URL } from '../Constants/AppConst';

class SubjectService {

    //Get all Subjects
    async getAllSubjects() {
        var return_value = [];
        await axios
            .get(Backend_API_URL + "subject")
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

    //Add Subject
    async addNewSubject(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "subject", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Delete Subject
    async deleteSubject(id) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `subject/${id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

}

export default new SubjectService()

