import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
  Table,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

import MainContainer from "../../components/MainContainer";
import Title from "../../components/Title";
import NoData from "../../components/NoData";
import TeacherService from "../../services/TeacherService";
import Loader from "../../components/Loader";
import TeacherClassroomModel from "./TeacherClassroomModel";
import TeacherSubjectModel from "./TeacherSubjectModel";

const Teacher = () => {
  const perPage = 10;
  const [teachers, setTeachers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact_no: "",
    email: "",
  });

  const [dialogToggleClass, setDialogToggleClass] = useState(false);
  const [dialogToggleSubject, setDialogToggleSubject] = useState(false);
  
  const getAllTeachers = async () => {
    await TeacherService.getAllTeachers()
      .then((res) => {
        // console.log(res);
        setTeachers(res);
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
    const pageData = teachers.slice(offset, offset + perPage);
    return pageData;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewTeacher = async (e) => {
    e.preventDefault();
    // console.log(formData);

    await TeacherService.addNewTeacher(formData)
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
            contact_no: "",
            email: "",
          });
          setLoadingData(true);
          getAllTeachers();
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

  const handleDeleteTeacher = (id) => {
    Swal.fire({
      title: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTeacher(id);
      }
    });
  };

  const deleteTeacher = async (id) => {
    await TeacherService.deleteTeacher(id)
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
          getAllTeachers();
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

  useEffect(() => {
    getAllTeachers();
  }, []);

  return (
    <div>
      <MainContainer>
        <Title title="LMS Teachers" />

        {/* Allocations */}
        <Container className="bg-light border p-4 my-4">
          <Row>
            <Col className="p-2 hover-bg-error">
              <h4>Teacher Classroom Allocations</h4>
              <Button className="text-white" color="success" onClick={() => setDialogToggleClass(!dialogToggleClass)}>
                Class Allocation
              </Button>
              <TeacherClassroomModel isOpen={dialogToggleClass} toggleDialog={() => setDialogToggleClass(!dialogToggleClass)}/>
            </Col>
            <Col className="p-2">
              <h4>Teacher Subject Allocations</h4>
              <Button color="warning" onClick={() => setDialogToggleSubject(!dialogToggleSubject)}>
                Subject Allocation
              </Button>
            </Col>
            <TeacherSubjectModel isOpen={dialogToggleSubject} toggleDialog={() => setDialogToggleSubject(!dialogToggleSubject)}/>
          </Row>
        </Container>

        {/* Form */}
        <Form onSubmit={addNewTeacher}>
          <FormGroup row>
            <Container className="bg-light border p-4">
              <Row>
                <Col className="p-2">
                  <h4>Add New teacher</h4>
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
              </Row>
              <Row className="mt-3">
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
                  <Button type="submit" color="primary">
                    Add New Teacher
                  </Button>
                </Col>
              </Row>
            </Container>
          </FormGroup>
        </Form>

        {/* Data Table */}
        {loadingData && <Loader />}

        {!loadingData && teachers && teachers.length > 0 && (
          <>
            <Row>
              <Col className="mt-2">
                <h4>Existing teachers</h4>
              </Col>
            </Row>
            <Table responsive className="classrooms-tbl border" hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPageData().map((teacher, key) => (
                  <tr key={key}>
                    <td>{teacher.first_name}</td>
                    <td>{teacher.last_name}</td>
                    <td>{teacher.contact_no}</td>
                    <td>{teacher.email}</td>
                    <td>
                      <Button
                        className="m-1"
                        color="danger"
                        onClick={() => handleDeleteTeacher(teacher.teacher_id)}
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
              pageCount={Math.ceil(teachers.length / perPage)}
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
          </>
        )}

        {!loadingData && teachers.length === 0 && <NoData />}
      </MainContainer>
    </div>
  );
};

export default Teacher;
