import React, { useState } from 'react';

export default function StablaDemo() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Dobrý den, jsem Stabla – vaše průvodkyně světem BCP. Jak vám mohu pomoci?' },
  ]);
  const [input, setInput] = useState('');

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'cs-CZ';
    speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botReply = 'Zatím je toto demo. Připravujeme napojení na AI.';
    const botMessage = { from: 'bot', text: botReply };
    setMessages((prev) => [...prev, botMessage]);
    speak(botReply);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🌿 Stabla – BCP asistentka</h1>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.from === 'bot' ? 'Stabla' : 'Vy'}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Zeptejte se na kapky, mast nebo šampon…"
        style={{ padding: 8, width: '80%', marginRight: 8 }}
      />
      <button onClick={handleSend}>Odeslat</button>
    </div>
  );
}