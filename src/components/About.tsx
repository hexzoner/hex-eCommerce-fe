import { mainMakrupColors } from "../pages/user/ProductBrowser";

export default function About() {
  return (
    <div className={mainMakrupColors}>
      <div className="min-h-screen flex flex-col justify-center items-center text-2xl gap-8">
        <p>A full-stack E-Commerce website. Currently in development</p>
        <p className="text-lg">User with the role 'admin' manages products, categories, colors, sizes, orders in admin panel part of the websiite</p>
        <p className="text-lg">Users can register with the role 'user' and can browse products and add them to the wishlist and to the cart</p>
        <p className="text-xl">Frontend is made using: React.js / Typescript / Tailwind / DaisyUI</p>
        <p className="text-xl">Backend and API are made using: Node.js / Express / PostgreSQL / Sequelize </p>
      </div>
    </div>
  );
}
