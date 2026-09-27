import chevronDoubleLeft from "../../assets/icons/chevron-double-left.svg";
import chevronDoubleRight from "../../assets/icons/chevron-double-right.svg";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";
import { Icon } from "./Icon";

interface PaginatorProps {
  page: number;
  totalPages: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const buttonClasses =
  "inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

export const Paginator = ({
  page,
  totalPages,
  perPage,
  perPageOptions = [5, 10, 20],
  onPageChange,
  onPerPageChange,
}: PaginatorProps) => {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        Po stranici
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className={buttonClasses}
          aria-label="Prva stranica"
        >
          <Icon src={chevronDoubleLeft} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          className={buttonClasses}
          aria-label="Prethodna stranica"
        >
          <Icon src={chevronLeft} />
        </button>

        <span className="px-2 text-sm text-gray-600">
          Stranica {page} od {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          className={buttonClasses}
          aria-label="Sljedeća stranica"
        >
          <Icon src={chevronRight} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          className={buttonClasses}
          aria-label="Posljednja stranica"
        >
          <Icon src={chevronDoubleRight} />
        </button>
      </div>
    </div>
  );
};
