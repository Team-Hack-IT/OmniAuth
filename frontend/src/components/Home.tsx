import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { NavList } from "./NavList";
import { Link } from "react-router-dom";


type Props = {
  children: React.ReactNode;
}


const Home = ( {children}: Props) => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <section className="flex gap-6 z-20 md:z-0">
      <div
        className={`bg-gray-500 min-h-screen   ${
          open ? "w-72" : "w-16"
        } text-primary px-4 duration-500 fixed top-0 left-0 z-50`}
      >
        <div className="py-3 flex justify-end">
          <CiMenuBurger
            size={26}
            className="cursor-pointer"
            onClick={handleOpen}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative ">
          {NavList.map((item, index) => {
            return (
              <Link
                to={item.path}
                key={index}
                className=" flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-200 rounded-md"
              >
                <p>{item.icons}</p>
                <span
                  style={{
                    transitionDelay: `${index * 300}ms`,
                  }}
                  className={`whitespace-pre duration-500  ${
                    !open && "opacity-0 translate-x-28 overflow-hidden "
                  }`}
                >
                  {item.title}
                </span>
                {/* <span
                  className={` ${
                    open && "hidden"
                  }absolute left-48 bg-white font-semibold whitespace-pre text-gray-800 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  {item.title}
                </span> */}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="m-3 text-xl text-gray-900 font-semibold px-20">
     {children}
      </div>
    </section>
  );
};

export default Home;
