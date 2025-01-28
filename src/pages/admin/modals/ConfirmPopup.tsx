const ConfirmPopup = ({
  deleteConfirmed,
  confirmText,
  popupId,
}: {
  deleteConfirmed: (x?: any, y?: any) => void;
  confirmText: string;
  popupId?: string;
}) => {
  if (!confirmText) return (confirmText = "Are you sure you want to delete this item?");
  return (
    <dialog id={popupId ? popupId : "confirmPopup"} className="modal">
      <div className="modal-box bg-base-100">
        {/* <h3 className="font-bold text-lg">Confirmation</h3> */}
        <p className="py-4 font-semibold">{confirmText}</p>
        <div className="modal-action">
          <div className="flex justify-between w-full">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={deleteConfirmed} className="btn btn-outline btn-error">
              Confirm
            </button>
            <button
              onClick={(e: any) => {
                e.preventDefault();
                const dialog = document.getElementById(popupId ? popupId : "confirmPopup") as HTMLDialogElement;
                dialog.close();
              }}
              className="btn btn-outline">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmPopup;
