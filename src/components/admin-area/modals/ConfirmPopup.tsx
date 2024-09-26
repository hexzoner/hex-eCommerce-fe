const ConfirmPopup = ({ deleteConfirmed, confirmText }: { deleteConfirmed: () => void; confirmText: string }) => {
  if (!confirmText) return (confirmText = "Are you sure you want to delete this item?");
  return (
    <dialog id="confirmPopup" className="modal">
      <div className="modal-box bg-base-100">
        {/* <h3 className="font-bold text-lg">Confirmation</h3> */}
        <p className="py-4 font-semibold">{confirmText}</p>
        <div className="modal-action">
          <form method="dialog" className="flex justify-between w-full">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={deleteConfirmed} className="btn btn-outline btn-error">
              Confirm
            </button>
            <button className="btn btn-outline">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmPopup;
