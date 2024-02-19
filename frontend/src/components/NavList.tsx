import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineIdentification } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoHelpCircleOutline } from "react-icons/io5";



export const NavList = [
    {
        icons: <LuLayoutDashboard size={20} />,
        title: 'Dashboard',
        path: '/dashboard',
    },
    {
        icons: <HiOutlineIdentification size={20} />,
        title: 'Docs Verification',
        path: '/verification',
    },
    {
        icons: <IoIosNotificationsOutline size={20} />,
        title: 'Notifications',
        path: '/notifications',
    },
    {
        icons: <IoMdSettings size={20} />,
        title: 'Settings',
        path: '/settings',
    },
    {
        icons: <IoHelpCircleOutline size={20} />,
        title: 'Help',
        path: '/help',
    },
]