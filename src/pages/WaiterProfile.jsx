import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Award, LogOut, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const WaiterProfile = () => {
    const navigate = useNavigate();
    const [waiter, setWaiter] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('waiter_user') || '{}');
        setWaiter(user);
    }, []);

    const handleLogout = () => {
        if (confirm('Deseja encerrar seu turno e sair?')) {
            localStorage.removeItem('waiter_user');
            navigate('/login');
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Meu Perfil</h2>
            </header>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#334155',
                    margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', border: '4px solid var(--bg-secondary)'
                }}>
                    {(waiter.name || 'G')[0]}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{waiter.name || 'Garçom'}</h3>
                <span style={{ color: '#94a3b8', backgroundColor: '#1e293b', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                    Em serviço • 🟢
                </span>
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Gorjetas (hoje)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>R$ 45,00</div>
                </div>
                <div style={{ padding: '0.5rem', borderLeft: '1px solid #333' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Mesas </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>12</div>
                </div>
            </div>

            <div className="card">
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

            <button onClick={handleLogout} className="btn-outline" style={{ marginTop: '2rem', color: '#ef4444', borderColor: '#ef4444' }}>
                <LogOut size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Sair do Turno (Logout)
            </button>
        </div>
    );
};

export default WaiterProfile;
