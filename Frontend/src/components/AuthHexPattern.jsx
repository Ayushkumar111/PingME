const AuthHexPattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 w-full h-screen">
        <div className="max-w-md text-center">
          {/* Hexagonal Pattern with Alternating Glow Effect */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square w-14 h-14 bg-gray-400/50 rounded-xl transform rotate-45 ${i % 2 === 0 ? "animate-pulse" : ""}`}
              />
            ))}
          </div>
          {/* Title & Subtitle */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthHexPattern;
  