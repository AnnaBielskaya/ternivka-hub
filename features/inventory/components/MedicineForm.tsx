"use client";

type MedicineFormProps = {
  onCancel: () => void;
};

const MedicineForm = ({ onCancel }: MedicineFormProps) => {
  return (
    <form>
      <div className="space-y-8 p-6">
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Основна інформація
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Назва <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Наприклад, Парацетамол"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="active_ingredient"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Діюча речовина
              </label>

              <input
                id="active_ingredient"
                name="active_ingredient"
                type="text"
                placeholder="Парацетамол"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Категорія <span className="text-red-500">*</span>
              </label>

              <select
                id="category_id"
                name="category_id"
                defaultValue=""
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                <option value="" disabled>
                  Оберіть категорію
                </option>
                <option value="example">Знеболювальні</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="prescription_id"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Призначення
              </label>

              <select
                id="prescription_id"
                name="prescription_id"
                defaultValue=""
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                <option value="">Не обрано</option>
                <option value="example">Анальгетики/антипіретики</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dosage"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Дозування
              </label>

              <input
                id="dosage"
                name="dosage"
                type="text"
                placeholder="500 мг"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="volume"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Об'єм
              </label>

              <input
                id="volume"
                name="volume"
                type="text"
                placeholder="100 мл"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="unit"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Одиниця <span className="text-red-500">*</span>
              </label>

              <select
                id="unit"
                name="unit"
                defaultValue=""
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                <option value="" disabled>
                  Оберіть одиницю
                </option>
                <option value="blister">Блістер</option>
                <option value="package">Упаковка</option>
                <option value="ampule">Ампула</option>
              </select>
            </div>
          </div>
        </section>
        
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Скасувати
          </button>

          <button
            type="submit"
            className="h-10 cursor-pointer rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Додати препарат
          </button>
        </div>
      </div>
    </form>
  );
};

export default MedicineForm;
