"use client";

import Navbar from "@/components/global/navbar";
import { HeroParallax } from "@/components/global/connect-parallax";
import { ContainerScroll } from "@/components/global/container-scroll-animation";
import { LampComponent } from "@/components/global/lamp";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/constants";
import { useState } from "react";

export default function Home() {
  const [pincode, setPincode] = useState("");
  const [predictedCrimeLevel, setPredictedCrimeLevel] = useState<string | null>(
    null
  );

  const fetchApi = async (pincode: string) => {
    fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crimeDataUrl:
          "https://firebasestorage.googleapis.com/v0/b/binsr-484d7.appspot.com/o/crime-data_crime-data_crimestat.csv?alt=media&token=21120ded-08ae-464c-a9ca-4f88b3ad491f",
        pincode: pincode,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (
          json.status === 200 &&
          json.data &&
          json.data.predictedCrimeLevels &&
          json.data.predictedCrimeLevels.length > 0
        ) {
          // Assuming you want the first predicted crime level
          const predictedLevel =
            json.data.predictedCrimeLevels[0].PredictedCrimeLevel;
          setPredictedCrimeLevel(predictedLevel);
        } else {
          // Handle the case where no data is returned
          setPredictedCrimeLevel("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPredictedCrimeLevel("Error fetching data");
      });
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <Navbar />
        <section className="relative flex h-screen w-full flex-col items-center overflow-visible rounded-md bg-neutral-950 antialiased">
          <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
          <div className="mt-[-100px] flex flex-col md:mt-[-50px]">
            <ContainerScroll
              titleComponent={
                <div className="flex flex-col items-center">
                  <Button
                    size={"lg"}
                    className="group mb-8 flex w-full items-center justify-center gap-4 rounded-full border-t-2 border-[#4D4D4D] bg-[#1F1F1F] p-8 text-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-neutral-500 sm:w-fit md:mb-0"
                  >
                    <span className="bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text font-sans text-transparent group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black md:text-center">
                      Get Demo
                    </span>
                  </Button>
                  <h1 className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text font-sans text-5xl font-bold text-transparent md:text-8xl">
                    Arizona State University Saviors
                  </h1>
                </div>
              }
            />
          </div>
        </section>

        <section className="mt-[-100px] md:mt-[18rem]">
          <HeroParallax products={products} />
        </section>
        <section>
          <LampComponent />
        </section>

        {/* Input Field Section */}
        <div className="relative mt-10 flex flex-col items-center justify-center">
          {/* Grid Background */}
          <div className="absolute z-[-1] h-[800px] w-[800px] bg-[linear-gradient(to_right,#0f0f10_1px,transparent_1px),linear-gradient(to_bottom,#0f0f10_1px,transparent_1px)] bg-center bg-[size:1rem_1rem] blur-[1px]"></div>

          <div
            id="poda"
            className="relative flex flex-col items-center justify-center"
          >
            {/* Glow */}
            <div className="absolute z-[-1] max-h-[130px] max-w-[654px] h-full w-full overflow-hidden rounded-[12px] blur-[30px] opacity-40 glow"></div>

            {/* Dark Border Backgrounds */}
            <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>
            <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>
            <div className="absolute z-[-1] max-h-[65px] max-w-[612px] h-full w-full overflow-hidden rounded-[12px] blur-[3px] darkBorderBg"></div>

            {/* White Layer */}
            <div className="absolute z-[-1] max-h-[63px] max-w-[607px] h-full w-full overflow-hidden rounded-[10px] blur-[2px] white"></div>

            {/* Border */}
            <div className="absolute z-[-1] max-h-[59px] max-w-[603px] h-full w-full overflow-hidden rounded-[11px] blur-[0.5px] border"></div>

            {/* Main Input Container */}
            <div id="main" className="relative">
              <input
                placeholder="Enter Pincode..."
                type="text"
                name="text"
                className="h-[56px] w-[601px] rounded-[10px] border-none bg-[#010201] px-[59px] text-[18px] text-white placeholder:text-[#c0b9c0] focus:outline-none"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />

              {/* Input Mask */}
              <div
                id="input-mask"
                className="pointer-events-none absolute top-[18px] left-[70px] h-[20px] w-[200px] bg-[linear-gradient(90deg,transparent,black)]"
              ></div>

              {/* Pink Mask */}
              <div
                id="pink-mask"
                className="pointer-events-none absolute top-[10px] left-[5px] h-[20px] w-[30px] bg-[#cf30aa] blur-[20px] opacity-80 transition-all duration-2000"
              ></div>

              {/* Filter Border */}
              <div className="absolute top-[7px] right-[7px] h-[42px] w-[40px] overflow-hidden rounded-[10px] filterBorder"></div>

              {/* Filter Icon */}
              <div
                id="filter-icon"
                className="absolute top-[8px] right-[8px] z-[2] flex h-full w-full max-h-[40px] max-w-[38px] items-center justify-center overflow-hidden rounded-[10px] border border-transparent bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] isolation-auto"
                onClick={async () => await fetchApi(pincode)}
              >
                {/* SVG content */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-search"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              {/* Search Icon */}
              <div id="search-icon" className="absolute left-[20px] top-[15px]">
                {/* SVG content */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-map-pin"
                >
                  <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 1 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>

            {/* Display Predicted Crime Level */}
            {predictedCrimeLevel && (
              <div className="mt-12 text-lg md:text-2xl font-bold dark:text-white ">
                Predicted Crime Level for {pincode}: {predictedCrimeLevel}
                {/* Image added below */}
                <img
                  src="/pi.jpg"
                  alt="Predicted Crime Level"
                  className="mt-4"
                />
                <img
                  src="/chart.jpg"
                  alt="Predicted Crime Level"
                  className="mt-4"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="mt-40 bottom-0 left-0 w-full flex items-center justify-center p-4 bg-neutral-950 text-white">
        <p className="text-center max-w-4xl">
          At SafeZone, we believe that safety and well-being go beyond
          understanding crime statistics. We encourage residents and visitors to
          explore these resources to enhance their safety, access support in
          times of need, and foster stronger, safer communities. If you are in
          immediate danger or experiencing an emergency, please call 911. For
          non-emergency situations, consider reaching out to local hotlines such
          as Crisis Response Network (1-800-631-1314) or other community
          organizations for assistance.
        </p>
      </footer>
    </>
  );
}
