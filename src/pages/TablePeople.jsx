import { useParams, useNavigate } from 'react-router-dom';
import { tables } from '../data/mockData';
import { ArrowLeft, UserPlus, Search, User } from 'lucide-react';
import { useState } from 'react';

const TablePeople = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const table = tables.find(t => t.id === Number(id));

    // Local state for adding people
    const [mode, setMode] = useState('view'); // view, add-guest, add-cpf
    const [inputValue, setInputValue] = useState('');

    if (!table) return <div>Mesa não encontrada</div>;

    const handleAddGuest = () => {
        alert(`Convidado "${inputValue}" adicionado à mesa!`);
        setMode('view');
        setInputValue('');
        // In a real app, this would update backend state
    };

    const handleSearchCPF = () => {
        alert(`Cliente com CPF ${inputValue} encontrado e adicionado!`);
        setMode('view');
        setInputValue('');
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Mesa {table.number} <span style={{ fontWeight: 'normal', fontSize: '1rem', color: 'var(--text-secondary)' }}>• Pessoas</span></h2>
            </header>

            {/* List of People */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {table.people && table.people.length > 0 ? (
                    table.people.map(person => (
                        <div key={person.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 0 }}>
                            <div style={{ fontSize: '1.5rem' }}>{person.avatar}</div>
                            <div>
                                <h4>{person.name}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {person.type === 'app' ? 'App User' : 'Convidado'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Ninguém na mesa ainda.</p>
                )}
            </div>

            {/* Actions Area */}
            {mode === 'view' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button onClick={() => setMode('add-cpf')} className="btn-primary">
                        <Search size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Buscar por CPF
                    </button>
                    <button onClick={() => setMode('add-guest')} className="btn-outline">
                        <UserPlus size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Adicionar Convidado (Nome)
                    </button>
                </div>
            )}

            {mode === 'add-guest' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Novo Convidado</h3>
                    <input
                        type="text"
                        placeholder="Nome do convidado"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setMode('view')} className="btn-outline">Cancelar</button>
                        <button onClick={handleAddGuest} className="btn-primary">Adicionar</button>
                    </div>
                </div>
            )}

            {mode === 'add-cpf' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Buscar Cliente</h3>
                    <input
                        type="tel"
                        placeholder="CPF do cliente"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setMode('view')} className="btn-outline">Cancelar</button>
                        <button onClick={handleSearchCPF} className="btn-primary">Buscar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TablePeople;
