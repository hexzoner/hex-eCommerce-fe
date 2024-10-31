import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { FavIcon } from "../pages/user/ProductBrowser";
import { useShop } from "../context";
import { getReviews } from "../api/reviews";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
// import { updateCart } from "../api/cart";
// import { toast } from "react-toastify";
import { NewBestSellerBadge } from "./components";
import { formatDateShort } from "../utils/dateUtils";
import { Rating } from "react-simple-star-rating";
import RugsByProducer from "../pages/user/product-details-components/RugsByProducer";
import FeaturedReviewsCarousel from "../pages/user/product-details-components/FeaturedReviewsCarousel";
import { Review } from "../pages/admin/Reviews";
// import { getProductMainImageUrl } from "../utils/miscUtils";
import ImageGallery from "../pages/user/product-details-components/ImageGallery";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { wishlist, setWishlist, addToCart, cartLoading } = useShop();
  const [selectedSize, setSelectedSize] = useState<any>({});
  const [selectedColor, setSelectedColor] = useState<any>({});
  const [productReviews, setProductReviews] = useState<any>([]);
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sort, setSort] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averateRating, setAverageRating] = useState(0);
  const [responseStatus, setResponseStatus] = useState(200);
  const [rugsByProducer, setRugsByProducer] = useState<any>([]);

  const navigate = useNavigate();

  function setReviewsData(res: any) {
    setProductReviews(res.reviews);
    setTotalPages(res.totalPages);
    setTotalReviews(res.totalReviews);
    setAverageRating(res.averageRating);
    setFeaturedReviews(res.featuredReviews);
  }

  useEffect(() => {
    setSort("desc");
    getProductById(Number(id))
      .then((res) => {
        setProduct(res);
        setSelectedSize(res.defaultSize);
        setSelectedColor(res.patterns.length > 0 ? res.patterns.find((x: any) => x.order == 0) : res.defaultColor);

        if (res.status && res.status == 404) {
          setResponseStatus(res.status);
          return;
        } else {
          getProducts({ producers: [res.producer.id] })
            .then((res) => {
              setRugsByProducer(res.results.filter((product: any) => product.id != id));
            })
            .catch((err) => {
              console.log("Error fetching products by producer");
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log("Error fetching product details");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setLoadingReviews(true);
    // console.log("Fetching reviews");
    getReviews({
      page,
      perPage,
      sort,
      sortBy: "date",
      productId: Number(id),
    })
      .then((res) => {
        setReviewsData(res);
      })
      .catch((err) => {
        console.log("Error fetching product reviews");
        console.log(err);
      })
      .finally(() => {
        setLoadingReviews(false);
      });
  }, [page, perPage, sort, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleAddToCart() {
    addToCart(product, 1, selectedSize.id, selectedColor.id);
  }

  if (loading || loadingReviews) return <LoadingSpinner />;
  if (responseStatus == 404) return <div className="min-h-screen text-3xl flex flex-col items-center justify-center">Product not found</div>;

  function calcPrice() {
    if (!selectedSize.name) return "N/A";
    const heightWidth = selectedSize.name.split("x");
    if (heightWidth.length == 2) return (product.price * (parseInt(heightWidth[0]) * parseInt(heightWidth[1]))).toFixed(2);
    else return product.price;
  }

  return (
    <div className="">
      <div className="breadcrumbs text-sm text-blue-600  text-left max-w-[80rem] m-auto mt-6">
        <ul>
          <li>
            <a onClick={() => navigate("/")}>Home</a>
          </li>
          <li>
            <a onClick={() => navigate("/products")} className="">
              Rugs
            </a>
          </li>
          <li>
            <p className="underline underline-offset-2">{product.name}</p>
          </li>
        </ul>
      </div>
      <div className="flex flex-col min-h-screen mt-8 text-left">
        {/* Product Image, Name, Price, Category, Size, Color, Add to Cart Button */}
        <div className="flex-col lg:flex-row flex gap-0 items-start max-w-[80rem] m-auto h-full">
          <div className="w-full lg:w-1/2 px-24 lg:px-0  flex-1 self-stretch relative">
            {/* <img className="object-fill w-full py-4 px-2" src={getProductMainImageUrl(product)} alt="Product image" /> */}

            <ImageGallery images={selectedColor.images.map((image: any) => image.imageURL)} />
            <NewBestSellerBadge isNew={product.new} isBestSeller={product.bestSeller} />

            {/* Featured Reviews */}
            {featuredReviews.length > 0 && (
              <section className="max-w-[70rem] m-auto ">
                <p className="font-semibold text-xl pt-6">Featured Reviews</p>
                <FeaturedReviewsCarousel reviews={featuredReviews} />
              </section>
            )}
          </div>

          <div className="flex flex-col w-full lg:w-1/2 px-4 lg:px-16 justify-between gap-6 pb-6 self-stretch flex-1 ">
            <div className="flex justify-between items-center">
              <p className="text-3xl font-semibold">{product.name}</p>
              <FavIcon product={product} wishlist={wishlist} setWishlist={setWishlist} />
            </div>
            <p className="text-xl">€{calcPrice()}</p>
            <div className="flex gap-4 italic">
              <p>{product.category.name}</p>
            </div>

            {/* Features section */}
            <div className="flex gap-4 flex-wrap ">
              {product.features &&
                product.features.map((feature: any) => {
                  return (
                    <div key={feature.id} className="flex gap-1 h-6 items-center  py-4">
                      <img className="h-6 w-6" src={feature.image} alt={feature.name} />
                      <p className="text-sm">{feature.name}</p>
                    </div>
                  );
                })}
            </div>

            <div className="font-semibold text-lg">
              <span>Size:</span> <span className="ml-1 ">{selectedSize.name}</span>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {product.sizes.map((size: any) => (
                <ProductSize size={size} setSelectedSize={setSelectedSize} selectedSize={selectedSize} key={size.id} />
              ))}
            </div>
            {product.patterns.length > 1 && <p className="font-semibold text-lg">Color: {selectedColor.name}</p>}
            {product.patterns.length > 1 && (
              <div className="flex flex-wrap gap-6 items-center ">
                {/* flex-row-reverse mr-auto */}
                {product.patterns.map((pattern: any) => (
                  <ProductColor color={pattern} setSelectedColor={setSelectedColor} selectedColor={selectedColor} key={pattern.id} />
                ))}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              className={`btn btn-primary mt-2 ${cartLoading ? "btn-disabled" : ""}`}
              // disabled={cartLoading}
            >
              {cartLoading ? "ADDING TO CART..." : "ADD TO CART"}
            </button>
          </div>
        </div>

        {/* Description, Details, Notes, Instructions Tabs */}
        <div className="w-full max-w-[80rem] m-auto border-b-2 border-black border-opacity-25 pb-12">
          <div role="tablist" className="tabs tabs-bordered ">
            {/* Tab 1 */}
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Description" defaultChecked />
            <div role="tabpanel" className="tab-content p-10">
              <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.description }}></div>
            </div>
            {/* Tab 2 */}
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Details" />
            <div role="tabpanel" className="tab-content p-10 w-full ">
              <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.details }}></div>
            </div>
            {/* Tab 3 */}
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Notes" />
            <div role="tabpanel" className="tab-content p-10">
              <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.notes }}></div>
            </div>
            {/* Tab 4 */}
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Instructions" />
            <div role="tabpanel" className="tab-content p-10">
              <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.instructions }}></div>
            </div>
          </div>
        </div>

        {/* Meet the producer section */}
        <section className="max-w-[70rem] m-auto pb-16 mt-16">
          <div className="flex flex-wrap md:flex-nowrap gap-8">
            <div className="w-full md:w-2/3 flex flex-col gap-8">
              <p className="font-semibold text-4xl">Meet {product.producer.name}</p>
              <p>{product.producer.description}</p>
              <p className="font-semibold text-xl mt-16">More rugs from this producer</p>
              <div className="m-auto w-80 md:w-full">
                <RugsByProducer products={rugsByProducer} />
              </div>
            </div>
            <img className="w-full md:w-1/3 rounded-xl object-cover max-h-80 " src={product.producer.image} alt="producer image" />
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="bg-[#fcfaf5] w-full text-center">
          <div className="max-w-[40rem] m-auto py-20 border-b-[2.5px] border-black border-opacity-15 mb-4">
            <p className="font-semibold text-2xl">Customer Reviews</p>
            <p className="">{totalReviews} Reviews</p>
            <Ratings rating={averateRating} size={size.large} />
          </div>
          <div className="text-left flex flex-col gap-0 max-w-[40rem] m-auto ">
            {productReviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="mb-20 max-w-[40rem] m-auto">
            <Pagination page={page} setPage={setPage} perPage={perPage} setPerPage={setPerPage} totalResults={totalReviews} totalPages={totalPages} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="border-b-[2.5px] border-black border-opacity-15 py-16 ">
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold">{review.author}</p>
        <p className="">{formatDateShort(review.date)}</p>
      </div>
      <Rating initialValue={review.rating} size={20} readonly={true} className="my-1" />
      <p className="font-bold text-lg">{review.title}</p>

      <p className="mt-6 text-sm">{review.review}</p>
      <div className="w-full">{/* <Rating initialValue={review.rating} /> */}</div>
    </div>
  );
}

function ProductSize({ size, setSelectedSize, selectedSize }: { size: any; setSelectedSize: any; selectedSize: any }) {
  return (
    <button
      onClick={() => {
        setSelectedSize(size);
      }}
      key={size.id}
      className={`btn btn-sm py-0 px-5 ${selectedSize.id == size.id ? "btn-primary" : "btn-outline"}`}>
      {size.name}
    </button>
  );
}

function ProductColor({ color, setSelectedColor, selectedColor }: { color: any; setSelectedColor: any; selectedColor: any }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <img className="h-16 w-16 rounded-full object-cover" src={color.icon} alt="" />
      <button
        onClick={() => {
          setSelectedColor(color);
        }}
        key={color.id}
        className={`btn btn-xs py-0 px-5 ${selectedColor.id == color.id ? "btn-primary" : "btn-outline"}`}>
        {color.name}
      </button>
    </div>
  );
}

enum size {
  xsmall = "rating-xs",
  small = "rating-sm",
  medium = "rating-md",
  large = "rating-lg",
}

function Ratings({ rating, size }: { rating: number; size: size }) {
  return (
    <div className={"rating rating-half " + size}>
      <input checked={true} title="rating" type="radio" name="rating-10" className="rating-hidden pointer-events-none" readOnly />
      <input
        checked={false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-1 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating < 1.5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-2 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 1.5 && rating < 2.0 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-1 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 2 && rating < 2.5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-2 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 2.5 && rating < 3 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-1 bg-yellow-500 pointer-events-none"
        readOnly={true}
      />

      <input
        checked={rating >= 3 && rating < 3.5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-2 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 3.5 && rating < 4 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-1 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 4 && rating < 4.5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-2 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating >= 4.5 && rating < 5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-1 bg-yellow-500 pointer-events-none"
        readOnly
      />
      <input
        checked={rating == 5 ? true : false}
        title="rating"
        type="radio"
        name="rating-10"
        className="mask mask-star-2 mask-half-2 bg-yellow-500 pointer-events-none"
        readOnly
      />
    </div>
  );
}
