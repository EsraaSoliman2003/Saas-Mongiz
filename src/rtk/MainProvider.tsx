"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { fetchCurrency } from "./slices/currency/currency";
import { setCurrency } from "./slices/ui/Currency";
import { fetchSettings } from "./slices/setting/settingSlice";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
  lang: string;
  currency: string;
}

function applyThemeColors(primary: string, secondary: string) {
  document.documentElement.style.setProperty("--main-color", primary);
  document.documentElement.style.setProperty("--dark-color", secondary);
}

function CurrencyLoader({ currency }: { currency: string }) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const id = searchParams.get("id");

  useEffect(() => {
    const load = async () => {
      dispatch(fetchCurrency());
      dispatch(setCurrency(currency));

      const res = await dispatch(fetchSettings(Number(id))).unwrap();
      console.log(res)

      if (res) {
        applyThemeColors(res.primaryColor, res.secondaryColor);
      }
    };

    load();
  }, [dispatch, currency, id]);
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
