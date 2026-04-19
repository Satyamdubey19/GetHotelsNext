import Header from "@/components/layout/Header/Header"
import HotelSlider from "@/components/hotel/HotelSlider"
import SearchBar from "@/components/search/SearchBar"
import TourPackages from "@/components/sections/TourPackages"
import Destinations from "@/components/sections/PopularDestinations"
import LocationStories from "@/components/sections/LocationStories"
import HotelList from "@/components/hotel/HotelList"
import StatsSection from "@/components/sections/StatsSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import Footer from "@/components/layout/Footer/Footer"

export default function Home() {
  return (
    <>
      <Header />

      <HotelSlider />

      <div className="mt-10">
        <SearchBar />
      </div>

      <Destinations />

      <HotelList />

      <TourPackages />

      <LocationStories />

      <TestimonialsSection />

      <WhyChooseUs />

      <StatsSection />

      <Footer />
    </>
  )
}