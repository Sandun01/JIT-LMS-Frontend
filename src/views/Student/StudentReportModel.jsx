import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader'
import { Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import StudentService from '../../services/StudentService';

const StudentReportModel = (props) => {
    const { isOpen, studentID, toggleDialog } = props;
    const [loadingData, setLoadingData] = useState(true);
    const [studentData, setStudentData] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const getStudentData = async() => {
        await StudentService.getStudentById(studentID)
        .then(res => {
            let data = res[0];
            let sub = data.subjects;
            let teachers = data.teachers;

            setStudentData(data);
            setSubjects(sub.split(','))
            setTeachers(teachers.split(','))

            setLoadingData(false);
        })
        .catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getStudentData();
    }, [])
    

    return (
        <div>
            <Modal isOpen={isOpen} returnFocusAfterClose={toggleDialog} size="xl" >
                <ModalHeader toggle={toggleDialog}>
                    Student Details Report
                </ModalHeader>

                {/* Loader */}
                {loadingData && <Loader />}
                {loadingData == false &&
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Container className="bg-light border p-4">
                                <Row>
                                    <Col className="p-t2">
                                        <h5>Student Data</h5>
                                    </Col>
                                </Row>
                                <Row className='my-3'>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Student</Label>
                                        <Input
                                            name="Student"
                                            placeholder="Student"
                                            type="text"
                                            value={studentData.first_name + " " + studentData.last_name}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Classroom</Label>
                                        <Input
                                            name="Classroom"
                                            placeholder="Classroom"
                                            type="text"
                                            value={studentData.classroom_name}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Contact Person</Label>
                                        <Input
                                            name="Contact Person"
                                            placeholder="Contact Person"
                                            type="text"
                                            value={studentData.contact_person}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                </Row>
                                <Row className='my-3'>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Email</Label>
                                        <Input
                                            name="Email"
                                            placeholder="Email"
                                            type="text"
                                            value={studentData.email}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Contact Number</Label>
                                        <Input
                                            name="Contact Number"
                                            placeholder="Contact Number"
                                            type="text"
                                            value={studentData.contact_no}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                    <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                        <Label>Date of Birth</Label>
                                        <Input
                                            name="Date of Birth"
                                            placeholder="Date of Birth"
                                            type="text"
                                            value={studentData.dob.split("T", 1)}
                                            readOnly
                                            required
                                        />
                                    </Col>
                                </Row>
                                </Container>
                            </FormGroup>
                        </Form>

                        {/* Table */}
                        <Container className='bg-light border p-3'>
                            <Row>
                                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                                    <h5>Teacher and Subject</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Table responsive className="classrooms-tbl border" hover>
                                        <thead>
                                            <tr>
                                                <th>Subjects</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            subjects && subjects.length > 0 && subjects.map((subject, k) => (
                                                <tr key={k}>
                                                    <td>{ subject }</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Table responsive className="classrooms-tbl border" hover>
                                        <thead>
                                            <tr>
                                                <th>Teachers</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            teachers && teachers.length > 0 && teachers.map((subject, k) => (
                                                <tr key={k}>
                                                    <td>{ subject }</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Container>
                        
                    </ModalBody>
                    }
            </Modal>
        </div>
    )
}

export default StudentReportModel