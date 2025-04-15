import React, { useState } from 'react';

export default function StablaDemo() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Dobrý den, jsem Stabla – vaše průvodkyně světem BCP. Jak vám mohu pomoci?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'cs-CZ';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-abc1234567890...` // ← nahraď svým klíčem
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Jsi přátelská, ale formální asistentka jménem Stabla. Pomáháš zákazníkům s produkty BCP: kapky, mast a šampon. Mluvíš česky, jednoduše a srozumitelně.' },
            ...messages.map(msg => ({ role: msg.from === 'user' ? 'user' : 'assistant', content: msg.text })),
            { role: 'user', content: input }
          ]
        })
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content;
      const botMessage = { from: 'bot', text: aiReply };
      setMessages((prev) => [...prev, botMessage]);
      speak(aiReply);
    } catch (error) {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Omlouvám se, došlo k chybě při zpracování odpovědi.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🌿 Stabla – BCP asistentka</h1>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.from === 'bot' ? 'Stabla' : 'Vy'}:</strong> {msg.text}</div>
        ))}
        {loading && <div style={{ color: 'green' }}>Stabla přemýšlí…</div>}
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