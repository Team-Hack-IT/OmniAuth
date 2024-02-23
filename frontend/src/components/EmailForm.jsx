import React, {useState} from 'react';
import "../styles/EmailForm.css"

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };
    const handleGetStarted = () => {
        console.log(`Email entered: ${email}`);
    };
    return (
        <section className='EmailBox'>
            <label>
                <input
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Input your email"
                    style={{border: 'none'}}
                />
            </label>
            <button onClick={handleGetStarted}>Get Started</button>
        </section>
    );
};

export default EmailForm;