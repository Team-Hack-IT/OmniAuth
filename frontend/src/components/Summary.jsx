import "../styles/Summary.css";
import summary_img from "./summary_img.png";

const Summary = () => {
    return (
        <section className='summary'>
            <div className='summary_txt'>
                <h2>Guaranteed robust and secure identiy management platform for users</h2>
                <p>We ensure the highest level of security for user authentication and data management</p>
                <button>Sign In</button>
            </div> 

            <div className="summary_image">
                <img src={summary_img} alt="summary image"/>  
            </div>
        </ section>
    )
};

export default Summary;