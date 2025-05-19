import { create } from 'zustand';

export type ModalType = 
  | 'login' 
  | 'register' 
  | 'createArticle' 
  | 'editArticle' 
  | 'createCategory' 
  | 'editCategory'
  ;

interface ModalData {
  itemId?: string | number; 
  initialValues?: any; 
}

interface ModalState {
  currentOpenModal: ModalType | null;
  modalData: ModalData | null;
  openModal: (modalType: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  currentOpenModal: null,
  modalData: null,
  openModal: (modalType, data) => set({ currentOpenModal: modalType, modalData: data || null }),
  closeModal: () => set({ currentOpenModal: null, modalData: null }),
}));
