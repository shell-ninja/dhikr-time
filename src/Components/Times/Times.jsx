import useSWR from "swr";

const Times = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const LAT = "23.5483797";
  const LON = "90.5349722";
  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

  const API = `https://islamicapi.com/api/v1/prayer-time/?lat=${LAT}&lon=${LON}&method=1&school=2&api_key=${API_KEY}`;

  const { data, error, isLoading } = useSWR(API, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const date = data.data.date;
  const times = data.data.times;

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const hour = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-4xl md:text-5xl font-amiri font-bold text-[#105A59]">
        {date.readable}
      </h1>
      <div className="h-2 w-[75%] md:w-[40%] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>

      {/* Times */}

      {/*content*/}
      <div className="flex flex-col w-[70%] md:w-[800px] gap-10 bg-transparent border-[#105A59] border-2 px-[50px] py-[50px] rounded-[20px] form-style">
        {Object.entries(times).map(([name, time]) => (
          <div
            key={name}
            className="flex flex-col md:flex-row justify-between items-center text-[#105A59] font-amiri font-bold text-[40px] md:text-[55px]"
          >
            <span>{name}:</span>
            <span>{formatTime(time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;
