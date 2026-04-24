import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("intro");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  const [house, setHouse] = useState("");
  const [spell, setSpell] = useState("");
  const [duel, setDuel] = useState({});
  const [reaction, setReaction] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const [sorting, setSorting] = useState(false);

  /* 🎵 BACKGROUND MUSIC (FIXED WARNING) */
  useEffect(() => {
    const bgMusic = new Audio("https://www.soundjay.com/ambient/ambient-1.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.2;

    bgMusic.play().catch(() => {});

    return () => {
      bgMusic.pause();
    };
  }, []);

  /* ✨ CURSOR MAGIC */
  useEffect(() => {
    const handler = (e) => {
      const dot = document.createElement("div");
      dot.className = "spark";
      dot.style.left = e.pageX + "px";
      dot.style.top = e.pageY + "px";
      document.body.appendChild(dot);

      setTimeout(() => dot.remove(), 400);
    };

    document.addEventListener("mousemove", handler);

    return () => {
      document.removeEventListener("mousemove", handler);
    };
  }, []);

  /* 🔊 SOUND */
  const spellSound = new Audio("https://www.soundjay.com/magic/magic-1.mp3");

  /* AUTH */
  const signup = async () => {
    await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, password })
    });
    alert("Registered!");
  };

  const login = async () => {
    await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, password })
    });
    setPage("actions");
  };

  /* QUIZ */
  const getQuiz = async () => {
    const res = await fetch("http://localhost:5000/quiz");
    const data = await res.json();
    setQuestions(data);
    setAnswers([]);
    setQIndex(0);
    setPage("quiz");
  };

  const answerQuestion = async (houseChoice) => {
    const newAnswers = [...answers, houseChoice];
    setAnswers(newAnswers);

    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1);
    } else {
      const res = await fetch("http://localhost:5000/quiz-result", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, answers: newAnswers })
      });

      const data = await res.json();

      setSorting(true);

      setTimeout(() => {
        setHouse(data.house);
        setSorting(false);
        setPage("result");
      }, 3000);
    }
  };

  /* SPELL */
  const castSpell = async () => {
    spellSound.play();
    const res = await fetch("http://localhost:5000/spell");
    const data = await res.json();
    setSpell(data.spell);
    setPage("result");
  };

  /* DUEL */
  const startDuel = async () => {
    const res = await fetch("http://localhost:5000/duel");
    const data = await res.json();
    setDuel(data);
    setPage("duel");
  };

  /* REACTION */
  const startReaction = () => {
    setReaction("Wait...");
    setTimeout(() => {
      setReaction("CLICK!");
      setStartTime(Date.now());
    }, Math.random() * 3000 + 1000);
  };

  const handleClick = () => {
    if (reaction === "CLICK!") {
      const time = Date.now() - startTime;
      alert(`⚡ ${time} ms`);
      setPage("actions");
    }
  };

  return (
    <div className="App">
      <div>

        {/* 🎬 INTRO */}
        {page === "intro" && (
          <div className="fade">
            <h1>✨ Wizard Portal ✨</h1>
            <button onClick={() => setPage("login")}>Enter</button>
          </div>
        )}

        {/* 🔐 LOGIN */}
        {page === "login" && (
          <div className="fade">
            <h1>Login</h1>
            <input placeholder="Username" onChange={(e)=>setName(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
            <button onClick={signup}>Signup</button>
            <button onClick={login}>Login</button>
          </div>
        )}

        {/* 🎮 ACTIONS */}
        {page === "actions" && (
          <div className="fade">
            <h1>Choose Action</h1>
            <button onClick={getQuiz}>🎩 Sorting Quiz</button>
            <button onClick={castSpell}>✨ Cast Spell</button>
            <button onClick={startDuel}>⚔ Duel</button>
            <button onClick={() => { setPage("reaction"); startReaction(); }}>
              ⚡ Reaction Test
            </button>
          </div>
        )}

        {/* 🧠 QUIZ */}
        {page === "quiz" && questions.length > 0 && (
          <div className="fade">
            <h2>{questions[qIndex].question}</h2>

            {Object.entries(questions[qIndex].options).map(([text, house]) => (
              <button key={text} onClick={() => answerQuestion(house)}>
                {text}
              </button>
            ))}
          </div>
        )}

        {/* 🎩 SORTING */}
        {sorting && (
          <div className="sorting-screen">
            <h1 className="hat">🎩</h1>
            <h2>The Sorting Hat is deciding...</h2>
          </div>
        )}

        {/* 🎇 RESULT */}
        {page === "result" && (
          <div className={`result ${house}`}>
            <h2>{house && `🏆 ${house}`}</h2>
            <h2>{spell && `✨ ${spell}`}</h2>
            <button onClick={() => setPage("actions")}>Back</button>
          </div>
        )}

        {/* ⚔ DUEL */}
        {page === "duel" && (
          <div className="duel fade">
            <h2>⚔ Duel</h2>
            <h3>You: {duel.userSpell}</h3>
            <h3>Enemy: {duel.enemySpell}</h3>
            <h2>{duel.winner} Wins!</h2>
            <button onClick={() => setPage("actions")}>Back</button>
          </div>
        )}

        {/* ⚡ REACTION */}
        {page === "reaction" && (
          <div className="fade">
            <h2 className="reaction" onClick={handleClick}>
              {reaction}
            </h2>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;