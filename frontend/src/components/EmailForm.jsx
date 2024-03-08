import  {useState} from 'react';


const EmailForm = () => {
    const [email, setEmail] = useState('');
    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };
    const handleGetStarted = () => {
        console.log(`Email entered: ${email}`);
    };
    return (
        <section className='flex  gap-4'>
            
            <input
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Join our newsletter"
                    className=" rounded-full p-2"
                />
            <button onClick={handleGetStarted} className='bg-secondary p-2 rounded-full'>Get Started</button>
        </section>
    );
};

export default EmailForm;