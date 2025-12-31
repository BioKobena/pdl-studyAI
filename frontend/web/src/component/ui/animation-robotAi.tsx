import React from "react";
import Lottie from "lottie-react";
import groovyWalkAnimation from "../../../public/aiRobot.json";

export const Animation = () => {
  return (
    <div className="w-full h-full">
      <Lottie
        width={500}
        height={500}
        animationData={groovyWalkAnimation}
        loop={true}
      />
    </div>
  );
};
