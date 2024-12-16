import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { LoadingSpinnerSmall } from "./admin-area/admin-components";
import { FavIcon } from "../pages/user/ProductBrowser";
import { useShop, useAuth } from "../context";
import { getReviews } from "../api/reviews";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
// import { updateCart } from "../api/cart";
// import { toast } from "react-toastify";
import { NewBestSellerBadge } from "./components";
// import { formatDateShort } from "../utils/dateUtils";
import { Rating } from "react-simple-star-rating";
import RugsByProducer from "../pages/user/product-details-components/RugsByProducer";
import FeaturedReviewsCarousel from "../pages/user/product-details-components/FeaturedReviewsCarousel";
import { Review } from "../pages/admin/Reviews";
// import { getProductMainImageUrl } from "../utils/miscUtils";
import ImageGallery from "../pages/user/product-details-components/ImageGallery";
import { getProductMainImageUrl } from "../utils/miscUtils";
import ProductFAQ from "../pages/user/product-details-components/ProductFAQ";
import { formatDateShortWithMonthName } from "../utils/dateUtils";

export default function ProductDetails() {
  const { wishlist, setWishlist, addToCart, cartLoading } = useShop();
  const { authLoading } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
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
    setLoading(true);
    if (authLoading) return;
    setSort("desc");
    getProductById(Number(id))
      .then((res) => {
        res = { ...res, patterns: res.patterns.filter((pattern: any) => pattern.active) };
        setProduct(res);
        // console.log(res);
        setSelectedSize(res.defaultSize);
        setSelectedColor(res.patterns.length > 0 ? res.patterns.find((x: any) => x.order == 0) : []);

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
  }, [id, authLoading]);

  useEffect(() => {
    if (authLoading) return;
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
  }, [page, perPage, sort, id, authLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleAddToCart() {
    addToCart(product, 1, selectedSize.id, selectedColor.id);
  }

  function handleAddSample() {
    addToCart(product, 1, product.sizes.find((x: any) => x.name === "Sample").id, selectedColor.id);
  }

  if (loading || loadingReviews || authLoading) return <LoadingSpinner />;
  if (responseStatus == 404) return <div className="min-h-screen text-3xl flex flex-col items-center justify-center">Product not found</div>;

  function calcPrice() {
    if (!selectedSize || !selectedSize.squareMeters) return "N/A";

    return selectedSize.name === "Sample" ? product.samplePrice.toFixed(2) : (product.price * selectedSize.squareMeters).toFixed(2);
  }

  // console.log(productReviews);

  return (
    <div className="">
      <div className="breadcrumbs text-sm text-blue-600  text-left max-w-[75rem] m-auto mt-6">
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
        <div className="flex-col lg:flex-row flex gap-8 items-start max-w-[75rem] m-auto h-full">
          <div className="w-full lg:w-1/2  lg:px-0  flex-1  relative">
            <div className="max-w-80 m-auto md:max-w-xl lg:max-w-full">
              <ImageGallery
                images={selectedColor.images ? selectedColor.images.map((image: any) => image.imageURL) : [getProductMainImageUrl(product)]}
              />
              <NewBestSellerBadge isNew={product.new} isBestSeller={product.bestSeller} />
            </div>

            {product.producerQuote && product.producerQuote.length > 0 && (
              <div className="bg-[#ebf2f8] pl-[31px] pt-[24px] pr-[75px] pb-[46px] mt-[24px]">
                <p>{product.producerQuote}</p>
                <p className="text-sm italic mt-1">
                  -{product.producer.name}, creator of {product.name}
                </p>
              </div>
            )}

            {/* Description, Details, Notes, Instructions Tabs */}
            <div className="w-full max-w-[75rem] m-auto border-[1.5px] border-black border-opacity-15 mt-12">
              <div role="tablist" className="tabs tabs-bordered pt-6 px-8 bg-white pb-12">
                {/* Tab 1 */}
                <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg" aria-label="Description" defaultChecked />
                <div role="tabpanel" className="tab-content mt-6">
                  <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>
                {/* Tab 2 */}
                {featuredReviews.length > 0 && (
                  <>
                    <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg" aria-label="Top Reviews" />
                    <div role="tabpanel" className="tab-content w-full mt-6">
                      {/* Featured Reviews */}
                      {featuredReviews.length > 0 && (
                        <section className="max-w-xs md:max-w-[30rem] m-auto ">
                          {/* <p className="font-semibold text-xl pt-6 ">Top Reviews</p> */}
                          <FeaturedReviewsCarousel reviews={featuredReviews} />
                        </section>
                      )}
                      <div className="flex items-center">
                        <a href="#reviews" className="underline cursor-pointer text-sm m-auto">
                          See All Reviews
                        </a>
                      </div>
                    </div>
                  </>
                )}
                {/* Tab 3 */}

                <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg" aria-label="Details" />

                <div role="tabpanel" className="tab-content w-full mt-6">
                  <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.details }}></div>
                </div>
                {/* Tab 4 */}
                <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg" aria-label="Notes" />
                <div role="tabpanel" className="tab-content mt-6">
                  <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.notes }}></div>
                </div>
                {/* Tab 5 */}
                <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg" aria-label="Instructions" />
                <div role="tabpanel" className="tab-content mt-6">
                  <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.instructions }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sticky top-0 justify-around w-full bg-[#ebf2f8] py-12 lg:w-1/2 mx-auto mt-6 lg:mt-0 px-5  lg:px-10  gap-4 ">
            <div>
              <p className="text-3xl font-bold text-black">{product.name}</p>
              <p>{product.category ? product.category.name : "N/A"}</p>
            </div>
            <ReviewsStats totalReviews={totalReviews} averateRating={averateRating} />

            <p className="text-3xl font-bold mt-3 text-black">€{calcPrice()}</p>
            {/* <div className="flex gap-4"></div> */}
            {/* Shipping features */}
            <div className="flex gap-4 flex-wrap ">
              {/* {product.features &&
                product.features.map((feature: any) => {
                  return (
                    <div key={feature.id} className="flex gap-1 h-5 items-center  py-4">
                      <img className="h-5 w-5" src={feature.image} alt={feature.name} />
                      <p className="text-sm">{feature.name}</p>
                    </div>
                  );
                })} */}
            </div>

            {/* Features section */}
            <div className="flex gap-4 flex-wrap border-t-[1.5px] border-solid border-black border-opacity-20 pt-4">
              {product.features &&
                product.features.map((feature: any) => {
                  return (
                    <div key={feature.id} className="flex gap-1 h-5 items-center  py-4">
                      <img className="h-5 w-5" src={feature.image} alt={feature.name} />
                      <p className="text-sm">{feature.name}</p>
                    </div>
                  );
                })}
            </div>

            <div>
              {product.patterns?.length > 1 && <p className="font-medium text-base mb-2 text-black">Color: {selectedColor.name}</p>}
              {product.patterns?.length > 1 && (
                <div className="flex flex-wrap gap-6 items-center ">
                  {/* flex-row-reverse mr-auto */}
                  {product.patterns.map((pattern: any) => (
                    <ProductColor color={pattern} setSelectedColor={setSelectedColor} selectedColor={selectedColor} key={pattern.id} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="font-medium text-base mb-2 text-black">
                <span>Size:</span> <span className="ml-1 ">{selectedSize.name}</span>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {product.sizes
                  ?.filter((s: any) => s.name != "Sample")
                  .map((size: any) => (
                    <ProductSize size={size} setSelectedSize={setSelectedSize} selectedSize={selectedSize} key={size.id} />
                  ))}
              </div>
            </div>

            <div className="flex justify-between mt-2 gap-2 items-center">
              <button
                onClick={handleAddToCart}
                className={`btn btn-neutral rounded-none w-[45%] ${cartLoading ? "btn-disabled" : ""}`}
                // disabled={cartLoading}
              >
                {cartLoading ? <LoadingSpinnerSmall /> : "Add to Cart"}
              </button>
              {product.sizes?.find((x: any) => x.name === "Sample") && (
                <button
                  onClick={handleAddSample}
                  className={`btn btn-neutral btn-outline rounded-none w-[45%] ${cartLoading ? "btn-disabled" : ""}`}
                  // disabled={cartLoading}
                >
                  {cartLoading ? <LoadingSpinnerSmall /> : "Order a Sample"}
                </button>
              )}
              <div className="pl-3">
                <FavIcon product={product} wishlist={wishlist} setWishlist={setWishlist} />
              </div>
            </div>
          </div>
        </div>

        <ProductFAQ handleAddSample={handleAddSample} product={product} />

        {/* Meet the producer section */}
        <section className="max-w-[75rem] m-auto pb-16 mt-16">
          <p className="font-semibold text-4xl mb-6">Those who make the magic </p>
          <div className="flex flex-wrap md:flex-nowrap gap-12">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <img className="w-full rounded-none object-cover max-h-80 " src={product.producer?.image} alt="producer image" />
              <p className="font-semibold text-2xl">Meet {product.producer?.name}</p>
              <p>{product.producer?.description}</p>
            </div>
            <div className="md:w-2/3 ">
              <p className="font-semibold text-2xl mt-20 pl-9">More rugs from {product.producer?.name}</p>
              <div className="m-auto w-80 md:w-full">
                <RugsByProducer products={rugsByProducer} />
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section id="reviews" className="bg-[#ebf2f8] max-w-[75rem] w-full m-auto text-center px-4">
          <div className="text-left flex flex-col gap-0 max-w-[40rem] m-auto text-black">
            <p className="font-bold text-3xl text-left pt-20 ">Customers Reviews</p>
            <div className="border-b-2 border-black border-opacity-15 pb-8 flex gap-4 items-center">
              <p className="text-3xl pt-3">{averateRating}</p>
              <ReviewsStats totalReviews={totalReviews} averateRating={averateRating} />
            </div>
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
      <Rating initialValue={review.rating} size={20} readonly={true} className="my-1" />
      <p className="font-bold text-lg">{review.title}</p>

      <p className="mt-6 text-sm">{review.review}</p>
      <div className="flex flex-col items-left justify-between mt-3">
        <p className="text-md font-semibold">{review.author}</p>
        <p className="text-sm mt-1">{formatDateShortWithMonthName(review.date)}</p>
      </div>
      {/* <div className="w-full"><Rating initialValue={review.rating} /></div> */}
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
      className={`btn btn-sm py-0 px-5 rounded-none ${selectedSize.id == size.id ? "btn-neutral" : "btn-outline"}`}>
      {size.name}
    </button>
  );
}

function ProductColor({ color, setSelectedColor, selectedColor }: { color: any; setSelectedColor: any; selectedColor: any }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2`}>
      <img
        onClick={() => {
          setSelectedColor(color);
        }}
        key={color.id}
        className={`h-10 w-10 cursor-pointer rounded-full object-cover p-1 border-[1.5px] border-solid border-black ${
          selectedColor.id == color.id ? "border-opacity-100" : "border-opacity-10"
        }`}
        src={color.icon}
        alt=""
      />
      {/* <button
        onClick={() => {
          setSelectedColor(color);
        }}
        key={color.id}
        className={`btn btn-xs py-0 px-5 ${selectedColor.id == color.id ? "btn-primary" : "btn-outline"}`}>
        {color.name}
      </button> */}
    </div>
  );
}

enum size {
  xsmall = "rating-xs",
  small = "rating-sm",
  medium = "rating-md",
  large = "rating-lg",
}

function ReviewsStats({ totalReviews, averateRating }: { totalReviews: number; averateRating: number }) {
  return (
    <div className="mt-3 flex justify-start items-center gap-2">
      <Ratings rating={averateRating} size={size.small} />
      <a href="#reviews" className="text-sm underline cursor-pointer">
        ({totalReviews} Reviews)
      </a>
    </div>
  );
}

function Ratings({ rating, size }: { rating: number; size: size }) {
  return (
    <div className={"rating rating-half " + size}>
      {/* <input checked={true} title="rating" type="radio" name="rating-10" className="rating-hidden pointer-events-none" readOnly /> */}
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
