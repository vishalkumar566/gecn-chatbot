import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api/chat"
    : "http://localhost:5000/api/chat");
const questions = [
  "What courses are available in the college?",
  "Tell me about hostel facilities.",
  "What information is available about fees?",
  "How can I contact the college?"
];
const nav = [
  ["⌂","Overview"],["🎓","Admissions"],["📚","Departments"],["💳","Fees"],
  ["🏠","Hostel"],["📢","Notices"],["📝","Exams"],["💼","Placements"]
];

function Message({m}) {
  const user=m.role==="user";
  return <div className={`message-line ${user?"user-line":""}`}>
    {!user && <div className="message-avatar">✦</div>}
    <div className={`message-bubble ${user?"user-bubble":""}`}>
      {!user && <div className="assistant-label">GECN AI</div>}
      {m.content}
    </div>
  </div>;
}

export default function App(){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [active,setActive]=useState("Overview");
  const [menu,setMenu]=useState(false);

  async function send(text=input){
    const clean=text.trim();
    if(!clean||loading)return;
    const history=[...messages,{role:"user",content:clean}];
    setMessages(history); setInput(""); setLoading(true);
    try{
      const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:clean,history})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Request failed");
      setMessages(x=>[...x,{role:"assistant",content:data.reply}]);
    }catch(e){
      console.error(e);
      setMessages(x=>[...x,{role:"assistant",content:"AI service se connection nahi ho pa raha. Backend aur API key check karo."}]);
    }finally{setLoading(false);}
  }

  function submit(e){e.preventDefault();send();}
  function newChat(){setMessages([]);setInput("");setActive("Overview");}

  return <div className="app-shell">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand"><div className="brand-mark">G</div><div><strong>GECN</strong><span>AI Assistant</span></div></div>
      <button className="new-chat" onClick={newChat}>＋ New chat</button>
      <nav className="nav"><p className="nav-title">COLLEGE</p>
        {nav.map(([icon,label])=><button key={label} className={active===label?"active":""} onClick={()=>{setActive(label);setMenu(false)}}><span>{icon}</span>{label}</button>)}
      </nav>
      <div className="sidebar-footer"><b>●</b><div><strong>AI Assistant</strong><span>College information</span></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setMenu(!menu)}>☰</button>
        <div><p className="topbar-title">{active}</p><p className="topbar-subtitle">GECN College AI Assistant</p></div>
        <div className="online"><i/> {loading?"Thinking...":"Online"}</div>
      </header>

      <div className="chat-area">
        {!messages.length ? <section className="welcome">
          <div className="welcome-orb">✦</div><p className="eyebrow">GECN AI ASSISTANT</p>
          <h2>How can I help you today?</h2>
          <p className="welcome-copy">Ask about admissions, departments, fees, hostel, exams, notices, placements and other college information.</p>
          <div className="suggestions">{questions.map(q=><button key={q} onClick={()=>send(q)}>↗ {q}</button>)}</div>
        </section> :
        <div className="messages">{messages.map((m,i)=><Message key={i} m={m}/>)}
          {loading&&<div className="message-line"><div className="message-avatar">✦</div><div className="message-bubble"><div className="assistant-label">GECN AI</div><div className="typing"><span/><span/><span/></div></div></div>}
        </div>}
      </div>

      <div className="composer-wrap">
        <form className="composer" onSubmit={submit}>
          <textarea rows="1" value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit(e)}}}
            placeholder="Ask anything about your college..."/>
          <button className="send" disabled={!input.trim()||loading}>↑</button>
        </form>
        <p className="disclaimer">AI can make mistakes. Official college documents should be treated as the final source of truth.</p>
      </div>
    </main>
  </div>;
}