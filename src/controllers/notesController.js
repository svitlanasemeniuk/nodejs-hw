import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати всі нотатки
export const getAllNotes = async (req, res) => {
  const {
    tag,
    search,
    page: pageQuery = 1,
    perPage: perPageQuery = 10,
  } = req.query;

  const page = parseInt(pageQuery, 10);
  const perPage = parseInt(perPageQuery, 10);

  // Починаємо формувати ланцюжок запиту
  const myQuery = Note.find({
    userId: req.user._id, // Фільтруємо нотатки за користувачем
  });

  if (tag) {
    // Використовуємо метод .where()
    myQuery.where('tag').equals(tag);
  }

  if (search) {
    // Додаємо текстовий пошук через .where()
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const [notes, totalNotes] = await Promise.all([
    // myQuery.clone() дозволяє виконати зібраний ланцюжок запиту
    myQuery.clone().skip(skip).limit(limit),
    // myQuery.getFilter() дістає наші умови для підрахунку загальної кількості
    Note.countDocuments(myQuery.getFilter()),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ notes, page, perPage, totalPages, totalNotes });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нову нотатку
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Видалити нотатку за id
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).send(note);
};

// Оновити нотатку за id
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
