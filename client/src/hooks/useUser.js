import useAuth from "./useAuth";
import useAxiosPrivate from "./usePrivate";

export default function useUser() {
    const { isLoggedIn, setUser } = useAuth();
    const axiosPrivateInstance = useAxiosPrivate();
    const INFURA_API_KEY = 'dc4e08c871b54faf911b126ceff387f7'; // Replace with your actual Infura API key

    async function getUser() {
        if (!isLoggedIn) {
            return;
        }

        try {
            // Fetch user data
            const { data } = await axiosPrivateInstance.get('auth/user');
            console.log("User data:", data); // Log the response

            setUser(prevUser => ({
                ...prevUser,
                eth_wallet: data.eth_wallet // Ensure this is correctly set
            }));

            if (data?.eth_wallet) {
                try {
                    // Fetch Ethereum balance using Infura's JSON-RPC method
                    const balanceResponse = await fetch(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            method: 'eth_getBalance',
                            params: [data.eth_wallet, 'latest'],
                            id: 1
                        })
                    });

                    if (!balanceResponse.ok) {
                        throw new Error(`HTTP error! Status: ${balanceResponse.status}`);
                    }

                    const balanceData = await balanceResponse.json();
                    console.log("Balance response:", balanceData); // Log the response

                    if (balanceData?.result) {
                        // Convert balance from wei to ether
                        const balanceInWei = balanceData.result;
                        const balanceInEth = parseFloat(parseInt(balanceInWei, 16) / 1e18).toFixed(4);

                        setUser(prevUser => ({
                            ...prevUser,
                            balance: balanceInEth
                        }));
                    } else {
                        console.error("Invalid balance data:", balanceData);
                    }
                } catch (error) {
                    console.error("Error fetching Ethereum balance:", error);
                }
            } else {
                console.error("No Ethereum wallet address found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return getUser;
}
