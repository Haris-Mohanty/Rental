import Hero from "@/components/Hero";
import PopularCarsSlider from "@/components/PopularCarDeals";
import WhyChooseUs from "@/components/WhyChooseUs";
import { cars } from "./data/cars";

export default function Home() {
  return (
    <>
      <main className="bg-gray-50 min-h-screen overflow-hidden">
        <Hero />
        <PopularCarsSlider cars={cars} />
        <WhyChooseUs />
      </main>
    </>
  );
}
