import { useNavigate } from 'react-router-dom';
import { X, Clock, DollarSign, Award, LogOut, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const WaiterProfile = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [waiter, setWaiter] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('waiter_user') || '{}');
        setWaiter(user);
    }, [isOpen]); // Reload when opened

    const handleLogout = () => {
        if (confirm('Deseja encerrar seu turno e sair?')) {
            localStorage.removeItem('waiter_user');
            navigate('/login');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

            {/* Drawer */}
            <div className={`drawer-content ${isOpen ? 'open' : ''}`}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2>Meu Perfil</h2>
                    <button onClick={onClose} className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </header>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#334155',
                        margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', border: '4px solid var(--bg-primary)'
                    }}>
                        {(waiter.name || 'G')[0]}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{waiter.name || 'Garçom'}</h3>
                    <span style={{ color: '#94a3b8', backgroundColor: '#0f172a', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                        Em serviço • 🟢
                    </span>
                </div>

                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center', backgroundColor: '#0f172a' }}>
                    <div style={{ padding: '0.5rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Gorjetas (hoje)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>R$ 45,00</div>
                    </div>
                    <div style={{ padding: '0.5rem', borderLeft: '1px solid #333' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Mesas</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>12</div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: '#0f172a' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem' }}>Meu Turno</h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Clock size={20} color="var(--primary)" />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Horário</p>
                            <p style={{ fontWeight: '600' }}>18:00 - 02:00</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Calendar size={20} color="var(--primary)" />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Escala</p>
                            <p style={{ fontWeight: '600' }}>Sex • Sáb • Dom</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #333' }}>
                        <LogOut size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Sair do Turno (Logout)
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', marginTop: '1rem' }}>Garçom App v1.0</p>
                </div>
            </div>
        </>
    );
};

export default WaiterProfile;
