import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import ReactPaginate from "react-paginate";

import MainContainer from "../../components/MainContainer";
import Title from "../../components/Title";
import NoData from "../../components/NoData";
import StudentService from "../../services/StudentService";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import ClassroomService from "../../services/ClassroomService";
import StudentReportModel from "./StudentReportModel";

const Student = () => {
  const perPage = 10;
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [studentID, setStudentId] = useState(null);

  const [classrooms, setClassrooms] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact_person: "",
    contact_no: "",
    email: "",
    dob: "",
    age: 0,
    classroom_id: "",
  });

  const [dialogToggleView, setDialogToggleView] = useState(false);

  const getAllStudents = async () => {
    await StudentService.getAllStudents()
      .then((res) => {
        // console.log(res);
        setStudents(res);
        setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const getPageData = () => {
    const offset = currentPage * perPage;
    const pageData = students.slice(offset, offset + perPage);
    return pageData;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if(name == "dob"){
      calculateAge(value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewStudent = async (e) => {
    e.preventDefault();
    // console.log(formData);

    await StudentService.addNewStudent(formData)
      .then((res) => {
        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success!",
            showConfirmButton: false,
            timer: 1500,
          });
          setFormData({
            first_name: "",
            last_name: "",
            contact_person: "",
            contact_no: "",
            email: "",
            dob: "",
            age: 0,
            classroom_id: "",
          });
          setLoadingData(true);
          getAllStudents();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const calculateAge = (dob) => {
    let age = 0;
    const birth = new Date(dob);
    const today = new Date();
    age = today.getFullYear() - birth.getFullYear();

    formData['age'] = age;
  };

  const handleDeleteStudent = (id) => {
    Swal.fire({
      title: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStudent(id);
      }
    });
  };

  const deleteStudent = async (id) => {
    await StudentService.deleteStudent(id)
      .then((res) => {
        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Deleted!",
            showConfirmButton: false,
            timer: 1500,
          });
          setFormData({
            first_name: "",
          });
          setLoadingData(true);
          getAllStudents();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const getAllClassrooms = async () => {
    setLoadingData(true);
    await ClassroomService.getAllClassrooms()
      .then((res) => {
        // console.log(res);
        setClassrooms(res);
        setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleViewStudent = (id) => {
    setDialogToggleView(!dialogToggleView);
    setStudentId(id);
  }

  useEffect(() => {
    getAllStudents();
    getAllClassrooms();
  }, []);

  return (
    <div>
      <MainContainer>
        <Title title="LMS Students" />

        {/* Form */}
        <Form onSubmit={addNewStudent}>
          <FormGroup row>
            <Container className="bg-light border p-4">
              <Row>
                <Col className="p-2">
                  <h4>Add New Student</h4>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="first_name"
                    placeholder="First Name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="last_name"
                    placeholder="Last Name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="contact_person"
                    placeholder="Contact Person"
                    type="text"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="contact_no"
                    placeholder="Contact Number"
                    type="text"
                    maxLength={12}
                    minLength={10}
                    value={formData.contact_no}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    name="dob"
                    placeholder="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  {/* classrooms */}
                  <Label>Select Classroom</Label>
                  <Input
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
                  <Label>Age</Label>
                  <Input
                    name="Age"
                    placeholder="Age"
                    type="text"
                    value={formData.age}
                    readOnly
                    disabled
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Button type="submit" color="primary">
                    Add New Student
                  </Button>
                </Col>
              </Row>
            </Container>
          </FormGroup>
        </Form>

        {/* Data Table */}
        {loadingData && <Loader />}

        {!loadingData && students && students.length > 0 && (
          <>
            <Row>
              <Col className="mt-2">
                <h4>Existing students</h4>
              </Col>
            </Row>
            <Table responsive className="classrooms-tbl border" hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>DOB</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPageData().map((student, key) => (
                  <tr key={key}>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.contact_no}</td>
                    <td>{student.email}</td>
                    <td>{student.dob.split("T", 1)}</td>
                    <td>{student.age}</td>
                    <td>
                      <Button className="m-1" color="warning" onClick={() => handleViewStudent(student.student_id)}>
                        View
                      </Button>   
                      <Button
                        className="m-1"
                        color="danger"
                        onClick={() => handleDeleteStudent(student.student_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(students.length / perPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              activeClassName={"active"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
            />

            {/* Student Dialog box */}
            {
              dialogToggleView &&
              <StudentReportModel
                isOpen={dialogToggleView} 
                studentID={studentID}
                toggleDialog={() => setDialogToggleView(!dialogToggleView)}
              />
            }

          </>
        )}

        {!loadingData && students.length === 0 && <NoData />}
      </MainContainer>
    </div>
  );
};

export default Student;
