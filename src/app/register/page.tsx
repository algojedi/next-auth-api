/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createUserSchema } from '../util/shared/zod-validation';
import { z } from 'zod';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

function RegisterPage() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string>();
  const { register, handleSubmit } = useForm<CreateUserInput>();

  async function onSubmit(values: CreateUserInput) {
    try {
      // Validate the values using the schema
      createUserSchema.parse(values);

      console.log('printing values');
      console.log(values);

      // If validation passes, proceed with the API call
      const dbResponse = await axios.post(`api/users`, values);
      console.log({ dbResponse });
      router.push('/');
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        // Handle validation errors
        console.log('Validation errors:', e.errors);
        setRegisterError(e.errors.map((err) => err.message).join(', '));
      } else {
        // Handle other errors (e.g., network or server errors)
        console.log('Error when trying to register');
        setRegisterError(e.message);
      }
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-element'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='jane.doe@example.com'
            {...register('email')}
          />
        </div>

        <div className='form-element'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            placeholder='Jane Doe'
            {...register('name')}
          />
        </div>

        <div className='form-element'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            placeholder='*********'
            {...register('password')}
          />
        </div>
        <button type='submit'>SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
