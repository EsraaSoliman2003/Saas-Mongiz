"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { fetchCurrency } from "./slices/currency/currency";
import { setCurrency } from "./slices/ui/Currency";
import { fetchLogo } from "./slices/logo/logoSlice";
import { fetchColors } from "./slices/colors/colorsSlice";

interface Props {
  children: React.ReactNode;
  lang: string;
  currency: string;
}

function CurrencyLoader({ currency }: { currency: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrency());
    dispatch(setCurrency(currency));
    dispatch(fetchLogo());
    dispatch(fetchColors());
  }, [dispatch, currency]);

  return null;
}

const MainProvider = ({ children, currency }: Props) => {
  return (
    <Provider store={store}>
      <CurrencyLoader currency={currency} />
      {children}
    </Provider>
  );
};

export default MainProvider;