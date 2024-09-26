import { User } from "../Users";
import { formatDateFull } from "../../../utils/dateUtils";

export default function UserModal({ user }: { user: User }) {
  return (
    <>
      <dialog id="user_modal" className="modal">
        <div className="modal-box text-left">
          <div className="max-w-96 m-auto">
            <div className="flex items-center justify-center gap-4">
              <h3 className="font-bold text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <p className="py-4">[Id: {user.id}]</p>
            </div>
            <p className="py-4">{user.email}</p>
            <p className="py-4">Address: {!user.address || user.address == "" ? "N/A" : user.address}</p>
            <p className="py-4">Role: {user.role}</p>
            <p className="py-4">Created at: {formatDateFull(user.createdAt)}</p>
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
