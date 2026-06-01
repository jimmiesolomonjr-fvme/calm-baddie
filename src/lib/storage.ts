/**
 * LocalStorage-based save system for coloring progress and completed art.
 */

export interface SavedArt {
  id: string;
  imageId: string;
  imageName: string;
  thumbnail: string; // base64 data URL
  canvasData: string; // base64 data URL of full canvas
  createdAt: number;
  updatedAt: number;
  completed: boolean;
}

const STORAGE_KEY = "calm-baddie-art";

function getSavedArtList(): SavedArt[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSavedArtList(list: SavedArt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function saveProgress(
  imageId: string,
  imageName: string,
  canvasDataUrl: string,
  thumbnailDataUrl: string,
  completed = false
): SavedArt {
  const list = getSavedArtList();
  const existing = list.find((a) => a.imageId === imageId);

  if (existing) {
    existing.canvasData = canvasDataUrl;
    existing.thumbnail = thumbnailDataUrl;
    existing.updatedAt = Date.now();
    existing.completed = completed || existing.completed;
    saveSavedArtList(list);
    return existing;
  }

  const newArt: SavedArt = {
    id: crypto.randomUUID(),
    imageId,
    imageName,
    canvasData: canvasDataUrl,
    thumbnail: thumbnailDataUrl,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed,
  };

  list.unshift(newArt);
  saveSavedArtList(list);
  return newArt;
}

export function loadProgress(imageId: string): SavedArt | null {
  const list = getSavedArtList();
  return list.find((a) => a.imageId === imageId) ?? null;
}

export function getAllSavedArt(): SavedArt[] {
  return getSavedArtList();
}

export function deleteSavedArt(id: string) {
  const list = getSavedArtList().filter((a) => a.id !== id);
  saveSavedArtList(list);
}

export function downloadArt(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function shareArt(dataUrl: string, title: string) {
  if (!navigator.share || !navigator.canShare) {
    downloadArt(dataUrl, `${title}.png`);
    return;
  }

  fetch(dataUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], `${title}.png`, { type: "image/png" });
      navigator.share({ title, files: [file] }).catch(() => {
        downloadArt(dataUrl, `${title}.png`);
      });
    });
}
