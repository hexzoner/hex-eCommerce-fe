import { iOrder, iOrderProduct } from "../Orders";
import { formatDateFull } from "../../../utils/dateUtils";

export default function OrderModal({ order }: { order: iOrder }) {
  // console.log(order);
  return (
    <>
      <dialog id="order_modal" className="modal text-left ">
        <div className="modal-box max-w-screen-lg">
          <div className="max-w-screen-lg m-auto">
            <div className="flex items-center justify-center gap-4">
              <h3 className="font-bold text-lg">Order #{order.id}</h3>
              {/* <p className="py-4">[Id = {order.stripeSessionId}]</p> */}
            </div>
            <p className="py-4 italic text-sm opacity-60">Stripe Session Id = {order.stripeSessionId}</p>
            <div className="py-4">
              <p className="">
                Customer: {order.user.firstName} {order.user.lastName} - {order.user.email}{" "}
                <span className="opacity-70 italic">(Id: {order.user.id})</span>
              </p>
              <p className="">Order Total: €{order.total}</p>
              <p className="">Created at: {formatDateFull(order.createdAt)}</p>
              {order.updatedAt > order.createdAt && <p className="">Updated at: {formatDateFull(order.updatedAt)}</p>}
            </div>
            <p className="py-4">Products ({order.products.length}):</p>
            <div className="text-left">
              {order.products.map((x, index) => {
                return (
                  // <div key={index}>
                  //   {index + 1}. {x.name} - €{x.price} x {x.quantity}
                  // </div>

                  <OrderProductCard key={index} item={x} />
                );
              })}
            </div>
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

function OrderProductCard({ item }: { item: iOrderProduct }) {
  return (
    <div className="w-full max-w-5xl m-auto shadow bg-base-100 py-4">
      <div className="flex gap-4 items-center">
        <div className="flex justify-evenly w-full gap-6">
          <div className=" w-1/3 h-32 flex flex-col justify-center items-center">
            <img className="object-cover  m-auto h-32 w-48" src={item.pattern.icon} alt="color" />
          </div>
          <div className="flex flex-col gap-2 text-left w-1/2 ">
            {item.pattern.name !== "Main" && item.pattern.name !== "Default" && <p className="">Color: {item.pattern.name}</p>}
            <p className="">Size: {item.size.name}</p>
          </div>
          {/* <div className="text-left w-1/2 text-sm flex flex-col items-center"> */}
          {/* <p>{item.product.description}</p> */}

          {/* <p className="text-sm font-semibold">{item.pattern.name}</p> */}
          {/* </div> */}
          <div className="w-1/4 flex flex-col items-center gap-4">
            {/* {
              item.quantity > 1 && <span className="text-lg">{item.quantity} x </span>} */}
            <span className="font-semibold text-xl">€{item.priceTotal ? item.priceTotal : item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
