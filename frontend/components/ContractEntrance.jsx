import { useWeb3Contract } from "react-moralis";

export default function ContractEntrance() {
  const contract = useWeb3Contract("ContractName", "0x1234..."); // ContractName is the name of the contract in the Moralis dashboard
  return <div>Contract: {contract}</div>;
}