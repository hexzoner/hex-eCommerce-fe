import { Product } from "./Products";

export default function ProductModal({ product }: { product: Product }) {
  return (
    <>
      <dialog id="product_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <div className="flex items-center justify-center gap-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="py-4">[Id = {product.id}]</p>
            </div>
            <p className="py-4">{product.description}</p>
            <p className="py-4">Price: ${product.price}</p>
            <p className="py-4">
              Category: {product.category.name} [id = {product.category.id}]
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
