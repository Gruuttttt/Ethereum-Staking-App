import React, { useState, useEffect } from 'react';
import { Wallet, LineChart, ArrowUpCircle, ArrowDownCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { ethers } from 'ethers';
import { STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS } from './contracts/StakingContract';

function App() {
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('0');
  const [totalStaked, setTotalStaked] = useState<string>('0');
  const [userStaked, setUserStaked] = useState<string>('0');
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        try {
          setIsConnecting(true);
          setError('');
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
          
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            STAKING_CONTRACT_ADDRESS,
            STAKING_CONTRACT_ABI,
            signer
          );
          setContract(contract);
          
          // Get initial values
          updateBalances(contract, accounts[0]);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              handleDisconnect();
            } else {
              setAccount(accounts[0]);
              updateBalances(contract, accounts[0]);
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error: any) {
          console.error("Error initializing:", error);
          if (error.code === 4001) {
            setError('Please connect your wallet to use the dApp.');
          } else {
            setError('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
          }
        } finally {
          setIsConnecting(false);
        }
      } else {
        setError('MetaMask is not installed. Please install MetaMask to use this dApp.');
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const updateBalances = async (contract: ethers.Contract, account: string) => {
    try {
      const total = await contract.totalStaked();
      const userBalance = await contract.stakedBalances(account);
      setTotalStaked(ethers.formatEther(total));
      setUserStaked(ethers.formatEther(userBalance));
      setError('');
    } catch (error) {
      console.error("Error updating balances:", error);
      setError('Failed to fetch balances. Please try again.');
    }
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !provider) return;

    try {
      setError('');
      const amountInWei = ethers.parseEther(stakedAmount);
      const tx = await contract.stake(amountInWei, { value: amountInWei });
      await tx.wait();
      
      // Update balances after successful stake
      updateBalances(contract, account);
      setStakedAmount('0');
    } catch (error: any) {
      console.error("Error staking:", error);
      if (error.code === 4001) {
        setError('Transaction was cancelled.');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds to complete the transaction.');
      } else {
        setError('Failed to stake. Please try again.');
      }
    }
  };

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !provider) return;

    try {
      setError('');
      const amountInWei = ethers.parseEther(unstakeAmount);
      const tx = await contract.unstake(amountInWei);
      await tx.wait();
      
      // Update balances after successful unstake
      updateBalances(contract, account);
      setUnstakeAmount('0');
    } catch (error: any) {
      console.error("Error unstaking:", error);
      if (error.code === 4001) {
        setError('Transaction was cancelled.');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds to complete the transaction.');
      } else {
        setError('Failed to unstake. Please try again.');
      }
    }
  };

  const handleConnect = async () => {
    if (!provider) return;
    
    try {
      setIsConnecting(true);
      setError('');
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error: any) {
      console.error("Error connecting:", error);
      if (error.code === 4001) {
        setError('Please connect your wallet to use the dApp.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setUserStaked('0');
    setContract(null);
    setError('Please connect your wallet to continue.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* App Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Staking dApp</span>
            </div>
            <div className="flex items-center space-x-4">
              {!account ? (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </span>
                  <button
                    onClick={handleDisconnect}
                    className="bg-gray-700 rounded-lg p-2 text-gray-300 hover:bg-gray-600 transition-colors"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-300">Total Staked</h3>
              <LineChart className="h-6 w-6 text-blue-400" />
            </div>
            <p className="mt-2 text-3xl font-bold">{totalStaked} ETH</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-300">Your Stake</h3>
              <LayoutDashboard className="h-6 w-6 text-blue-400" />
            </div>
            <p className="mt-2 text-3xl font-bold">{userStaked} ETH</p>
          </div>
        </div>

        {/* Staking Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stake Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <ArrowUpCircle className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-xl font-medium">Stake ETH</h3>
            </div>
            <form onSubmit={handleStake}>
              <div className="mb-4">
                <input
                  type="number"
                  value={stakedAmount}
                  onChange={(e) => setStakedAmount(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount to stake"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                disabled={!account}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!account ? 'Connect Wallet to Stake' : 'Stake'}
              </button>
            </form>
          </div>

          {/* Unstake Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <ArrowDownCircle className="h-6 w-6 text-red-400 mr-2" />
              <h3 className="text-xl font-medium">Unstake ETH</h3>
            </div>
            <form onSubmit={handleUnstake}>
              <div className="mb-4">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount to unstake"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                disabled={!account}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!account ? 'Connect Wallet to Unstake' : 'Unstake'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;