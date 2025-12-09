import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Users, ClipboardList, Bell } from 'lucide-react';
import Floor from './pages/Floor';
import TakeOrder from './pages/TakeOrder';
import TablePeople from './pages/TablePeople';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Floor />} />
        <Route path="/take-order/:id" element={<TakeOrder />} />
        <Route path="/people/:id" element={<TablePeople />} />
        <Route path="/notifications" element={<div className="container"><h1>Notificações</h1><p>Sem novos alertas.</p></div>} />
      </Routes>

      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Users size={24} />
          <span>Salão</span>
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bell size={24} />
          <span>Alertas</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={(e) => e.preventDefault()}>
          <ClipboardList size={24} style={{ opacity: 0.5 }} />
          <span>Pedidos</span>
        </NavLink>
      </nav>
    </Router>
  );
}

export default App;
