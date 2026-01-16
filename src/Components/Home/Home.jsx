import Form from "../Form/Form";

const Home = () => {
  return (
    <div>
      {/* Mobile / all device background */}
      <div className="relative min-h-screen flex items-center justify-center px-[50px]">
        {/* Background image with opacity */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/BG.png')",
            opacity: 0.45, // controls only BG opacity
          }}
        />

        {/* Optional overlay for extra darkness */}
        <div className="absolute inset-0"></div>

        {/* Ayat content */}
        <div className="absolute md:top-[250px] z-10 flex flex-col items-center justify-center text-center px-6">
          <p className="text-3xl md:text-[48px] lg:text-6xl font-amiri font-bold tracking-widest leading-relaxed text-[#105A59]">
            يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ
            وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ
          </p>

          <p className="mt-6 text-3xl md:text-[48px] lg:text-6xl font-amiri font-bold text-[#105A59]">
            O believers! Seek comfort in patience and prayer. Allah is truly
            with those who are patient.
          </p>

          <p className="mt-5 md:mt-10 text-xl md:text-4xl font-amiri font-normal text-[#105A59]">
            Al-Baqarah 2:153
          </p>
        </div>
      </div>
      <div className="z-[100]">
        <Form />
      </div>
    </div>
  );
};

export default Home;
