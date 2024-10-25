const Statistic = ({ title, value }) => {
  return (
    <div className='bg-black-1 p-4 flex flex-col justify-between gap-4 rounded-md'>
      <p className='text-2xl'>{value}</p>
      <p className='text-sm font-semibold text-black-9'>{title}</p>
    </div>
  );
};

export default function Statistics({ data }) {
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left'>
      {data.map((stat, index) => (
        <Statistic key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
