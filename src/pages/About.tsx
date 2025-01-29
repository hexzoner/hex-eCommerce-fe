import { mainMakrupColors } from "./user/ProductBrowser";

export default function About() {
  return (
    <div className={mainMakrupColors}>
      <div className="min-h-screen flex flex-col justify-center items-center text-2xl gap-8">
        <p>A full-stack E-Commerce website.</p>
        <p className="text-lg">Admin user manage products, categories, colors, sizes, orders and other options in admin panel part of the websiite.</p>
        <p className="text-lg">Users can register, can browse products, add them to the wishlist and to the cart. After logging in users can purchase products.</p>
        <p className="text-lg">Admin can upload images for each product. Images are uploaded to AWS S3 bucket</p>
        <p className="text-lg">Payment system: Stripe</p>
        <p className="text-lg">Email notifications: Sendgrid</p>
        <p className="text-xl font-semibold">Frontend: React.js / Typescript / TailwindCSS / DaisyUI</p>
        <p className="text-xl font-semibold">Backend and API: Node.js / Express / PostgreSQL / Sequelize </p>
      </div>
    </div>
  );
}
