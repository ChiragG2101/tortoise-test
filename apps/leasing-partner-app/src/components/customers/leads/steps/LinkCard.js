/* eslint-disable @next/next/no-img-element */
export default function LinkCard() {
  return (
    <div className='border p-4 py-3 rounded-xl flex items-center gap-2'>
      <img src='/assets/link.svg' alt='Link' />
      <div>
        <div className='text-xs font-semibold'>Sameer Nigam - Linked IN</div>
        <div className='text-xs line-clamp-1'>
          https://www.linkedin.com/in/sanigam/?originalSubdo.....
        </div>
      </div>
    </div>
  );
}
