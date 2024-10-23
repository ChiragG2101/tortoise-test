export default function Info({ label, value }) {
  return (
    <div>
      <p className='text-black-6 text-sm'>{label}</p>
      <p className='text-black-8 font-semibold text-base'>{value}</p>
    </div>
  );
}
