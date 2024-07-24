import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser';

export default function Home() {
    const { user } = useAuth();
    const getUser = useUser();
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            await getUser();
            setBalance(user?.balance);  // Update balance after user data is fetched
        };

        fetchUserData();
    }, [getUser, user?.balance]);

    return (
        <div className='container mt-3'>
            <h2>
                <div className='row'>
                    <div className="mb-12">
                        {user?.email ? (
                            <>
                                <p>User Ethereum Wallet Address: {user?.first_name}</p>
                                <p>User Ethereum Balance: {balance !== null ? `${balance} ETH` : 'Loading...'}</p>
                            </>
                        ) : (
                            'Please login first'
                        )}
                    </div>
                </div>
            </h2>
        </div>
    )
}
