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
import ClassroomService from "../../services/ClassroomService";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const Classrooms = () => {
  const perPage = 10;
  const [classrooms, setClassrooms] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    classroom_name: "",
  });

  const getAllClassrooms = async () => {
    setTimeout(async () => {
      await ClassroomService.getAllClassrooms()
        .then((res) => {
          // console.log(res);
          setClassrooms(res);
          setLoadingData(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const getPageData = () => {
    const offset = currentPage * perPage;
    const pageData = classrooms.slice(offset, offset + perPage);
    return pageData;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewClassroom = async (e) => {
    e.preventDefault();
    // console.log(e.target);

    await ClassroomService.addNewClassroom(formData)
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
            classroom_name: "",
          });
          setLoadingData(true);
          getAllClassrooms();
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

  const handleDeleteClassroom = (id) => {
    Swal.fire({
      title: 'Do you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClassroom(id);
      }
    })
  }

  const deleteClassroom = async (id) => {
    await ClassroomService.deleteClassroom(id)
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
            classroom_name: "",
          });
          setLoadingData(true);
          getAllClassrooms();
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
    getAllClassrooms();
  }, []);

  return (
    <div>
      <MainContainer>
        <Title title="LMS Classrooms" />

        {/* Form */}
        <Form onSubmit={addNewClassroom}>
          <FormGroup row>
            <Container className="bg-light border p-4">
              <Row>
                <Col className="p-2">
                  <h4>Add New Classroom</h4>
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={4} md={4} lg={4} xl={4}>
                  <Input
                    id="classNameInput"
                    name="classroom_name"
                    placeholder="Classroom Name"
                    type="text"
                    value={formData.classroom_name}
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

        {!loadingData && classrooms && classrooms.length > 0 && (
          <>
            <Row>
              <Col className="mt-2">
                <h4>Existing Classrooms</h4>
              </Col>
            </Row>
            <Table responsive className="classrooms-tbl border" hover>
              <thead>
                <tr>
                  <th>Classroom Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPageData().map((classroom, key) => (
                  <tr key={key}>
                    <td>{classroom.classroom_name}</td>
                    <td>
                      {/* <Button className="m-1" color="warning">
                        Edit
                      </Button> */}
                      <Button className="m-1" color="danger" onClick={() => handleDeleteClassroom(classroom.classroom_id)}>
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
              pageCount={Math.ceil(classrooms.length / perPage)}
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

        {!loadingData && classrooms.length === 0 && <NoData />}
      </MainContainer>
    </div>
  );
};

export default Classrooms;
