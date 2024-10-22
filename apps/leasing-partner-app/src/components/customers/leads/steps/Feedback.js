import { format, parseISO } from 'date-fns';

export default function Feedback({ feedback }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='text-xs text-darkGrey'>
        {format(parseISO(feedback.created_at), 'd MMM yyyy')}
      </div>
      <div className='text-sm text-darkGrey'>{feedback.feedback}</div>
    </div>
  );
}
