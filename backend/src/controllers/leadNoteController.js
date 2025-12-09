import pool from '../config/database.js';

/**
 * Get all notes for a lead
 * GET /api/admin/leads/:id/notes
 */
export const getLeadNotes = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);

    if (!leadId || isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid lead ID',
          statusCode: 400
        }
      });
    }

    // Check if lead exists
    const checkLeadQuery = 'SELECT id FROM leads WHERE id = $1';
    const checkLeadResult = await pool.query(checkLeadQuery, [leadId]);

    if (checkLeadResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: 'Lead not found',
          statusCode: 404
        }
      });
    }

    // Get notes with user info
    const query = `
      SELECT
        lead_notes.id,
        lead_notes.lead_id,
        lead_notes.note_text,
        lead_notes.created_at,
        lead_notes.updated_at,
        users.id as user_id,
        users.name as user_name,
        users.email as user_email
      FROM lead_notes
      LEFT JOIN users ON lead_notes.user_id = users.id
      WHERE lead_notes.lead_id = $1
      ORDER BY lead_notes.created_at DESC
    `;

    const result = await pool.query(query, [leadId]);

    const notes = result.rows.map(row => ({
      id: row.id,
      lead_id: row.lead_id,
      note_text: row.note_text,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email
      }
    }));

    return res.status(200).json({
      success: true,
      data: notes
    });

  } catch (error) {
    console.error('Get lead notes error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching notes',
        statusCode: 500
      }
    });
  }
};

/**
 * Create a new note for a lead
 * POST /api/admin/leads/:id/notes
 */
export const createLeadNote = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const { note_text } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!leadId || isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid lead ID',
          statusCode: 400
        }
      });
    }

    // Validate note_text
    if (!note_text || note_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Note text is required',
          details: [
            { field: 'note_text', message: 'Note text cannot be empty' }
          ],
          statusCode: 400
        }
      });
    }

    if (note_text.length > 1000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Note text is too long',
          details: [
            { field: 'note_text', message: 'Note text must be 1000 characters or less' }
          ],
          statusCode: 400
        }
      });
    }

    // Check if lead exists
    const checkLeadQuery = 'SELECT id FROM leads WHERE id = $1';
    const checkLeadResult = await pool.query(checkLeadQuery, [leadId]);

    if (checkLeadResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: 'Lead not found',
          statusCode: 404
        }
      });
    }

    // Create note
    const insertQuery = `
      INSERT INTO lead_notes (lead_id, user_id, note_text)
      VALUES ($1, $2, $3)
      RETURNING id, lead_id, user_id, note_text, created_at, updated_at
    `;

    const result = await pool.query(insertQuery, [leadId, userId, note_text.trim()]);
    const note = result.rows[0];

    // Get user info
    const userQuery = 'SELECT id, name, email FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const user = userResult.rows[0];

    return res.status(201).json({
      success: true,
      data: {
        id: note.id,
        lead_id: note.lead_id,
        note_text: note.note_text,
        created_at: note.created_at,
        updated_at: note.updated_at,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      message: 'Note created successfully'
    });

  } catch (error) {
    console.error('Create lead note error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating note',
        statusCode: 500
      }
    });
  }
};

/**
 * Delete a note
 * DELETE /api/admin/leads/notes/:noteId
 */
export const deleteLeadNote = async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId);
    const userId = req.user.id; // From auth middleware

    if (!noteId || isNaN(noteId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid note ID',
          statusCode: 400
        }
      });
    }

    // Check if note exists and belongs to user
    const checkQuery = 'SELECT id, user_id FROM lead_notes WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [noteId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTE_NOT_FOUND',
          message: 'Note not found',
          statusCode: 404
        }
      });
    }

    const note = checkResult.rows[0];

    // Only allow user to delete their own notes
    if (note.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only delete your own notes',
          statusCode: 403
        }
      });
    }

    // Delete note
    const deleteQuery = 'DELETE FROM lead_notes WHERE id = $1';
    await pool.query(deleteQuery, [noteId]);

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead note error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deleting note',
        statusCode: 500
      }
    });
  }
};
