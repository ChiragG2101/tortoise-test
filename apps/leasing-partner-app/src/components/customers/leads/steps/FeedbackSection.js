import { Button, Divider, Textarea } from '@nextui-org/react';
import Feedback from './Feedback';
import {
  useGetPastFeedbackQuery,
  usePostFeedbackMutation,
} from '@/features/onboarding/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback } from 'react';

const schema = yup.object().shape({
  feedback: yup.string().required('Feedback is required'),
});

export default function FeedbackSection({ slug }) {
  const { data: pastFeedback } = useGetPastFeedbackQuery(slug);
  const [postFeedback, { isLoading: isPostFeedbackLoading }] =
    usePostFeedbackMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data) => {
      try {
        await postFeedback({ organizationId: slug, data }).unwrap();
        reset();
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      }
    },
    [postFeedback, reset, slug]
  );

  return (
    <div className='border-l-1 px-5 md:pl-10 md:pr-20 flex flex-col gap-5'>
      <div className='sm:w-4/5'>
        <div className='font-semibold body-large'>Feedback</div>
        <div className='body-xsmall font-semibold text-darkGrey self-start'>
          Leave any comments for the customer if you feel they need to update
          these documents
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-5 sm:w-4/5'
      >
        <Controller
          name='feedback'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <Textarea
              {...field}
              label='Add comments'
              placeholder='Add your comments here'
              variant='bordered'
              minRows={4}
              isInvalid={!!errors.feedback}
              errorMessage={errors.feedback?.message}
            />
          )}
        />
        <Button
          type='submit'
          className='w-fit bg-black text-white'
          isLoading={isPostFeedbackLoading}
        >
          Submit feedback
        </Button>
      </form>
      <div>
        <div className='font-semibold body-large'>Previous feedback</div>
        <div className='body-xsmall font-semibold text-darkGrey self-start'>
          All the feedbacks suggested by will be displayed here
        </div>
      </div>
      {pastFeedback?.map((feedback, index) => (
        <div key={feedback.created_at}>
          <Feedback feedback={feedback} />
          {index !== pastFeedback.length - 1 && (
            <Divider className='w-4/5 mt-2' />
          )}
        </div>
      ))}
    </div>
  );
}
