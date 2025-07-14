import { create } from "zustand";

interface BoardStore {
  title: string;
  content: string;
  boardImageFileList: File[];

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setBoardImageFileList: (boardImageFileList: File[]) => void;
  resetBoard: () => void;
}

const useBoardStore = create<BoardStore>((set) => ({
  title: "",
  content: "",
  boardImageFileList: [],

  setTitle: (title: string) => set({ title }),
  setContent: (content: string) => set({ content }),
  setBoardImageFileList: (boardImageFileList: File[]) =>
    set({ boardImageFileList }),
  resetBoard: () => set({ title: "", content: "", boardImageFileList: [] }),
}));

export default useBoardStore;
