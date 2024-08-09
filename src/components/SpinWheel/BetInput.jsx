import { useState } from "react";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAtom } from "jotai";
import { icpAgentAtom, icpBalanceAtom, spinActorAtom, spinGameDataAtom, walletAddressAtom } from "../../store/Atoms";

const BetInput = () => {
  const [valuePerRound, setValuePerRound] = useState([0.001, 0.01, 0.1, 100, 500]);
  const [selectedValue, setSelectedValue] = useState(valuePerRound[0]);
  const [totalEntry, setTotalEntry] = useState(selectedValue); // Initial total entry based on selectedValue
  const [loading, setLoading] = useState(false);
  const [icpAgent] = useAtom(icpAgentAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [spinActor] = useAtom(spinActorAtom);
  const [icpBalance, setICPBalance] = useAtom(icpBalanceAtom);
  const [spinGameData] = useAtom(spinGameDataAtom);
  

  const handleChangeValuePerRound = (value, index) => {
    const newValuePerRound = [...valuePerRound];
    newValuePerRound[index] = value;
    setValuePerRound(newValuePerRound);
    setSelectedValue(value);
    setTotalEntry(value);
  };

  const handleTotalEntryChange = (event) => {
    const newValue = event.target.value;
    if (!isNaN(newValue)) {
      setTotalEntry(newValue);
    }
  };

  const handleAddSelection = async () => {
    setLoading(true);

    const icpAgent_ = icpAgent;

    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };

    var spinCanisterAddress = {
      owner: Principal.fromText(process.env.REACT_APP_SPIN_LEDGER_ID),
      subaccount: [],
    };

    var approve_ = {
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: totalEntry * 100000000 + 10000,
      expected_allowance: [],
      expires_at: [],
      spender: spinCanisterAddress,
    };

    await icpAgent_.icrc2_approve(approve_);

    var placeBetResult = await spinActor.place_bet(totalEntry * 100000000, Number(spinGameData.id));
    if (placeBetResult.success) {
      toast.success("Bet placed successfully");
    } else {
      toast.error(placeBetResult.transferFailed);
    }

    setLoading(false);
    var balanceICP = await icpAgent_.icrc1_balance_of(acc);
    setICPBalance(Number(balanceICP) / 100000000);
  };

  return (
    <div className="">
      <div className="flex mb-4 items-center">
        <p className="text-right mr-4 w-1/3">ICP in Wallet:</p>
        <input type="text" className="flex-1 rounded-md border border-gray-300 px-3 py-2" value={(icpBalance).toLocaleString()} disabled />
      </div>
      <div className="flex mb-4 items-center">
        <p className="text-right mr-4 w-1/3">Total Entry:</p>
        <input type="text" id="totalEntryInput" className="flex-1 rounded-md border border-gray-300 px-3 py-2" onChange={handleTotalEntryChange} value={totalEntry} min="0" />
      </div>
      <div className="flex justify-between mb-4">
        {valuePerRound.map((value, index) => (
          <button key={index} className={`px-3 py-2 rounded-md mr-2 bg-gray-200 text-gray-700 hover:bg-dark-blue hover:text-white`} onClick={() => handleChangeValuePerRound(value, index)}>
            {value}
          </button>
        ))}
      </div>
      <hr />
      <button className={`w-full mt-4 py-1.5 rounded-md text-white font-bold text-lg ${loading ? "bg-gray-400" : "bg-dark-blue"}`} onClick={handleAddSelection} disabled={loading}>
        {loading ? "Submitting bet..." : "Submit Bet"}
      </button>
    </div>
  );
};

export default BetInput;
