const Methods = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen font-amiri text-[#105A59] px-5 md:px-20 text-start">
      <h1 className="text-5xl font-bold font-amiri text-[#105A59] mt-30">
        Methods
      </h1>
      <div className="h-2 w-[75%] md:w-[40%] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>

      <h1 className="text-2xl font-normal my-5">
        Method for calculating prayer times based on geographical location and
        algorithms.
      </h1>

      <p className="text-start text-2xl md:text-4xl font-bold mb-3">
        Allowed values:
      </p>
      <p className="text-start text-xl md:text-3xl font-bold">
        1 - University of Islamic Sciences, Karachi <br />
        2 - Islamic Society of North America <br />
        3 - Muslim World League <br />
        4 - Umm Al-Qura University, Makkah <br />
        5 - Egyptian General Authority of Survey <br />
        ** There was nothing for the value "6" <br />
        7 - Institute of Geophysics, Tehran <br />
        8 - Gulf Region <br />
        9 - Kuwait <br />
        10 - Qatar <br />
        11 - MUIS, Singapore <br />
        12 - UOIF, France <br />
        13 - Diyanet, Turkey <br />
        14 - Russia <br />
        15 - Moonsighting Committee Worldwide <br />
        16 - Dubai (experimental) <br />
        17 - JAKIM, Malaysia <br />
        18 - Tunisia <br />
        19 - Algeria <br />
        20 - KEMENAG, Indonesia <br />
        21 - Morocco <br />
        22 - Lisbon, Portugal <br />
        23 - Jordan
      </p>
    </div>
  );
};

export default Methods;
