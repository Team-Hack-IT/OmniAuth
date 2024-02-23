import { Stepper, Step } from '@material-tailwind/react';
import React from 'react';
import { BsCheckLg } from 'react-icons/bs';

const CustomStepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className='w-full py-4 px-8 max-w-[45rem] mx-auto bg-gray-100 rounded-md flex justify-between'>
      <Stepper
        placeholder={null}
        aria-disabled={true}
        activeStep={currentStep}
      >
        <Step
          placeholder={null}
          activeClassName=' bg-step'
          completedClassName='bg-done '
        >
          {currentStep === 0 ? (
            1
          ) : (
            <BsCheckLg className='text-2xl md:text-3xl' />
          )}
        </Step>
        <Step
          placeholder={null}
          activeClassName=' bg-step'
          completedClassName={' bg-done'}
        >
          {currentStep === 1 ? (
            2
          ) : (
            <BsCheckLg className='text-2xl md:text-3xl rounded-full p-1' />
          )}
        </Step>
        <Step
          placeholder={null}
          activeClassName=' bg-step'
          completedClassName={' bg-done'}
        >
          {currentStep === 2 ? 3 : <BsCheckLg className='text-2xl md:3xl rounded-full p-1' />}
        </Step>
      </Stepper>
    </div>
  );
};

export default CustomStepper;
