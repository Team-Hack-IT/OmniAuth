import React from 'react'

const BusinessOnboarding = () => {
  return (
    <div>
        


        
                <div className='form-control'>
                  <label
                    htmlFor='businessName'
                    className='mb-2 block text-sm font-medium'
                  >
                    Business Name
                  </label>
                  <input
                    type='text'
                    id='businessName'
                    {...register('businessName')}
                    placeholder='Enter your business name'
                  />
                  {errors.businessName?.message && (
                    <p className='error'>{errors.businessName.message}</p>
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
                    {...register('email')}
                    placeholder='Enter your email'
                  />
                  {errors.email?.message && (
                    <p className='error'>{errors.email.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='organizationCountry'
                    className='mb-2 block text-sm font-medium'
                  >
                    Country
                  </label>
                  <input
                    type='text'
                    id='organizationCountry'
                    {...register('organizationCountry')}
                    placeholder='Enter your country'
                  />
                  {errors.organizationCountry?.message && (
                    <p className='error'>{errors.organizationCountry.message}</p>
                  )}
                </div>
                <div className='form-control'>
                  <label
                    htmlFor='organizationSector'
                    className='mb-2 block text-sm font-medium'
                  >
                    Sector
                  </label>
                  <input
                    type='text'
                    id='organizationSector'
                    {...register('organizationSector')}
                    placeholder='Enter your sector'
                  />
                  {errors.organizationSector?.message && (
                    <p className='error'>{errors.organizationSector.message}</p>
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
    </div>
  )
}

export default BusinessOnboarding