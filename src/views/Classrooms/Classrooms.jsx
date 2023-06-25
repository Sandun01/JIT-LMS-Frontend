import React, { useEffect, useState } from "react";
import MainContainer from "../../components/MainContainer";
import Title from "../../components/Title";
import { Button, Table } from "reactstrap";
import NoData from "../../components/NoData";
import ClassroomService from "../../services/ClassroomService";

const Classrooms = () => {

  const [classrooms, setClassrooms] = useState([]);

  const getAllClassrooms = async() => {
      await ClassroomService.getAllClassrooms()
      .then(res => {
        console.log(res);
        setClassrooms(res);
      })

  } 

  useEffect(() => {
    getAllClassrooms();
  }, [])
  

  return (
    <div>
      <MainContainer>
        <Title title="LMS Classrooms" />

        { classrooms && classrooms.length > 0 ? 
          <Table responsive className="classrooms-tbl" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Classroom Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {
              classrooms.map((classroom, key) => (
                <tr>
                  <td>{key}</td>
                  <td>{classroom.classroom_name}</td>
                  <td>
                    <Button className="m-1" color="warning">Edit</Button>
                    <Button className="m-1" color="danger">Delete</Button>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          :
          <NoData />
        }
        
      </MainContainer>
    </div>
  );
};

export default Classrooms;
