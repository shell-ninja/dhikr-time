const Card = ({ cardData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center font-amiri font-bold text-[#105A59]">
      {cardData.map(([name, info]) => (
        <div
          key={name}
          className="w-full max-w-md flex flex-col justify-center items-center border-2 px-10 py-10 rounded-2xl"
        >
          <h2 className="font-bold text-3xl mb-3">{info.name}</h2>
          <h2 className="font-bold text-3xl mb-3 tracking-wider">
            {info.transliteration}
          </h2>
          <p className="font-normal text-2xl my-2">{info.translation}</p>
          <p className="font-normal text-xl mt-10">{info.meaning}</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
