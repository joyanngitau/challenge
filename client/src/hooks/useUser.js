import useAuth from "./useAuth";
import { ethers } from 'ethers';

export default function useUser() {
    const { isLoggedIn, setUser, setIsLoggedIn } = useAuth();

    // Initialize Ethers.js provider
    const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/dc4e08c871b54faf911b126ceff387f7'); // Replace with your Infura project ID

    async function getUser() {
        if (!isLoggedIn) {
            return;
        }

        try {
            const response = await fetch('auth/user');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User data:", data); // Log the response

            setUser(data);

            if (data?.eth_wallet) {
                try {
                    // Fetch Ethereum balance
                    const balance = await provider.getBalance(data.eth_wallet);
                    const balanceInEth = ethers.formatEther(balance);
                    setUser(prevUser => ({
                        ...prevUser,
                        balance: balanceInEth
                    }));
                } catch (error) {
                    console.error("Error fetching Ethereum balance:", error);
                }
            } else {
                console.error("No Ethereum wallet address found.");
            }
        } catch (error) {
            console.error("Error fetching user or balance:", error);
        }
    }

    return getUser;
}
