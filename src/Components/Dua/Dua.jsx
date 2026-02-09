import { usePageTitle } from "../../Hooks/pageName";
import PageTransition from "../../Hooks/PageTransition";

const Dua = () => {
  usePageTitle("Dua", " | Dhikr Time");
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col justify-center items-center px-10">
        <h1 className="text-5xl font-amiri font-bold text-[#105A59]">Dua</h1>

        <div className="h-2 w-[75%] md:w-[40%] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>
        <div className="flex flex-col justify-center items-center text-start font-amiri text-2xl md:text-3xl text-[#105A59]">
          <p>This page is under development</p>
          <p>
            The Developer is preparing the API for
            <strong> 'Authentic Dua and Dhikrs'</strong>.
          </p>
          <p>This page will be updated soon In-Sha-Allah</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dua;
