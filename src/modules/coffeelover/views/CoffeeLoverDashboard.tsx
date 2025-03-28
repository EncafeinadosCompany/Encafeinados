
import SearchCoffee from '@/common/atoms/search'
import FeaturedCard from '@/modules/featureCard'



const CoffeeLoverDashboard = () => {
  return (

    <div className='min-h-screen flex flex-col content-center  p-4'>
      <SearchCoffee
      className='mb-5'
      ></SearchCoffee>

     <div>
     <h2 className="text-xl font-bold mb-4">Destacados</h2>
     <FeaturedCard
        title='Café de especialidad'
        tag='Popular'
        image='https://th.bing.com/th/id/OIP.cs5oeDoqw2qn66ki25JsmQHaEh?rs=1&pid=ImgDetMain'
        location='Calle 123'
        address='Calle 123'
      >

      </FeaturedCard>
     </div>

    </div>
    // <ResponsiveNavigation></ResponsiveNavigation>
  )
}
export default CoffeeLoverDashboard