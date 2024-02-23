import React, { createContext, useState, useContext } from "react";

export const DataContext = createContext({
  user: {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    location: "",
    channel: "",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (_data: individualProps) => {},
  data: {
    businessName: "",
    email: "",
    organizationCountry: "",
    organizationSector: "",
    channel: "",
  },
  setData: (_data: businessProps) => {},
});

interface DataProviderProps {
  children: React.ReactNode;
}
export interface individualProps {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  location: string;
  channel: string;
}
export interface businessProps {
  businessName: string;
  email: string;
  organizationCountry: string;
  organizationSector: string;
  channel: string;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [user, setUser] = useState<individualProps>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    location: "",
    channel: "",
  });

  const [data, setData] = useState<businessProps>({
    businessName: "",
    email: "",
    organizationCountry: "",
    organizationSector: "",
    channel: "",
  });

  return (
    <DataContext.Provider value={{ data, setData, user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
