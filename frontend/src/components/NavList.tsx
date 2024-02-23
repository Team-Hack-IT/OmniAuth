import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineIdentification } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoHelpCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";


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
        title: 'History',
        path: '/history',
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
    {
        icons: <CiLogout size={20} />,
        title: 'Logout',
        path: '/logout',
    }
]