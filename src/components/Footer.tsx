import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <div className="bg-[#1f3041] text-neutral-content p-10 ">
      <footer className="max-w-screen-xl m-auto flex justify-around">
        <aside>
          <div className="text-lg">
            <div className="mb-3 flex flex-col items-center justify-center">
              <Logo fill={"white"} />
            </div>
            {/* Teppalu */}

            <p className="font-semibold text-base">{new Date().getFullYear()}</p>
          </div>
        </aside>
      </footer>
    </div>
  );
}
