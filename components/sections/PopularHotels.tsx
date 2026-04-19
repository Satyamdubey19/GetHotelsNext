import HotelList from "../hotel/HotelList"

const PopularHotels = () => {
  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-black">Popular Hotels</h2>
      <HotelList />
    </section>
  )
}

export default PopularHotels