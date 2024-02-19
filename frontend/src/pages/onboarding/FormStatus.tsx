import React from 'react';
import { Link, SetURLSearchParams } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

type formStatusProps = {
  status: 'Successful' | 'Failed';
  setCurrentStep: SetURLSearchParams;
};

const FormStatusPage = ({ status, setCurrentStep }: formStatusProps) => {
  return (
    <div className='w-full max-w-[35rem] mx-auto rounded-lg p-4 shadow shadow-gray-300'>
      {status === 'Successful' ? (
        <div className='w-full flex flex-col items-center'>
          <CheckCircleIcon className='w-[180px] h-[180px] text-bgFooter' />

          <div className='text-center'>
            <h2 className='md:text-xl font-bold'>Phone Number Verified</h2>
            <p className='max-w-md mt-2'>
             Thank you for verifying your phone number. You can now proceed to the next step.
            </p>
          </div>

          <Link
            to='/'
            className='btn-primary mt-10'
          >
            Go to homepage
          </Link>
        </div>
      ) : (
        <div className='w-full flex flex-col items-center'>
          <XCircleIcon className='w-[180px] h-[180px] text-red-600' />

          <div className='text-center'>
            <h2 className='md:text-xl font-bold'>Phone Number Verification Failed.</h2>
            <p className='max-w-md mt-2'>An error occured. Please Try again.</p>
          </div>

          <button
            onClick={() => setCurrentStep({ step: '1' })}
            className='btn-primary mt-10'
          >
            Try Again
          </button>

          <Link
            to='/'
            className='underline my-5'
          >
            Go to homepage
          </Link>
        </div>
      )}
    </div>
  );
};

export default FormStatusPage;
