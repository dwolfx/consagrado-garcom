import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Delete, ChevronRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleNumberForPin = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleLogin = () => {
        // Mock PIN Check
        if (pin === '1234') { // Default mock PIN
            localStorage.setItem('waiter_user', JSON.stringify({ name: 'João', id: 1 }));
            navigate('/');
        } else {
            setError(true);
            setPin('');
        }
    };

    return (
        <div className="container" style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a'
        }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}>
                    <User size={40} color="white" />
                </div>
                <h2>Acesso Garçom</h2>
                <p style={{ color: '#64748b' }}>Digite seu PIN de 4 dígitos</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: '15px', height: '15px', borderRadius: '50%',
                        backgroundColor: i < pin.length ? '#3b82f6' : '#334155',
                        border: error ? '1px solid #ef4444' : 'none'
                    }} />
                ))}
            </div>

            {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>PIN Incorreto</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} onClick={() => handleNumberForPin(num)} className="btn-outline" style={{ width: '70px', height: '70px', fontSize: '1.5rem', borderRadius: '50%', border: '1px solid #334155', color: 'white' }}>
                        {num}
                    </button>
                ))}
                <button onClick={handleDelete} className="btn-outline" style={{ widht: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #334155', color: '#ef4444' }}>
                    <Delete size={24} />
                </button>
                <button onClick={() => handleNumberForPin(0)} className="btn-outline" style={{ width: '70px', height: '70px', fontSize: '1.5rem', borderRadius: '50%', border: '1px solid #334155', color: 'white' }}>
                    0
                </button>
                <button onClick={handleLogin} className="btn-primary" style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <ChevronRight size={32} />
                </button>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#475569' }}>PIN Padrão: 1234</p>
        </div>
    );
};

export default Login;
