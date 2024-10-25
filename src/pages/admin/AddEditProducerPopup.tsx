import { Producer } from "./Producers";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createProducer, updateProducer } from "../../api/producers";
import { LoadingSpinnerSmall } from "../../components/admin-area/admin-components";

export default function AddEditProducerPopup({ producer, setProducers }: { producer: Producer; setProducers: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    // setValue,
    // getValues,
  } = useForm<{
    name: string;
    description: string;
    image: string;
  }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resetForm();
  }, [producer]);

  function resetForm() {
    reset({
      name: producer.name,
      description: producer.description,
      image: producer.image,
    });
  }

  // Watch the image input field
  const imageUrl = watch("image");

  function onSubmit(data: any) {
    // console.log(data);
    if (producer.id <= 0) {
      setLoading(true);
      createProducer(data)
        .then((res) => {
          // console.log(res);
          setProducers((prev: any) => [...prev, res]);
          resetForm();
          const modal = document.getElementById("producer_modal");
          if (modal) (modal as HTMLDialogElement).close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      updateProducer(data, producer.id)
        .then((res) => {
          // console.log(res);
          setProducers((prev: any) => prev.map((p: any) => (p.id === producer.id ? res : p)));
          resetForm();
          const modal = document.getElementById("producer_modal");
          if (modal) (modal as HTMLDialogElement).close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <dialog id="producer_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {!loading ? (
          <div className="text-left">
            <form className="flex flex-col gap-3 pt-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="flex gap-2 items-center">
                  <label className="min-w-24" htmlFor="name">
                    Name:
                  </label>
                  <input id="name" type="text" className="input input-bordered w-full" {...register("name", { required: true })} />
                </div>
                {errors.name && <p className="text-error text-xs ml-28">Name is required</p>}
              </div>

              <div>
                <div className="flex gap-2 items-start w-full">
                  <label className="min-w-24 mt-2" htmlFor="description">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    className="textarea textarea-bordered resize-none w-full min-h-48"
                    {...register("description", { required: true })}
                  />
                </div>
                {errors.description && <p className="text-error text-xs ml-28">Description is required</p>}
              </div>

              <div>
                <div className="flex gap-2 items-center">
                  <label className="min-w-24" htmlFor="image">
                    Image:
                  </label>
                  <input id="image" type="text" className="input input-bordered w-full" {...register("image", { required: true })} />
                </div>
                {errors.image && <p className="text-error text-xs ml-28">Image is required</p>}
              </div>
              {(producer.image || imageUrl) && (
                <img className="w-[30rem] m-auto" src={producer.image ? producer.image : imageUrl} alt="producer image" />
              )}

              <div>
                <button className="btn btn-success btn-sm rounded-none">Save</button>
                {/* <button onClick={handleCancel} className="btn btn-sm">
                  Cancel
                </button> */}
              </div>
            </form>
          </div>
        ) : (
          <div className="min-h-96 flex flex-col items-center justify-center">
            <LoadingSpinnerSmall />
          </div>
        )}
      </div>
    </dialog>
  );
}
