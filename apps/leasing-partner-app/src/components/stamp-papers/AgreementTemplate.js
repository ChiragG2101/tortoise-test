/* eslint-disable @next/next/no-img-element */
export default function AgreementTemplate({
  imgSrc,
  title,
  denomination,
  code,
}) {
  return (
    <div className='flex gap-4 border p-4 rounded-xl'>
      <img src={imgSrc} alt='Agreement Template' />
      <div className='flex flex-col gap-5'>
        <div>
          <div className='font-semibold body-small'>{title}</div>
          <div className='body-xsmall text-darkGrey'>{code}</div>
        </div>
        <div className='body-xsmall text-darkGrey'>
          Denomination: ₹ {denomination}
        </div>
      </div>
    </div>
  );
}
