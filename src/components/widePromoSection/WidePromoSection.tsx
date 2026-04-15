"use client";

import MainButton from "../MainButton/MainButton";

const WidePromoSection = () => {
  return (
    <section  className="">
      <div
        className="
          relative h-[460px] md:h-[520px]
          overflow-hidden
          bg-cover bg-center
        "
        style={{
          backgroundImage: "url('/BigBaner.png')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 sm:px-20 text-white">
            <span className="text-xl opacity-80">منتج جديد</span>

            <h2 className="text-xl sm:text-3xl font-bold mt-2 leading-relaxed">
              شامبوهات عالية الجودة
              <br />
              تخفيضات كبيرة ومميزة لها
            </h2>

            <MainButton text={"اطلب الآن"} className="mt-5 w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidePromoSection;
