import { Button } from "@/components/ui/button";

const SubscribePage = () => {
  return (
    <div className="bg-[#000] w-full h-full md:h-screen flex flex-col justify-center items-center py-6">
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-[30px] text-white-1 font-bold">Our Pricing Plan</h2>
        <p className="text-sm text-white-2 md:w-[690px] text-center text-[16.5px] font-semibold leading-normal px-2">
          Unlock the power of creating unlimited AI-generated podcast with our
          subscription plan. Enjoy the freedom to explore your creativity
          without any limitations.
        </p>
      </div>
      <section className="flex gap-5 items-center justify-center mt-14 container flex-col lg:flex-row">
        <div className="w-full h-full md:w-[530px] md:h-[500px] p-5 flex flex-col gap-2 bg-[#000] rounded-lg shadow-lg border-[.4px] border-black-5 ">
          <div className="flex justify-between items-center my-3">
            <h1 className="text-[17px] text-white-1 font-bold">Free Plan</h1>
            <span className="text-[17px] text-white-1 font-bold">$0/month</span>
          </div>
          <div className="my-2">
            <span className="text-sm text-white-2 font-semibold">
              Perfect for casual listeners who enjoy tuning in occasionally and
              want to stay updated
            </span>
          </div>
          <Button className="border-[.2px] border-black-4 text-white-1 my-5 py-6">
            Get Started
          </Button>
          <div className="flex flex-col gap-3">
            <h2 className="text-white-1 font-bold">Includes</h2>
            {/* <div> */}
            <ul className="text-white-1 text-[15px] font-semibold list-disc pl-5 flex flex-col gap-1">
              <li>Access to all public episodes</li>
              <li>Weekly newsletter</li>
              <li>Limited episode archive (last 5 episodes)</li>
              <li>Community access</li>
            </ul>
            {/* </div> */}
          </div>
        </div>
        <div className="w-full h-full md:w-[530px] md:h-[500px] p-5 flex flex-col gap-2 bg-[#000] rounded-lg shadow-lg border-[.4px] border-black-5">
          <div className="flex justify-between items-center my-3">
            <h1 className="text-[17px] text-white-1 font-bold">Pro Plan</h1>
            <span className="text-[17px] text-white-1 font-bold">$5/month</span>
          </div>
          <div className="my-2">
            <span className="text-sm text-white-2 font-semibold">
              For dedicated listeners who want more.
            </span>
          </div>
          <Button className="border-[.2px] border-black-4 text-white-1 my-5 py-6">
            Get Started
          </Button>
          <div className="flex flex-col gap-3">
            <h2 className="text-white-1 font-bold">Includes</h2>
            {/* <div> */}
            <ul className="text-white-1 text-[15px] font-semibold list-disc pl-5 flex flex-col gap-1">
              <li>Full episode archive</li>
              <li>Early access to new episodes</li>
              <li>Exclusive bonus content</li>
              <li>Monthly live Q&amp;A sessions</li>
              <li>Ad-free listening</li>
            </ul>
            {/* </div> */}
          </div>
        </div>
        <div className="w-full h-full md:w-[530px] md:h-[500px] p-5 flex flex-col gap-2 bg-[#000] rounded-lg shadow-lg border-[.4px] border-black-5">
          <div className="flex justify-between items-center my-3">
            <h1 className="text-[17px] text-white-1 font-bold">VIP Plan</h1>
            <span className="text-[17px] text-white-1 font-bold">
              $10/month
            </span>
          </div>
          <div className="my-2">
            <span className="text-sm text-white-2 font-semibold">
              All-in for the superfans.
            </span>
          </div>
          <Button className="border-[.2px] border-black-4 text-white-1 my-5 py-6">
            Get Started
          </Button>
          <div className="flex flex-col gap-3">
            <h2 className="text-white-1 font-bold">Includes</h2>
            {/* <div> */}
            <ul className="text-white-1 text-[15px] font-semibold list-disc pl-5 flex flex-col gap-1">
              <li>Everything in Pro Plan</li>
              <li>Behind-the-scenes content</li>
              <li>Special shout-outs in episodes</li>
              <li>Access to private Discord community</li>
              <li>VIP-only giveaways and merch discounts</li>
            </ul>
            {/* </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscribePage;
