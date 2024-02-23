import "../styles/Connect.css"
import EmailForm from './EmailForm';

const Connect = () => {
    return (
        <section className='Connect'>
            <h1>Want To Stay Connected?</h1>
            <div className='EmailOutBox'>
            <EmailForm />   
            </div>
        </section>
    );
};


export default Connect;