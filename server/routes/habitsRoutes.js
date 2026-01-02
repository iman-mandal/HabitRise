const express = require('express');
const router = express.Router();

const Habit = require('../models/habits');


// Create habit 
router.post('/createHabit', async (req, res) => {
    try {
        console.log("Req User ID:", req.userId);  

        if (!req.userId) {
            return res.status(400).json({ error: "User Not Found in Token" });
        }

        const habit = await Habit.create({
            title: req.body.title,
            user: req.userId
        });

        res.json({ message: "Habit created", habit });

    } catch (err) {
        console.log("Habit Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//get all habits
router.get('/', async (req, res) => {
    try {
        const habit = await Habit.find({ user: req.userId });
        console.log('Habit fetched sucessfully');
        res.json(habit);
    } catch (err) {
        console.log(err);
        res.json({ err: 'Internal server error' });
    }
});

//update Habit
router.put('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
        if (!habit) { return res.status(404).json({ message: 'Can not find habit' }) };
        res.json(habit);
        console.log('Habit Updated sucessfully');
    } catch (err) {
        console.log(err);
        res.json({ err: 'Internal Server Error' });
    }
});

//Delete haboits 
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) { return res.status(404).json({ message: 'Order not found!' }) };
        // Check owner
        if (habit.user.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not allowed to delete this habit" });
        }
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Delete the habit' });
        console.log('Habit Deleted  sucessfully');
    } catch (err) {
        console.log(err);
        res.json({ err: 'Internal Server Error' });
    }
});

//complitation date
router.post('/:id/toggle', async (req, res) => {
try{
    const { date } = req.body;
    const day = date || new Date().toISOString().slice(0, 10);
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    if (!habit) { return res.status(404).json({ message: 'Habit not found !' }); }
    if (habit.user.toString() !== req.userId) {
        return res.status(403).json({ message: "You are not allowed to edit completion this habit" });
    }
    const index = habit.history.findIndex(i => i.date == day);
    if (index >= 0) {
        habit.history[index].completed = !habit.history[index].completed;
    } else {
        habit.history.push({ date: day, completed: true });
    }
    //handle streck and longest streck

    const setHistory = new Set(habit.history.filter(i => i.completed).map(i => i.date));
    let streck = 0;
    let longest = habit.longestStreak || 0;
    let curr = day;
    while (setHistory.has(curr)) {
        streck++;
        curr = new Date(new Date(curr).getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }
    const completedDates = [...setHistory].sort();
    let maxStreak = 0, curStreak = 0, prev = null;
    for (const d of completedDates) {
        if (prev === null) { curStreak = 1; }
        else {
            const prevDate = new Date(prev);
            const thisDate = new Date(d);
            if ((thisDate - prevDate) === 24 * 60 * 60 * 1000) curStreak++;
            else curStreak = 1;
        }
        if (curStreak > maxStreak) maxStreak = curStreak;
        prev = d;
    }
    habit.streak = streck;
    habit.longestStreak = Math.max(maxStreak, habit.longestStreak || 0);
    await habit.save();
    res.json(habit);
}catch(err){
    console.log(err);
    res.json({message:'Internal server Error'});
}
});

module.exports = router;