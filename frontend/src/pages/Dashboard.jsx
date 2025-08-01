import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/User";
import axios from "axios";
export const Dashboard = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: "bearer" + " " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBalance(response.data.balance);
      });
  }, []);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
      </div>
      <div>
        <Users />
      </div>
    </div>
  );
};
