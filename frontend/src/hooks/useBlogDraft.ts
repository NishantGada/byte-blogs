import { useCallback, useEffect, useRef } from "react";

export interface BlogDraft {
  title: string;
  category: string;
  coverImage: string;
  content: string;
}

interface UseBlogDraftOptions {
  key: string;
  values: BlogDraft;
  enabled?: boolean;
  onRestore: (draft: BlogDraft) => void;
}

const DEBOUNCE_MS = 500;

export function useBlogDraft({
  key,
  values,
  enabled = true,
  onRestore,
}: UseBlogDraftOptions) {
  const initializedKeyRef = useRef<string | null>(null);
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    if (!enabled) return;
    if (initializedKeyRef.current === key) return;
    initializedKeyRef.current = key;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<BlogDraft>;
      const restored: BlogDraft = {
        title: draft.title ?? "",
        category: draft.category ?? "",
        coverImage: draft.coverImage ?? "",
        content: draft.content ?? "",
      };
      const isEmpty =
        !restored.title &&
        !restored.category &&
        !restored.coverImage &&
        !restored.content;
      if (isEmpty) return;
      onRestoreRef.current(restored);
    } catch {
      // ignore corrupt drafts
    }
  }, [enabled, key]);

  const serialized = JSON.stringify(values);
  useEffect(() => {
    if (!enabled) return;
    if (initializedKeyRef.current !== key) return;
    const id = setTimeout(() => {
      localStorage.setItem(key, serialized);
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [enabled, key, serialized]);

  useEffect(() => {
    const dirty =
      !!values.title ||
      !!values.category ||
      !!values.coverImage ||
      !!values.content;
    if (!dirty || !enabled) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [
    enabled,
    values.title,
    values.category,
    values.coverImage,
    values.content,
  ]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { clearDraft };
}
