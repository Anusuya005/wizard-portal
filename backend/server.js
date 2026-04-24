const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ PUT YOUR NON-SRV URL HERE
mongoose.connect("mongodb://Anusuya:Anu123@ac-9gav8wu-shard-00-00.ggmyi2y.mongodb.net:27017,ac-9gav8wu-shard-00-01.ggmyi2y.mongodb.net:27017,ac-9gav8wu-shard-00-02.ggmyi2y.mongodb.net:27017/?ssl=true&replicaSet=atlas-poxbzi-shard-0&authSource=admin&appName=Wizard-Portal")
.then(() => console.log("DB Connected"))
.catch(err => console.log("DB Error:", err));

/* USER SCHEMA */
const User = mongoose.model("User", {
  name: String,
  password: String,
  house: String,
  score: { type: Number, default: 0 }
});

/* AUTH */

// Signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("User created");
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.send(user ? "Success" : "Fail");
});

/* 🧠 QUIZ QUESTIONS */

const questions = [
  {
    question: "What quality do you value most?",
    options: {
      Brave: "Gryffindor",
      Ambitious: "Slytherin",
      Intelligent: "Ravenclaw",
      Loyal: "Hufflepuff"
    }
  },
  {
    question: "Pick a pet:",
    options: {
      Lion: "Gryffindor",
      Snake: "Slytherin",
      Eagle: "Ravenclaw",
      Badger: "Hufflepuff"
    }
  },
  {
    question: "Favorite subject?",
    options: {
      Defense: "Gryffindor",
      Potions: "Slytherin",
      Charms: "Ravenclaw",
      Herbology: "Hufflepuff"
    }
  },
  {
    question: "Your personality?",
    options: {
      Bold: "Gryffindor",
      Cunning: "Slytherin",
      Curious: "Ravenclaw",
      Kind: "Hufflepuff"
    }
  },
  {
    question: "What drives you?",
    options: {
      Courage: "Gryffindor",
      Power: "Slytherin",
      Knowledge: "Ravenclaw",
      Friendship: "Hufflepuff"
    }
  }
];

// GET quiz
app.get("/quiz", (req, res) => {
  res.json(questions);
});

// POST quiz result
app.post("/quiz-result", async (req, res) => {
  const answers = req.body.answers;

  const score = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0
  };

  answers.forEach(ans => {
    score[ans]++;
  });

  const house = Object.keys(score).reduce((a, b) =>
    score[a] > score[b] ? a : b
  );

  await User.updateOne({ name: req.body.name }, { house });

  res.json({ house });
});

/* ✨ SPELL */
app.get("/spell", (req, res) => {
  const spells = ["Expelliarmus", "Lumos", "Expecto Patronum", "Stupefy"];
  const spell = spells[Math.floor(Math.random() * spells.length)];
  res.json({ spell });
});

/* ⚔ DUEL */
app.get("/duel", (req, res) => {
  const spells = ["Expelliarmus", "Stupefy", "Protego"];
  const userSpell = spells[Math.floor(Math.random() * spells.length)];
  const enemySpell = spells[Math.floor(Math.random() * spells.length)];
  const winner = Math.random() > 0.5 ? "You" : "Enemy";

  res.json({ userSpell, enemySpell, winner });
});

/* ⚡ SCORE */
app.post("/score", async (req, res) => {
  await User.updateOne(
    { name: req.body.name },
    { $inc: { score: req.body.points } }
  );
  res.send("Score updated");
});

/* 🏆 LEADERBOARD */
app.get("/leaderboard", async (req, res) => {
  const data = await User.find().sort({ score: -1 }).limit(5);
  res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));