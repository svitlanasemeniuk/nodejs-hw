import { Router } from 'express';
import { celebrate } from 'celebrate'; // Імпортуємо celebrate[cite: 12]
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate); // Додаємо middleware для аутентифікації до всіх маршрутів /notes
// Застосовуємо celebrate як middleware для кожного маршруту[cite: 12]
router.get('/', celebrate(getAllNotesSchema), getAllNotes);
router.get('/:noteId', celebrate(noteIdSchema), getNoteById);
router.post('/', celebrate(createNoteSchema), createNote);
router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);
router.patch('/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
