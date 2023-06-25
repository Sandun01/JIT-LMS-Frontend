import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Form, 
    FormGroup, Container, Row, Col, Input, Button, Label, Table 
} from "reactstrap";
import Loader from "../../components/Loader";
import TeacherService from "../../services/TeacherService";
import ClassroomService from "../../services/ClassroomService";
import Swal from "sweetalert2";

const TeacherClassroomModel = (props) => {
    
    const { isOpen, toggleDialog } = props;
    const [loadingData, setLoadingData] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [allocatedClassrooms, setAllocatedClassrooms] = useState([]);
    
    const [selectTeacherRef, setSelectTeacherRef] = useState(true);
    const [selectClassroomRef, setSelectClassroomRef] = useState(true);

    const [formData, setFormData] = useState({
        teacher_id: "",
        classroom_id: "",
    });

    const getAllTeachers = async() => {
        await TeacherService.getAllTeachers()
            .then((res) => {
                // console.log(res);
                setTeachers(res);
                getAllClassrooms();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    const getAllClassrooms = async() => {
        await ClassroomService.getAllClassrooms()
            .then((res) => {
                // console.log(res);
                setClassrooms(res);
                setLoadingData(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };
      
    const saveTeacherData = (e) => {
        e.preventDefault();
        setLoadingTableData(true);
        setSelectedTeacher(formData.teacher_id);
        getTeacherAllocatedClassrooms(formData.teacher_id);
    }

    const getTeacherAllocatedClassrooms = async(id) => {
        await TeacherService.getTeacherAllocatedClassrooms(id)
        .then(res => {
            setAllocatedClassrooms(res);
            setLoadingTableData(false);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const allocateClassroom = async(e) => {
        e.preventDefault();

        let data = {
            "teacher_id": selectedTeacher,
            "classroom_id": formData.classroom_id
        };

        await TeacherService.allocateClassroomToTeacher(data)
        .then(res => {
            if(res){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Success!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setLoadingTableData(true);
                getTeacherAllocatedClassrooms(selectedTeacher);
            }else{
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }).catch(error => {
            console.log(error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error!",
                showConfirmButton: false,
                timer: 1500,
            });
        })

    }

    const handleDeleteClassroomAllocation = async(classroom_id) => {
        Swal.fire({
            title: "Do you want to de-allocate?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "De-allocate",
          }).then((result) => {
            if (result.isConfirmed) {
                deAllocateClassroom(classroom_id);
            }
          });
    }

    const deAllocateClassroom = async(classroom_id) => {
        let data = {
            "teacher_id": selectedTeacher,
            "classroom_id": formData.classroom_id
        };
        await TeacherService.deAllocateClassroomFromTeacher(data)
        .then(res => {
            if(res){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "De-allocated!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setLoadingTableData(true);
                getTeacherAllocatedClassrooms(selectedTeacher);
            }else{
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }).catch(error => {
            console.log(error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error!",
                showConfirmButton: false,
                timer: 1500,
            });
        })
    }

    const resetData = () => {
        setSelectTeacherRef(!selectTeacherRef);
        setSelectClassroomRef(!selectClassroomRef);
        setSelectedTeacher(null);
        setAllocatedClassrooms([]);
        setFormData({
            teacher_id: "",
            classroom_id: "",
        });
    }

    useEffect(() => {
        getAllTeachers();
    }, [])
    

    return (
        <div>
            <Modal isOpen={isOpen} returnFocusAfterClose={toggleDialog} size="xl" >
                <ModalHeader toggle={toggleDialog}>
                    Teacher Classroom Allocations
                </ModalHeader>

                {/* Loader */}
                {loadingData && <Loader />}
                {loadingData == false &&
                    <ModalBody>
                        {/* Teacher Details */}
                        <Form onSubmit={saveTeacherData}>
                            <FormGroup row>
                                <Container className="bg-light border p-4">
                                <Row>
                                    <Col className="p-t2">
                                    <h4>Teacher Data</h4>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Input
                                            key={selectTeacherRef}
                                            name="teacher_id"
                                            type="select"
                                            onChange={handleInputChange}
                                            required
                                            disabled={selectedTeacher}
                                        >
                                            <option key="default" value="">
                                                Select a teacher
                                            </option>
                                            {teachers.length > 0 &&
                                            teachers.map((teacher, k) => (
                                                <option key={k} value={teacher.teacher_id}>
                                                {teacher.first_name + ' ' + teacher.last_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Button type="submit" color="primary" disabled={selectedTeacher}>
                                            Confirm Teacher
                                        </Button>
                                        <Button className="mx-2" color="danger" onClick={resetData}>
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                                </Container>
                            </FormGroup>
                        </Form>

                        {/* Classroom Details */}
                        <Form onSubmit={allocateClassroom}>
                            <FormGroup row>
                                <Container className="bg-light border p-4">
                                <Row>
                                    <Col className="p-t2">
                                    <h4>Classroom Data</h4>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Input
                                            key={selectTeacherRef}
                                            name="classroom_id"
                                            type="select"
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option key="default" value="">
                                                Select a classroom
                                            </option>
                                            {classrooms.length > 0 &&
                                            classrooms.map((classroom, k) => (
                                                <option key={k} value={classroom.classroom_id}>
                                                    {classroom.classroom_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Button type="submit" color="warning" disabled={!selectedTeacher}>
                                            Allocate
                                        </Button>
                                    </Col>
                                </Row>
                                </Container>
                            </FormGroup>
                        </Form>

                        {/* Classroom Data Allocated */}
                        { loadingTableData && <Loader />}
                        {
                            !loadingTableData && allocatedClassrooms && allocatedClassrooms.length > 0 &&
                            <Table responsive className="classrooms-tbl border" hover>
                                <thead>
                                    <tr>
                                        <th>Classroom Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocatedClassrooms.map((classroom, key) => (
                                    <tr key={key}>
                                        <td>{classroom.classroom_name}</td>
                                        <td>
                                        <Button
                                            className="m-1"
                                            color="danger"
                                            onClick={() => handleDeleteClassroomAllocation(classroom.classroom_id)}
                                        >
                                            Deallocation
                                        </Button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </Table>
                        }
                    </ModalBody>
                 }
            </Modal>
        </div>
    );
};

export default TeacherClassroomModel;
