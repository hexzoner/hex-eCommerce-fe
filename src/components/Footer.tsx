export default function Footer() {
  return (
    <div className="bg-[#1f3041] text-neutral-content p-10 ">
      <footer className="max-w-screen-xl m-auto flex justify-around">
        <aside>
          <div className="text-lg">
            E-Commerce by Serhii Tyshchenko.
            <br />
            <p className="font-bold">Copyright © {new Date().getFullYear()}. All right reserved.</p>
          </div>
        </aside>
      </footer>
    </div>
  );
}
