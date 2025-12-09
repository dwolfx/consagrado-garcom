import { tables } from '../data/mockData';
import { AlertCircle, PlusCircle, Check, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Floor = () => {
    const navigate = useNavigate();

    // Sort: Calling first, then occupied, then free
    const sortedTables = [...tables].sort((a, b) => {
        if (a.status === 'calling' && b.status !== 'calling') return -1;
        if (a.status !== 'calling' && b.status === 'calling') return 1;
        if (a.status === 'occupied' && b.status === 'free') return -1;
        if (a.status === 'free' && b.status === 'occupied') return 1;
        return a.number - b.number;
    });

    const handleAttend = (id) => {
        alert("Atendimento iniciado! O alerta na mesa sumirá.");
    }

    return (
        <div className="container">
            <h1 style={{ marginBottom: '1rem' }}>Salão <span style={{ color: 'var(--primary)' }}>• Mesas</span></h1>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
                {sortedTables.map(table => (
                    <div
                        key={table.id}
                        className={`card ${table.status === 'calling' ? 'card-calling' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                backgroundColor: table.status === 'free' ? '#333' : 'var(--bg-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `2px solid ${table.status === 'calling' ? 'var(--primary)' : 'transparent'}`
                            }}>
                                <span style={{ fontWeight: 'bold' }}>{table.number}</span>
                            </div>
                            <div>
                                {table.status === 'calling' && <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>CHAMANDO</span>}
                                {table.status === 'occupied' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ocupada</span>}
                                {table.status === 'free' && <span style={{ color: '#555', fontSize: '0.9rem' }}>Livre</span>}

                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {table.total ? `R$ ${table.total.toFixed(2)}` : '--'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => navigate(`/people/${table.id}`)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                <Users size={20} />
                            </button>
                            {table.status === 'calling' ? (
                                <button onClick={() => handleAttend(table.id)} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                    <Check size={20} />
                                </button>
                            ) : (
                                <button onClick={() => navigate(`/take-order/${table.id}`)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                                    <PlusCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Floor;
