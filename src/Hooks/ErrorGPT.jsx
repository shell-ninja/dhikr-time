import { Link } from "react-router-dom";

const ErrorGPT = () => {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "transparent",
        fontFamily: "Amiri, serif",
      }}
    >
      <div className="max-w-3xl w-full text-center relative">
        {/* Floating Geometry */}
        <div className="relative mb-10">
          <div
            className="w-36 h-36 mx-auto rounded-full border-4 opacity-30 animate-[float_4s_ease-in-out_infinite]"
            style={{ borderColor: "#105A59" }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              className="text-6xl md:text-7xl font-bold animate-[fadeUp_0.9s_ease_forwards]"
              style={{ color: "#105A59" }}
            >
              Error
            </h1>
          </div>
        </div>

        {/* Arabic Phrase */}
        <p
          className="text-2xl md:text-3xl tracking-widest text-text-light mb-4 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{
            animationDelay: "0.2s",
          }}
        >
          حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ
        </p>

        {/* Main Message */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-3 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{
            color: "#105A59",
            animationDelay: "0.35s",
          }}
        >
          Could not fetch information from the server
        </h2>

        {/* Description */}
        <p
          className="max-w-xl mx-auto mb-8 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{
            color: "rgba(16,90,89,0.75)",
            animationDelay: "0.5s",
          }}
        >
          Please check your internet connection or try again in a few moments.
          If the problem persists, the service may be temporarily unavailable.
        </p>

        {/* Actions */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ animationDelay: "0.65s" }}
        ></div>
      </div>

      {/* Local Animations (No Tailwind Config) */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(28px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default ErrorGPT;
