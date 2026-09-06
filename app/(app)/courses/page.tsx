"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubjectSidebar } from "@/components/courses/subject-sidebar";
import { NoteList } from "@/components/courses/note-list";
import { RichEditor } from "@/components/courses/rich-editor";
import { useCourseNotesStore } from "@/lib/store/courses";

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
const CONTENT_SAVE_DELAY = 600;

export default function CoursesPage() {
  const notes = useCourseNotesStore((s) => s.items);
  const addNote = useCourseNotesStore((s) => s.add);
  const updateNote = useCourseNotesStore((s) => s.update);
  const removeNote = useCourseNotesStore((s) => s.remove);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | "all">("all");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(
    () => (selectedSubjectId === "all" ? notes : notes.filter((n) => n.subject_id === selectedSubjectId)),
    [notes, selectedSubjectId]
  );

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  // Reset the local title draft when switching notes — adjusted during
  // render (not an effect) since it's a plain derived-state reset.
  const [titleForNoteId, setTitleForNoteId] = useState<string | null>(null);
  if ((selectedNote?.id ?? null) !== titleForNoteId) {
    setTitleForNoteId(selectedNote?.id ?? null);
    setTitle(selectedNote?.title ?? "");
  }

  // Debounced per-note so autosave doesn't hit the network on every
  // keystroke, keyed by note id so switching notes mid-typing can never
  // let a stale timer overwrite the wrong note.
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  useEffect(() => {
    const timers = saveTimers.current;
    return () => {
      for (const timeout of timers.values()) clearTimeout(timeout);
    };
  }, []);

  function handleContentChange(noteId: string, json: JSONContent) {
    const timers = saveTimers.current;
    const existing = timers.get(noteId);
    if (existing) clearTimeout(existing);
    timers.set(
      noteId,
      setTimeout(() => {
        updateNote(noteId, { content: json as Record<string, unknown> });
        timers.delete(noteId);
      }, CONTENT_SAVE_DELAY)
    );
  }

  function createNote() {
    const note = addNote({
      title: "Sans titre",
      subject_id: selectedSubjectId === "all" ? undefined : selectedSubjectId,
      content: EMPTY_DOC as Record<string, unknown>,
    });
    setSelectedNoteId(note.id);
  }

  function deleteNote(id: string) {
    removeNote(id);
    setSelectedNoteId(null);
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Cours</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Tes notes de cours, organisées par matière.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <SubjectSidebar
          selectedId={selectedSubjectId}
          onSelect={(id) => {
            setSelectedSubjectId(id);
            setSelectedNoteId(null);
          }}
        />
        <NoteList notes={filteredNotes} selectedId={selectedNoteId} onSelect={setSelectedNoteId} onCreate={createNote} />

        <div className="glass shadow-soft min-w-0 flex-1 rounded-2xl p-4">
          {selectedNote ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => title.trim() && updateNote(selectedNote.id, { title: title.trim() })}
                  placeholder="Titre de la note"
                  className="border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon-sm" onClick={() => deleteNote(selectedNote.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <RichEditor
                key={selectedNote.id}
                content={selectedNote.content as JSONContent}
                onChange={(json) => handleContentChange(selectedNote.id, json)}
              />
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
              <p>Sélectionne une note à gauche, ou crée-en une nouvelle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
