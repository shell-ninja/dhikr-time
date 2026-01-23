import useSWR from "swr";
import Loader from "../../Hooks/Loader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Times = ({ formData }) => {
  const {
    City: city,
    Country: country,
    Latitude: lat,
    Longitude: lon,
    Method: selectedMethod,
    Number: schoolNum,
  } = formData;

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

  const API = `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lon}&method=${selectedMethod}&school=${schoolNum}&api_key=${API_KEY}`;

  const { data, error, isLoading } = useSWR(API, fetcher);

  if (isLoading) return <Loader />;
  if (error) return <p>Error...</p>;

  const date = data.data.date;
  const times = data.data.times;
  const Fajr = times.Fajr;
  const Sunrise = times.Sunrise;
  const Dhuhr = times.Dhuhr;
  const Asr = times.Asr;
  const Maghrib = times.Maghrib;
  const Isha = times.Isha;
  const Tahajjud = times.Lastthird;

  const prayerTimes = {
    Fajr,
    Sunrise,
    Dhuhr,
    Asr,
    Maghrib,
    Isha,
    Tahajjud,
  };

  console.log("Prayer Times: ", prayerTimes);

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
      <h3 className="text-2xl md:text-3xl font-amiri font-bold text-[#105A59] mt-3">
        {city}, {country}
      </h3>

      <div className="h-2 w-full md:w-[800px] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>

      <div className="flex flex-col w-full max-w-[800px] gap-10 md:gap-3 mt-8 border-2 border-[#105A59] p-10 px-[120px] md:px-10 rounded-[20px] form-style">
        {Object.entries(prayerTimes).map(([name, time]) => (
          <div
            key={name}
            className="flex flex-col md:flex-row justify-between items-center text-[#105A59] font-amiri font-bold text-[30px] md:text-[40px]"
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
