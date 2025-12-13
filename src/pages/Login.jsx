import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/api';
import { User, Lock, Hash, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Auth, 2: Check-in

    // Step 1: Auth
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Check-in
    const [dailyCode, setDailyCode] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            try {
                // Standard Auth Only for Beta
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                if (data.user) {
                    // Fetch profile
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    localStorage.setItem('waiter_user', JSON.stringify(profile));
                    setStep(2);
                }
            } catch (err) {
                console.error(err);
                setError('Login falhou. Verifique suas credenciais.');
            } finally {
                setLoading(false);
            }
        };

        const handleCheckIn = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            try {
                const user = JSON.parse(localStorage.getItem('waiter_user'));

                // SECURITY UPDATE: Server-side validation via RPC
                const { data: success, error: rpcError } = await supabase.rpc('check_in_waiter', {
                    waiter_id: user.id,
                    input_code: dailyCode
                });

                if (rpcError) throw rpcError;

                if (!success) {
                    throw new Error('Código incorreto. Verifique com o gerente.');
                }

                // If success, user is already updated in DB `users` by the RPC.
                // Just update local storage if needed or just nav.
                const updatedUser = {
                    ...user,
                    shift_start: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                };
                localStorage.setItem('waiter_user', JSON.stringify(updatedUser)); // Optimistic update

                navigate('/');
            } catch (err) {
                console.error(err);
                setError(err.message || 'Erro ao validar código.');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div style={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--primary)', width: '64px', height: '64px', borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
                    }}>
                        {step === 1 ? <User size={32} color="white" /> : <Hash size={32} color="white" />}
                    </div>
                    <h1>{step === 1 ? 'Bem-vindo' : 'Iniciar Turno'}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {step === 1 ? 'Faça login para continuar.' : 'Digite o código do dia para fazer check-in.'}
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', width: '100%', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <User size={20} color="#94a3b8" />
                            <input
                                type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="input-group">
                            <Lock size={20} color="#94a3b8" />
                            <input
                                type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                            {loading ? 'Acessando...' : 'Entrar'} <ArrowRight size={20} />
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                            Garçom Demo: garcom@demo.com / demo
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleCheckIn} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            {[0, 1, 2, 3].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    value={dailyCode[i] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!/^\d*$/.test(val)) return;
                                        const newCode = dailyCode.split('');
                                        newCode[i] = val;
                                        setDailyCode(newCode.join(''));
                                        // Auto focus next logic could go here but keeping it simple
                                        if (val && e.target.nextSibling) e.target.nextSibling.focus();
                                    }}
                                    style={{
                                        width: '60px', height: '80px', fontSize: '2rem', textAlign: 'center',
                                        borderRadius: '12px', border: '2px solid var(--border-color)',
                                        background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 'bold'
                                    }}
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading || dailyCode.length < 4} style={{ marginTop: '1rem', justifyContent: 'center' }}>
                            {loading ? 'Validando...' : 'Fazer Check-in'} <CheckCircle size={20} />
                        </button>
                    </form>
                )}

                {/* CSS Helper for Inputs */}
                <style>{`
                .input-group {
                    display: flex; alignItems: center; gap: 0.5rem;
                    background: var(--bg-secondary); padding: 1rem;
                    borderRadius: 12px; border: 1px solid var(--border-color);
                }
                .btn-primary {
                    background: var(--primary); color: white; padding: 1rem;
                    borderRadius: 12px; border: none; font-weight: bold; font-size: 1rem;
                    cursor: pointer; display: flex; alignItems: center; gap: 0.5rem; transition: 0.2s;
                }
                .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
            `}</style>
            </div>
        );
    };

    export default Login;
