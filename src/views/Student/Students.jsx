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

import MainContainer from "../../components/MainContainer";
import Title from "../../components/Title";
import NoData from "../../components/NoData";
import StudentService from "../../services/StudentService";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const Student = () => {
  const perPage = 10;
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    first_name: "",
  });

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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewStudent = async (e) => {
    e.preventDefault();
    // console.log(e.target);

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

  useEffect(() => {
    getAllStudents();
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
              <Row>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    id="classNameInput"
                    name="first_name"
                    placeholder="Student Name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Button type="submit" color="primary">
                    Add New
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
                  <th>Contact Person</th>
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
                    <td>{student.contact_person}</td>
                    <td>{student.dob.split("T", 1)}</td>
                    <td>{student.age}</td>
                    <td>
                      <Button className="m-1" color="warning">
                        View
                      </Button>
                      <Button className="m-1" color="secondary">
                        Edit
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
          </>
        )}

        {!loadingData && students.length === 0 && <NoData />}
      </MainContainer>
    </div>
  );
};

export default Student;
