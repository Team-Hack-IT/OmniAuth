
import summary_img from "./summary_img.png";

const Summary = () => {
    return (
        <section className='flex justify-evenly items-center gap-x-10 bg-tertiary min-h-[600px] p-6'>
            <div className="flex justify-around gap-10">
            <div className='  text-white '>
                <h2 className="text-4xl w-[600px] pb-10">Guaranteed robust and secure identiy management platform for users</h2>
                <p className="w-[320px] pt-3 pb-10">We ensure the highest level of security for user authentication and data management</p>
                <button className="bg-button text-white px-10 py-3 border-0 rounded-lg">Sign In</button>
            </div> 

            <div className="">
                <img src={summary_img} alt="summary image" width={300} height={300}/>  
            </div>
            </div>
          
        </ section>
    )
};

export default Summary;