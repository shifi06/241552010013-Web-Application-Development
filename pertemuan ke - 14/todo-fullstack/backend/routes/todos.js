const router = require('express').Router();
const prisma = require('../db');

// GET semua todo
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST todo baru
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ message: 'Text cannot be empty' });
  }
  try {
    const todo = await prisma.todo.create({
      data: { text: text.trim() }
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH toggle done
router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { done: req.body.done }
    });
    res.json(todo);
  } catch (error) {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Todo not found' });
  }
});

module.exports = router;