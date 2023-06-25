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
import SubjectService from "../../services/SubjectService";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const Subjects = () => {
  const perPage = 10;
  const [subjects, setSubjects] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    subject_name: "",
  });

  const getAllSubjects = async () => {
    await SubjectService.getAllSubjects()
      .then((res) => {
        // console.log(res);
        setSubjects(res);
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
    const pageData = subjects.slice(offset, offset + perPage);
    return pageData;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewSubject = async (e) => {
    e.preventDefault();
    // console.log(e.target);

    await SubjectService.addNewSubject(formData)
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
            subject_name: "",
          });
          setLoadingData(true);
          getAllSubjects();
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

  const handleDeleteSubject = (id) => {
    Swal.fire({
      title: 'Do you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSubject(id);
      }
    })
  }

  const deleteSubject = async (id) => {
    await SubjectService.deleteSubject(id)
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
            subject_name: "",
          });
          setLoadingData(true);
          getAllSubjects();
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
    getAllSubjects();
  }, []);

  return (
    <div>
      <MainContainer>
        <Title title="LMS Subjects" />

        {/* Form */}
        <Form onSubmit={addNewSubject}>
          <FormGroup row>
            <Container className="bg-light border p-4">
              <Row>
                <Col className="p-2">
                  <h4>Add New Subject</h4>
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    id="classNameInput"
                    name="subject_name"
                    placeholder="Subject Name"
                    type="text"
                    value={formData.subject_name}
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

        {!loadingData && subjects && subjects.length > 0 && (
          <>
            <Row>
              <Col className="mt-2">
                <h4>Existing subjects</h4>
              </Col>
            </Row>
            <Table responsive className="classrooms-tbl border" hover>
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPageData().map((subject, key) => (
                  <tr key={key}>
                    <td>{subject.subject_name}</td>
                    <td>
                      {/* <Button className="m-1" color="warning">
                        Edit
                      </Button> */}
                      <Button className="m-1" color="danger" onClick={() => handleDeleteSubject(subject.subject_id)}>
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
              pageCount={Math.ceil(subjects.length / perPage)}
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

        {!loadingData && subjects.length === 0 && <NoData />}
      </MainContainer>
    </div>
  );
};

export default Subjects;
