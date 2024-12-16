import HowThisWorks from "../../../assets/how-this-works.jpg";
import Rounded_1 from "../../../assets/rounded-1.png";
import Rounded_2 from "../../../assets/rounded-2.png";
import Rounded_3 from "../../../assets/rounded-3.png";
import Rounded_4 from "../../../assets/rounded-4.png";

export default function ProductFAQ({ handleAddSample, product }: { handleAddSample: () => void; product: any }) {
  const header2 = "font-bold text-[32px] leading-10 text-black";
  const header4 = "font-bold text-[20px] mb-1 text-black";

  return (
    <div className="max-w-[75rem] m-auto pb-20 mt-16 bg-[#ebf2f8] w-full pl-[57px] pr-[66px] pt-12 ">
      <div role="tablist" className="tabs tabs-bordered">
        <input type="radio" name="my_tabs_2" role="tab" className="tab text-base" aria-label="This is How it Works" defaultChecked />
        <div role="tabpanel" className="tab-content pt-6 text-base w-full">
          <div className="flex gap-10 ">
            <div className="w-1/2 flex flex-col justify-between gap-2">
              <img src={HowThisWorks} alt="How it works" className="mb-2" />
              <p className={header2}>Perfect samples, perfect choices! Try our rugs sample service</p>
              <p>
                Explore your favorites at home, stress-free – that’s our promise. Along with free expert advice, you can order a sample of any product
                in our shop. We pride ourselves on lightning-fast delivery, with our team processing your orders right away.
              </p>
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex gap-4">
                <img className="w-[50px] h-[50px]" src={Rounded_1} alt="" />
                <div>
                  <p className={header4}>Explore Our Products</p>
                  <p className="text-base">Browse through our wide range of products and choose your favorites.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <img className="w-[50px] h-[50px]" src={Rounded_2} alt="" />
                <div>
                  <p className={header4}>Order Your Samples</p>
                  <p>For each product, you can order a sample directly from our shop.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <img className="w-[50px] h-[50px]" src={Rounded_3} alt="" />
                <div>
                  <p className={header4}>Fast Processing</p>
                  <p>Once you place your order, our sample department processes it immediately.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <img className="w-[50px] h-[50px]" src={Rounded_4} alt="" />
                <div>
                  <p className={header4}>Did you like the sample?</p>
                  <p>Enjoy an special discount if you order the same rug as one of the samples you order.</p>
                </div>
              </div>
              {product.sizes?.find((x: any) => x.name === "Sample") && (
                <button onClick={handleAddSample} className="btn btn-outline w-full rounded-none">
                  Order a Sample
                </button>
              )}
            </div>
          </div>
        </div>

        <input type="radio" name="my_tabs_2" role="tab" className="tab text-base" aria-label="Our Rags" />
        <div role="tabpanel" className="tab-content p-10">
          Our Rags
        </div>

        <input type="radio" name="my_tabs_2" role="tab" className="tab text-base" aria-label="Frequent Questions" />
        <div role="tabpanel" className="tab-content p-10">
          Frequent Questions
        </div>
      </div>
    </div>
  );
}
