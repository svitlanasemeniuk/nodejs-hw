import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

//Отримати всі нотатки
export const getAllNotes = async (req, res) => {
  const {
    tag,
    search,
    page: pageQuery = 1,
    perPage: perPageQuery = 10,
  } = req.query;

  //Створюємо змінні page та perPage, перетворюючи значення на числа
  const page = parseInt(pageQuery, 10);
  const perPage = parseInt(perPageQuery, 10);

  const query = {};

  if (tag) {
    query.tag = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const [notes, totalNotes] = await Promise.all([
    Note.find(query).skip(skip).limit(limit),
    Note.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ notes, page, perPage, totalPages, totalNotes });
};

//Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

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
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Оновити нотатку за id
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
