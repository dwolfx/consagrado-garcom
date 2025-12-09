# Garçom (Staff App) 💁‍♂️

Aplicativo mobile-first para a equipe de atendimento (garçons).

## 🛠️ Tecnologias
- **Frontend**: React (Vite)
- **Backend/Database**: Supabase (PostgreSQL + Realtime)
- **Estilização**: CSS Modules (Vanilla)
- **Icons**: Lucide React

## 🚀 Como Rodar
```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Build de produção
npm run build
```

---

## 📱 Operação Mobile
App otimizado para uso em pé, com uma mão só.
*   **Acesso Rápido**: Login via **PIN de 4 dígitos** (Ex: 1234).

## ⚡ Poderes do Garçom
1.  **Fila de Atendimento**:
    *   Priorização automática de quem está chamando.
2.  **Gestão de Pessoas (Diferencial)**:
    *   **Adicione Clientes**: Busque por CPF ou nome.
    *   **Pedido Direcionado**: Lance o item "Heineken" direto para o "João". A conta fecha sozinha.
3.  **Alertas**:
    *   Notificações vibratórias de novos chamados e pagamentos.

---

## 🚧 Limitações Atuais (Dados & MVP)
Assim como no app B2C, algumas funcionalidades são simuladas neste estágio:

1.  **Login (`Login.jsx`)**:
    *   **PIN Fixo**: Usa PIN fixo `1234`. Não valida contra tabela de usuários no banco.
    *   **Usuário Fixo**: Loga sempre como o garçom "João" ou "Garçom 1".

2.  **Ações de Mesa (`TablePeople.jsx`)**:
    *   **Fechar Conta**: O botão exibe um `alert` e limpa a tela, mas **não altera o status da mesa** no banco de dados e não gera histórico financeiro real.
    *   **Adicionar Pedido**: O fluxo de adicionar itens é funcional, inserindo na tabela `orders`.

3.  **Perfil (`WaiterProfile.jsx`)**:
    *   **Estatísticas**: Os valores de "Gorjetas" (R$ 45,00) e "Mesas Atendidas" (12) são estáticos para demonstração.
    *   **Escala**: Turnos e horários são apenas visuais (não vêm do banco).

4.  **Gestão de Pessoas**:
    *   A funcionalidade de "Cadastrar CPF" ou "Adicionar Convidado" foi simplificada/removida para focar no fluxo de pedidos e alertas.
