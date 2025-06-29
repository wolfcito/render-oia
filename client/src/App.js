import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar mensajes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Mensajes desde MySQL</h1>
      {loading ? (
        <p>Cargando mensajes…</p>
      ) : messages.length > 0 ? (
        <ul>
          {messages.map(msg => (
            <li key={msg.id}>{msg.message}</li>
          ))}
        </ul>
      ) : (
        <p>No hay mensajes aún.</p>
      )}
    </div>
  );
}

export default App;
