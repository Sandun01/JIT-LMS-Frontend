import axios from 'axios'
import { Backend_API_URL } from '../Constants/AppConst';

class ClassroomService {

    //get all classrooms
    async getAllClassrooms() {
        var return_value = null
        await axios
            .get(Backend_API_URL + "classroom")
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

}

export default new ClassroomService()

