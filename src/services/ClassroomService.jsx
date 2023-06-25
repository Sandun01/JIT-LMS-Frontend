import axios from 'axios'
import { Backend_API_URL } from '../Constants/AppConst';

class ClassroomService {

    //get all classrooms
    async getAllClassrooms() {
        var return_value = [];
        await axios
            .get(Backend_API_URL + "classroom")
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

    //Add Classroom
    async addNewClassroom(data) {
        var return_value = false
        await axios
            .post(Backend_API_URL + "classroom", data)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

    //Delete Classroom
    async deleteClassroom(id) {
        var return_value = false
        await axios
            .delete(Backend_API_URL + `classroom/${id}`)
            .then((res) => {
                return_value = true;
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value
    }

}

export default new ClassroomService()

