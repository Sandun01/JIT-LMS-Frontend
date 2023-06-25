import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Container, Row, Col, Input, Button, Label, Table } from "reactstrap";

import Loader from "../../components/Loader";
import TeacherService from "../../services/TeacherService";
import SubjectService from "../../services/SubjectService";
import Swal from "sweetalert2";

const TeacherSubjectModel = (props) => {
    
    const { isOpen, toggleDialog } = props;
    const [loadingData, setLoadingData] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [allocatedSubjects, setAllocatedSubjects] = useState([]);
    
    const [selectTeacherRef, setSelectTeacherRef] = useState(true);
    const [selectSubjectRef, setSelectSubjectRef] = useState(true);

    const [formData, setFormData] = useState({
        teacher_id: "",
        subject_id: "",
    });

    const getAllTeachers = async() => {
        await TeacherService.getAllTeachers()
            .then((res) => {
                // console.log(res);
                setTeachers(res);
                getAllSubjects();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    const getAllSubjects = async() => {
        await SubjectService.getAllSubjects()
            .then((res) => {
                // console.log(res);
                setSubjects(res);
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
        getTeacherAllocatedSubjects(formData.teacher_id);
    }

    const getTeacherAllocatedSubjects = async(id) => {
        await TeacherService.getTeacherAllocatedSubjects(id)
        .then(res => {
            setAllocatedSubjects(res);
            setLoadingTableData(false);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const allocateSubject = async(e) => {
        e.preventDefault();

        let data = {
            "teacher_id": selectedTeacher,
            "subject_id": formData.subject_id
        };

        await TeacherService.allocateSubjectsToTeacher(data)
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
                getTeacherAllocatedSubjects(selectedTeacher);
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

    const handleDeleteSubjectAllocation = async(subject_id) => {
        Swal.fire({
            title: "Do you want to de-allocate?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "De-allocate",
          }).then((result) => {
            if (result.isConfirmed) {
                deAllocateSubject(subject_id);
            }
          });
    }

    const deAllocateSubject = async(subject_id) => {
        let data = {
            "teacher_id": selectedTeacher,
            "subject_id": formData.subject_id
        };
        await TeacherService.deAllocateSubjectsFromTeacher(data)
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
                getTeacherAllocatedSubjects(selectedTeacher);
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
        setSelectSubjectRef(!selectSubjectRef);
        setSelectedTeacher(null);
        setAllocatedSubjects([]);
        setFormData({
            teacher_id: "",
            subject_id: "",
        });
    }

    useEffect(() => {
        getAllTeachers();
    }, [])
    

    return (
        <div>
            <Modal isOpen={isOpen} returnFocusAfterClose={toggleDialog} size="xl" >
                <ModalHeader toggle={toggleDialog}>
                    Teacher Subject Allocations
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

                        {/* Subject Details */}
                        <Form onSubmit={allocateSubject}>
                            <FormGroup row>
                                <Container className="bg-light border p-4">
                                <Row>
                                    <Col className="p-t2">
                                    <h4>Subject Data</h4>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Input
                                            key={selectTeacherRef}
                                            name="subject_id"
                                            type="select"
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option key="default" value="">
                                                Select a subject
                                            </option>
                                            {subjects.length > 0 &&
                                            subjects.map((subject, k) => (
                                                <option key={k} value={subject.subject_id}>
                                                    {subject.subject_name}
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

                        {/* Subject Data Allocated */}
                        { loadingTableData && <Loader />}
                        {
                            !loadingTableData && allocatedSubjects && allocatedSubjects.length > 0 &&
                            <Table responsive className="classrooms-tbl border" hover>
                                <thead>
                                    <tr>
                                        <th>Subject Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocatedSubjects.map((subject, key) => (
                                    <tr key={key}>
                                        <td>{subject.subject_name}</td>
                                        <td>
                                        <Button
                                            className="m-1"
                                            color="danger"
                                            onClick={() => handleDeleteSubjectAllocation(subject.subject_id)}
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

export default TeacherSubjectModel;
