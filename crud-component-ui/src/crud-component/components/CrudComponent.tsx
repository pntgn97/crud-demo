import { useState } from "react";
import { useCrud } from "../useCrud";
import type { CrudService, EntityConfig } from "../types";
import { DataTable } from "./DataTable";
import { DetailPanel } from "./DetailPanel";
import { EntityForm } from "./EntityForm";
import { ItemList } from "./ItemList";
import { Modal } from "./Modal";
import { Paginator } from "./Paginator";

interface CrudComponentProps<T extends { id: string | number }> {
  service: CrudService<T>;
  config: EntityConfig<T>;
  viewMode?: "table" | "master-detail";
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export const CrudComponent = <T extends { id: string | number }>({
  service,
  config,
  viewMode = "table",
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
}: CrudComponentProps<T>) => {
  const {
    items,
    loading,
    error,
    selectedItem,
    sort,
    page,
    perPage,
    totalPages,
    select,
    setSort,
    setSortOption,
    setPage,
    setPerPage,
    create,
    update,
    remove,
  } = useCrud(service, { defaultPerPage: defaultPageSize });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);

  const handleAddSubmit = (data: Partial<T>) => {
    create(data as Omit<T, "id">);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (data: Partial<T>) => {
    if (editingItem) {
      update(editingItem.id, data);
    }
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      remove(deletingItem.id);
    }
    setDeletingItem(null);
  };

  const handleItemClick = (item: T, event: React.MouseEvent) => {
    if (event.ctrlKey && selectedItem?.id === item.id) {
      select(null);
    } else {
      select(item);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{config.label}</h2>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Dodaj
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Učitavanje...</p>}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {viewMode === "master-detail" ? (
        <div className="grid gap-4 lg:h-[calc(100vh-11rem)] lg:grid-cols-2">
          <div className="flex h-[60vh] min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:h-full">
            <ItemList
              items={items}
              config={config}
              selectedId={selectedItem?.id}
              sort={sort}
              onSortChange={setSortOption}
              onItemClick={handleItemClick}
            />
            <div className="border-t border-gray-200 px-4 py-3">
              <Paginator
                page={page}
                totalPages={totalPages}
                perPage={perPage}
                perPageOptions={pageSizeOptions}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
              />
            </div>
          </div>

          {selectedItem ? (
            <DetailPanel
              key={selectedItem.id}
              item={selectedItem}
              config={config}
              onUpdate={(data) => update(selectedItem.id, data)}
              onDelete={(item) => setDeletingItem(item)}
            />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              Izaberite stavku za prikaz detalja.
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <DataTable
            items={items}
            config={config}
            sort={sort}
            onSortChange={setSort}
            onEdit={(item) => setEditingItem(item)}
            onDelete={(item) => setDeletingItem(item)}
          />

          <Paginator
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            perPageOptions={pageSizeOptions}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>
      )}

      {isAddOpen && (
        <Modal title="Novi unos" onClose={() => setIsAddOpen(false)}>
          <EntityForm config={config} onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} />
        </Modal>
      )}

      {editingItem && (
        <Modal title="Izmjena" onClose={() => setEditingItem(null)}>
          <EntityForm
            config={config}
            initialValues={editingItem}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingItem(null)}
          />
        </Modal>
      )}

      {deletingItem && (
        <Modal title="Potvrda brisanja" onClose={() => setDeletingItem(null)}>
          <p className="text-sm text-gray-600">
            Da li ste sigurni da želite da obrišete ovu stavku?
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Obriši
            </button>
            <button
              type="button"
              onClick={() => setDeletingItem(null)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Otkaži
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
