
import EmailForm from './EmailForm';

const Connect = () => {
    return (
        <section className='py-10 flex flex-col gap-5 justify-center items-center bg-background'>
            <h1 className='font-bold text-2xl'>Want To Stay Connected?</h1>
            <div className=''>
            <EmailForm />   
            </div>
        </section>
    );
};


export default Connect;