import './styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';

import Home from './views/Home';
import NotFound from './views/NotFound';
import NavBar from './components/NavBar';
import Classrooms from './views/Classrooms/Classrooms';
import Students from './views/Student/Students';
import Teachers from './views/Teachers/Teachers';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classrooms" element={<Classrooms />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
