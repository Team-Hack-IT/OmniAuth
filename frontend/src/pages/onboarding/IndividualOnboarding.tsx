import React, { useMemo, useState, forwardRef, createElement } from 'react';
import { Loader2 } from 'lucide-react';
import { steps } from '../../lib/data';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import CustomStepper from '../../utils/CustomStepper';
import { submittedDataTypeBusiness, submittedDataTypeIndividual } from '../../utils/types';
import { IndividualOnboardingSchema, BusinessOnboardingSchema } from '../../utils/schema';
import { useData } from '../../context/FormContext';
import { Axios } from '../../Axios';
import FormStatusPage from './FormStatus';


type Inputs = z.infer<typeof IndividualOnboardingSchema>;
type fieldname = keyof Inputs;

type CustomInputProps = {
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};



const IndividualOnboarding = () => {
  const { data, user } = useData();
    const [searchParams, setSearchParams] = useSearchParams();
    const step = Number(searchParams.get('step')) - 1 || 0;
    const currentStep = step < 0 ? 0 : step;
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'Successful' | 'Failed'>('Successful');
    const [selectedTab, setSelectedTab] = useState<'individual' | 'organization'>('individual');


    const {
      register,
      handleSubmit,
      reset,
      trigger,
      watch,
      formState: { errors },
    } = useForm<Inputs>({
      mode: 'onTouched',
      resolver: zodResolver(IndividualOnboardingSchema),
    });
    const processForm: SubmitHandler<Inputs> = async (data) => {

    }


  //This function performs the next step logic and submits form when done.
  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as fieldname[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 2) {
      // setCurrentStep((step) => step + 1);
      setSearchParams({ step: '2' });
    }
    if (currentStep === steps.length - 2) {
      await handleSubmit(handleFormSubmit)();
    }
  };
  const handleFormSubmit = async (data: submittedDataTypeIndividual) => {
    setIsLoading(true);
    try {
      const response = await Axios.post('/api/', data);
      if (response.status === 200) {
        console.log(response.data.message);
        setStatus('Successful');
      }
    } catch (error) {
      console.log('An error occured', error);
      setStatus('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>  
      <CustomStepper currentStep={currentStep} />


      {currentStep < steps.length - 1 ? (
        <div className='w-full max-w-[35rem]  mx-auto rounded-lg p-4 shadow shadow-gray-300 h-full'>
          <h2 className='my-4 text-xl font-semibold text-center'>
            {steps[currentStep].name}
          </h2>
          <form
            className='grid grid-cols-1 gap-y-2'
            onSubmit={handleSubmit(processForm)}
          >
          

            {/* FIRST STEP */}

            {currentStep === 0 && (
              <>
               <div className='form-control'>
                  <label
                    htmlFor='firstName'
                    className='mb-2 block text-sm font-medium'
                  >
                    First Name
                  </label>
                  <input
                    type='text'
                    defaultValue={user.firstName}
                    id='firstName'
                    {...register('firstName')}
                    placeholder='Enter your first name'
                  />
                  {errors.firstName?.message && (
                    <p className='error'>{errors.firstName.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='lastName'
                    className='mb-2 block text-sm font-medium'
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    defaultValue={user.lastName}
                    id='lastName'
                    {...register('lastName')}
                    placeholder='Enter your last name'
                  />
                  {errors.lastName?.message && (
                    <p className='error'>{errors.lastName.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='email'
                    className='mb-2 block text-sm font-medium'
                  >
                    Email
                  </label>
                  <input
                    type='text'
                    id='email'
                    defaultValue={user.email}
                    {...register('email')}
                    placeholder='Enter your email'
                  />
                  {errors.email?.message && (
                    <p className='error'>{errors.email.message}</p>
                  )}
                </div>

                <div className='form-control'>
                  <label
                    htmlFor='country'
                    className='mb-2 block text-sm font-medium'
                  >
                    Country
                  </label>
                  <input
                    type='text'
                    id='country'
                    {...register('country')}
                    placeholder='Enter your country'
                  />
                  {errors.country?.message && (
                    <p className='error'>{errors.country.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='location'
                    className='mb-2 block text-sm font-medium'
                  >
                    Location
                  </label>
                  <input
                    type='text'
                    id='location'
                    {...register('location')}
                    placeholder='Enter your address'
                  />
                  {errors.location?.message && (
                    <p className='error'>{errors.location.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='channel'
                    className='mb-2 block text-sm font-medium'
                  >
                    Channel
                  </label>
                  <textarea
                    id='channel'
                    {...register('channel')}
                    placeholder='How did you hear about us?'
                    className='min-h-[100px]'
                  />
                  {errors.channel?.message && (
                    <p className='error'>{errors.channel.message}</p>
                  )}
                </div>
              </>
            )}
              {/* FIRST STEP */}
              {currentStep === 1 && (
              <>
                <div className='form-control'>
                 
                  <input
                    type='phone'
                    id='phone'
                    // {...register('phone')}
                    placeholder='Enter your phone number'
                  />
                  {/* {errors.phone?.message && (
                    <p className='error'>{errors.phone.message}</p>
                  )} */}
                </div>
              </>
            )}
              
              {/* THIRD STEP */}
              {currentStep === 2 && (
                <>
                
                </>
              )}



           
            <button
              type='button'
              onClick={nextStep}
              className='btn-primary py-3 mt-1.5 flex items-center justify-center disabled:bg-opacity-75 disabled:pointer-events-none bg-green-500 rounded-md'
              disabled={isLoading}
            >
              {isLoading && <Loader2 className='mr-2 animate-spin' />}
              {currentStep === steps.length - 1
                ? 'Continue'
                : isLoading
                ? 'Verifying...'
                : 'Verify'}
            </button>
          </form>
        </div>
      ) : (
        <FormStatusPage
          status={status}
          setCurrentStep={setSearchParams}
        />
      )}
    </div>
  )
}

export default IndividualOnboarding