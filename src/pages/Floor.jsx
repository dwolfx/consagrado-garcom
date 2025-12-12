import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, supabase } from '../services/api';
import { Bell, User, ChevronRight, Clock, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const ShiftTimer = ({ startStr, endStr }) => {
    const [elapsed, setElapsed] = useState('');
    const [isOvertime, setIsOvertime] = useState(false);
    const [overtimeDuration, setOvertimeDuration] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = dayjs();
            const todayStr = now.format('YYYY-MM-DD');

            // Parse Start (Handle "15:00" format)
            const startTime = dayjs(`${todayStr} ${startStr}`, 'YYYY-MM-DD HH:mm');
            const endTime = endStr ? dayjs(`${todayStr} ${endStr}`, 'YYYY-MM-DD HH:mm') : null;

            // If start time is "tomorrow" logic implies crossing date boundary. keeping it simple for demo.
            const diff = now.diff(startTime);
            const dur = dayjs.duration(diff);
            setElapsed(dur.format('HH:mm:ss'));

            // Overtime Check
            if (endTime && now.isAfter(endTime)) {
                setIsOvertime(true);
                const otDiff = now.diff(endTime);
                setOvertimeDuration(dayjs.duration(otDiff).format('HH:mm'));
            } else {
                setIsOvertime(false);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [startStr, endStr]);

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: isOvertime ? '#fee2e2' : 'rgba(255,255,255,0.1)',
            padding: '0.5rem 1rem', borderRadius: '12px',
            color: isOvertime ? '#ef4444' : 'var(--text-secondary)',
            fontWeight: 'bold', fontSize: '0.9rem',
            border: isOvertime ? '1px solid #ef4444' : 'none',
            marginTop: '0.5rem', width: 'fit-content'
        }}>
            {isOvertime ? <AlertTriangle size={16} /> : <Clock size={16} />}
            {isOvertime ? `EXTRA: +${overtimeDuration}` : elapsed}
        </div>
    );
};

const Floor = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [waiter, setWaiter] = useState(null);

    useEffect(() => {
        // Load User Session
        const session = localStorage.getItem('waiter_user');
        if (!session) {
            navigate('/login');
            return;
        }
        setWaiter(JSON.parse(session));

        const load = async () => {
            const data = await api.getTables();
            // Process tables
            setTables(data.map(t => ({
                ...t,
                callWaiter: t.orders?.some(o => o.name === '🔔 CHAMAR GARÇOM' && o.status !== 'completed'),
                total: t.orders?.reduce((acc, o) => acc + (o.price * o.quantity), 0) || 0
            })));
            setLoading(false);
        };
        load();

        const channel = supabase
            .channel('waiter-floor')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, load)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [navigate]);

    const handleLogout = async () => {
        if (!waiter) return;

        // Check-out logic
        await supabase.from('users').update({ is_working_now: false }).eq('id', waiter.id);

        localStorage.removeItem('waiter_user');
        navigate('/login');
    };

    const handleAttendCall = async (e, tableId) => {
        e.stopPropagation();
        // Close calls for this table
        // We need to implement this API method if it's missing or use standard api
        // Assuming api.closeWaitCalls exists or we simulate
        // For now, let's just mark orders as delivered directly via supabase to be safe
        const { error } = await supabase
            .from('orders')
            .update({ status: 'delivered' })
            .eq('table_id', tableId)
            .eq('name', '🔔 CHAMAR GARÇOM')
            .neq('status', 'delivered'); // Update only pending ones

        if (error) console.error(error);
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Carregando...</div>;

    // Filter Calls
    const activeCalls = tables.filter(t => t.callWaiter);
    const sortedTables = [...tables].sort((a, b) => a.number - b.number);

    return (
        <div style={{ padding: '1.5rem', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>

            {/* Header */}
            <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Olá, {waiter?.name?.split(' ')[0]}</h1>
                    {waiter?.shift_start ? (
                        <ShiftTimer startStr={waiter.shift_start} endStr={waiter.shift_end} />
                    ) : <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Turno não iniciado</span>}
                </div>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                    <LogOut size={24} />
                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>SAIR</div>
                </button>
            </header>

            {/* Active Calls Priority Widget */}
            {activeCalls.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={18} className="pulse" /> CHAMADOS URGENTES ({activeCalls.length})
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {activeCalls.map(t => (
                            <div key={t.id} className="card-danger" style={{
                                background: '#fef2f2', border: '1px solid #ef4444', padding: '1rem', borderRadius: '12px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', color: '#ef4444' }}>Mesa {t.number}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>Solicitou atendimento</span>
                                </div>
                                <button
                                    onClick={(e) => handleAttendCall(e, t.id)}
                                    style={{
                                        background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem',
                                        borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    <CheckCircle size={18} /> Atender
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Tables Grid */}
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Salão</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {sortedTables.map(table => (
                    <div
                        key={table.id}
                        className={`card table-card`}
                        style={{
                            background: table.status === 'occupied' ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.02)',
                            border: table.status === 'occupied' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            opacity: table.status === 'free' ? 0.7 : 1,
                            padding: '1rem', borderRadius: '12px', cursor: 'pointer'
                        }}
                        onClick={() => navigate(table.status === 'free' ? `/take-order/${table.id}` : `/mesa/${table.id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>#{table.number}</span>
                            {table.status === 'occupied' ? <User size={16} color="var(--primary)" /> : <span style={{ fontSize: '0.8rem' }}>Livre</span>}
                        </div>

                        {table.status === 'occupied' ? (
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                    R$ {table.total.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ver detalhes</div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Toque para abrir</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Floor;
