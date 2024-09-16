import { Order } from "./Orders";
import { formatDateFull } from "../../utils/dateUtils";

export default function OrderModal({ order }: { order: Order }) {
  return (
    <>
      <dialog id="order_modal" className="modal text-left">
        <div className="modal-box ">
          <div className="max-w-96 m-auto">
            <div className="flex items-center justify-center gap-4">
              <h3 className="font-bold text-lg">Order {order.id}</h3>
              <p className="py-4">[Id = {order.userId}]</p>
            </div>
            <p className="py-4">Products ({order.products.length}):</p>
            <div className="text-left">
              {order.products.map((x, index) => {
                return (
                  <div key={index}>
                    {index + 1}. {x.name} - ${x.price} x {x.quantity}
                  </div>
                );
              })}
            </div>
            <p className="py-4">Order Total: ${order.total}</p>
            <p className="py-4">Created at: {formatDateFull(order.createdAt)}</p>
            {order.updatedAt > order.createdAt && <p className="py-4">Updated at: {formatDateFull(order.updatedAt)}</p>}
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
