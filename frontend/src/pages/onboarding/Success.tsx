import React from 'react';
import { Link, SetURLSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

type formStatusProps = {
  status: 'Successful' | 'Failed';
  step: string;
};

const Success = ({ status, step }: formStatusProps) => {
const navigate = useNavigate();
  return (
    <div className='w-full max-w-[35rem] mx-auto rounded-lg p-4 shadow shadow-gray-300'>
      {status === 'Successful' ? (
        <div className='w-full flex flex-col items-center'>
          <CheckCircleIcon className='w-[180px] h-[180px] text-bgFooter' />

          <div className='text-center'>
            <h2 className='md:text-xl font-bold'>Great</h2>
            <p className='max-w-md mt-2'>
        Congratulations!!!, you have successfully been verified.
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
            <h2 className='md:text-xl font-bold'>Failed.</h2>
            <p className='max-w-md mt-2'>An error occured. Please Try again.</p>
          </div>

          <button
            onClick={() =>navigate(step)}
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

export default Success;
