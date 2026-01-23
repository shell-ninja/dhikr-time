import { useState } from "react";
import "./Form.css";
import { Link } from "react-router-dom";
import Times from "../Times/Times";

const schools = ["Hanafi", "Shafie"];
const methods = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
].map(Number);

const Form = () => {
  const [selectedSchool, setSelectedSchool] = useState(schools[0]);
  const [schoolOpen, setSchoolOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  const [methodOpen, setMethodOpen] = useState(false);

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [formData, setFormData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schoolNum = selectedSchool === "Hanafi" ? 1 : 2;

    const URL = "https://nominatim.openstreetmap.org/search";
    const QUERY = `?city=${city}&country=${country}&format=json&limit=1`;

    try {
      const res = await fetch(URL + QUERY, {
        headers: {
          "User-Agent": "your-app-name", // required by Nominatim
        },
      });

      const data = await res.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      setFormData({
        City: city,
        Country: country,
        School: selectedSchool,
        Number: schoolNum,
        Method: selectedMethod,
        Latitude: lat,
        Longitude: lon,
      });

      // 👉 use these in your prayer API
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl text-[#105A59] font-amiri font-bold">
        Prayer Times
      </h1>
      <div className="h-2 w-[75%] md:w-[40%] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>

      {/* Mobile Device */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-3 bg-transparent border-[#105A59] border-2 w-[70%] px-[50px] py-[50px] rounded-[20px] md:hidden form-style"
      >
        <input
          className="h-[68px] w-[274px] bg-transparent border-[#105A59] border-2 rounded-[15px] pl-5 text-3xl font-amiri font-bold text-[#105A59] outline-none input-style"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="h-[68px] w-[274px] bg-transparent border-[#105A59] border-2 rounded-[15px] pl-5 text-3xl font-amiri font-bold text-[#105A59] outline-none input-style"
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        {/* School Dropdown */}
        <label className="mt-5 text-xl font-amiri font-bold text-[#105A59] text-start w-[274px]">
          Select a School
        </label>
        <div className="relative w-[274px]">
          <div
            className="h-[68px] border-2 border-[#105A59] rounded-[15px] pl-5 flex items-center justify-between cursor-pointer text-3xl font-amiri font-bold text-[#105A59] bg-transparent"
            onClick={() => setSchoolOpen(!schoolOpen)}
          >
            {selectedSchool}
            <span className="mr-5">&#9662;</span>
          </div>

          {/* Dropdown Options */}
          {schoolOpen && (
            <div className="absolute top-[68px] left-0 w-full bg-[#105A59] rounded-[15px] overflow-hidden z-50 shadow-lg">
              {schools.map((school) => (
                <div
                  key={school}
                  className="px-5 py-4 text-3xl font-amiri font-bold text-[#E4F6D9] hover:bg-[#0d3b35] cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setSelectedSchool(school);
                    setSchoolOpen(false);
                  }}
                >
                  {school}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Method Dropdown */}
        <label className="mt-5 text-xl font-amiri font-bold text-[#105A59] text-start w-[274px]">
          Select a Method
        </label>
        <div className="relative w-[274px]">
          <div
            className="h-[68px] border-2 border-[#105A59] rounded-[15px] pl-5 flex items-center justify-between cursor-pointer text-3xl font-amiri font-bold text-[#105A59] bg-transparent"
            onClick={() => setMethodOpen(!methodOpen)}
          >
            {selectedMethod}
            <span className="mr-5">&#9662;</span>
          </div>

          {methodOpen && (
            <div className="absolute top-[68px] left-0 w-full bg-[#105A59] max-h-[180px] overflow-y-auto dropdown-scroll rounded-[15px] z-50 shadow-lg">
              {methods.map((method) => (
                <div
                  key={method}
                  className="px-5 py-4 text-3xl font-amiri font-bold text-[#E4F6D9] hover:bg-[#0d3b35] cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setSelectedMethod(method);
                    setMethodOpen(false);
                  }}
                >
                  {method}
                </div>
              ))}
            </div>
          )}

          <p className="text-[#105A59] font-medium font-amiri">
            Learne more about
            <span className="font-bold">
              <Link to="/methods"> Methods</Link>
            </span>
          </p>
        </div>

        <input
          className="h-[68px] w-[274px] text-[#E4F6D9] bg-[#105A59] border-2 rounded-[15px] text-3xl font-amiri font-bold mt-6 cursor-pointer"
          type="submit"
        />
      </form>

      {/* Tab Device */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex flex-col justify-center items-center gap-3 bg-transparent border-[#105A59] border-2 w-[800px] px-[50px] py-[50px] rounded-[20px] form-style"
      >
        <div className="flex justify-center items-center gap-5">
          <input
            className="h-[68px] w-[350px] bg-transparent border-[#105A59] border-2 rounded-[15px] pl-5 text-3xl font-amiri font-bold text-[#105A59] outline-none input-style"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="h-[68px] w-[350px] bg-transparent border-[#105A59] border-2 rounded-[15px] pl-5 text-3xl font-amiri font-bold text-[#105A59] outline-none input-style"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="flex justify-center items-start gap-5 mt-5">
          {/* School Dropdown */}
          <div className="relative w-[350px]">
            <label className="text-xl font-amiri font-bold text-[#105A59] text-start w-full mb-2">
              Select a School
            </label>
            <div
              className="h-[68px] border-2 border-[#105A59] rounded-[15px] pl-5 flex items-center justify-between cursor-pointer text-3xl font-amiri font-bold text-[#105A59] bg-transparent"
              onClick={() => setSchoolOpen(!schoolOpen)}
            >
              {selectedSchool}
              <span className="mr-5">&#9662;</span>
            </div>

            {/* Dropdown Options */}
            {schoolOpen && (
              <div className="absolute top-[68px] left-0 w-full bg-[#105A59] rounded-[15px] overflow-hidden z-50 shadow-lg">
                {schools.map((school) => (
                  <div
                    key={school}
                    className="px-5 py-4 text-3xl font-amiri font-bold text-[#E4F6D9] hover:bg-[#0d3b35] cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedSchool(school);
                      setSchoolOpen(false);
                    }}
                  >
                    {school}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Method Dropdown */}
          <div className="relative w-[350px]">
            <label className="text-xl font-amiri font-bold text-[#105A59] text-start w-full mb-2">
              Select a Method
            </label>
            <div
              className="h-[68px] border-2 border-[#105A59] rounded-[15px] pl-5 flex items-center justify-between cursor-pointer text-3xl font-amiri font-bold text-[#105A59] bg-transparent"
              onClick={() => setMethodOpen(!methodOpen)}
            >
              {selectedMethod}
              <span className="mr-5">&#9662;</span>
            </div>

            {methodOpen && (
              <div className="absolute top-[68px] left-0 w-full max-h-[180px] overflow-y-auto dropdown-scroll bg-[#105A59] rounded-[15px] z-50 shadow-lg">
                {methods.map((method) => (
                  <div
                    key={method}
                    className="px-5 py-4 text-3xl font-amiri font-bold text-[#E4F6D9] hover:bg-[#0d3b35] cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedMethod(method);
                      setMethodOpen(false);
                    }}
                  >
                    {method}
                  </div>
                ))}
              </div>
            )}

            <p className="text-[#105A59] font-medium font-amiri">
              Learne more about
              <span className="font-bold">
                <Link to="/methods"> Methods</Link>
              </span>
            </p>
          </div>
        </div>

        <input
          className="h-[68px] w-[274px] text-[#E4F6D9] bg-[#105A59] border-2 rounded-[15px] text-3xl font-amiri font-bold mt-6 cursor-pointer"
          type="submit"
        />
      </form>
      {formData ? <Times formData={formData} /> : <p></p>}
    </div>
  );
};

export default Form;
