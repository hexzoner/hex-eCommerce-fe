import { Category } from "./Categories";

export default function CategoryModal({ category }: { category: Category }) {
  return (
    <>
      <dialog id="category_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{category.name}</h3>
          <p className="py-4">Id = {category.id}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
