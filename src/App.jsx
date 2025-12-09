import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Users, ClipboardList, Bell, LogOut } from 'lucide-react';
import Floor from './pages/Floor';
import TakeOrder from './pages/TakeOrder';
import TablePeople from './pages/TablePeople';
import Login from './pages/Login';

const RequireAuth = ({ children }) => {
  const user = localStorage.getItem('waiter_user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('waiter_user');
    window.location.href = '/login';
  };

  return (
    <>
      <div style={{ paddingBottom: '80px' }}>
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <LogOut size={20} />
          </button>
        </div>
        {children}
      </div>

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
    </>
  );
};

const LayoutWrapper = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RequireAuth><LayoutWrapper><Floor /></LayoutWrapper></RequireAuth>} />
        <Route path="/take-order/:id" element={<RequireAuth><LayoutWrapper><TakeOrder /></LayoutWrapper></RequireAuth>} />
        <Route path="/people/:id" element={<RequireAuth><LayoutWrapper><TablePeople /></LayoutWrapper></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><LayoutWrapper><div className="container"><h1>Notificações</h1><p>Sem novos alertas.</p></div></LayoutWrapper></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
