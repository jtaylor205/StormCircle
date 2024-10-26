import * as React from "react";
import NavigatorBtn from "./NavigatorBtn.jsx";

export default function Navigator() {
  return (
    <>
        <div className="Nav align-center">
            <div className="text-3xl font-bold mb-2">
                Storm Circle
            </div>
            <div className="">
                I am the navigation panel!
            </div>
            <div className="w-full align-center">
                <NavigatorBtn text={'Supply Search'}/>
                <NavigatorBtn text={'Shelter Locations'}/>
                <NavigatorBtn text={'Evacuation Zones'}/>
            </div>
        </div>
    </>
  )
}
