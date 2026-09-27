import type { ReactNode } from "react";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="text-xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
