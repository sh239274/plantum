import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Note } from '../../types';
import { formatAppDate, formatNum } from '../../utils/jalali';
import {
  FileText,
  Plus,
  Pin,
  Archive,
  Trash2,
  Search,
  Folder,
  Tag,
  Edit3,
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    settings,
    t,
  } = useApp();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Active note
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || notes[0];
  }, [notes, selectedNoteId]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((tg) => tg.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [notes, searchQuery]);

  const handleCreateNewNote = () => {
    const newId = addNote({
      title: 'یادداشت جدید',
      content: 'متن خود را اینجا بنویسید...',
      folder: 'عمومی',
      tags: [],
      isPinned: false,
      isArchived: false,
    });
    setSelectedNoteId(newId);
    setIsEditing(true);
  };

  const handleTogglePin = (note: Note) => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  return (
    <div id="plantom-notes-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navNotes} ({formatNum(notes.length, settings.usePersianNumerals)})
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            دفترچه یادداشت‌های ساختاریافته با پشتیبانی از مارک‌داون و دسته‌بندی
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newNote}</span>
        </button>
      </div>

      {/* Main 2-Col Layout: List + Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Notes List */}
        <div className="space-y-3 lg:col-span-1">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-neutral-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 rtl:pr-9 rtl:pl-3"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-neutral-200/80 bg-white hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {note.title}
                    </h3>
                    {note.isPinned && (
                      <Pin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>
                      {formatAppDate(
                        note.updatedAt,
                        settings.calendarType,
                        settings.language,
                        settings.usePersianNumerals,
                        { format: 'short' }
                      )}
                    </span>
                    {note.folder && (
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                        {note.folder}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2-Cols: Active Note Workspace */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 flex flex-col min-h-[500px]">
              {/* Note Header & Actions */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {activeNote.folder || 'عمومی'}
                  </span>
                  <span className="text-xs text-neutral-400">
                    آخرین ویرایش:{' '}
                    {formatAppDate(
                      activeNote.updatedAt,
                      settings.calendarType,
                      settings.language,
                      settings.usePersianNumerals,
                      { format: 'short' }
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePin(activeNote)}
                    className={`rounded-xl p-2 transition ${
                      activeNote.isPinned
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                        : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    title={t.pin}
                  >
                    <Pin className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="rounded-xl p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="mt-4 w-full bg-transparent text-lg font-black text-neutral-900 outline-none dark:text-neutral-100 sm:text-xl"
                placeholder="عنوان یادداشت..."
              />

              {/* Content Textarea */}
              <textarea
                rows={14}
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                className="mt-4 flex-1 w-full bg-transparent text-xs sm:text-sm text-neutral-800 outline-none leading-relaxed resize-none dark:text-neutral-200"
                placeholder="اینجا بنویسید..."
              />
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
              یادداشتی انتخاب نشده است
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
