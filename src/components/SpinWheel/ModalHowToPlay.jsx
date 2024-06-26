// Modal.js
import React from 'react';

const ModalHowToPlay = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="p-6 xl:p-12 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-20 text-white">
            <div className="relative w-full h-full p-6 md:p-8 overflow-hidden rounded-2xl bg-dark-blue lg:bg-opacity-85">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h1 className="text-xl flex-grow text-center">Game Rules and How To Play</h1>
                    <button onClick={onClose} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="overflow-auto h-[90%]">
                    <div className='text-2xl text-center mb-4 text-red-500'><b>Fund Adventuring Parties - Dragon's Treasure</b></div>
                    <br />
                    <p><span>Welcome to FAP Dragon's Treasure, a thrilling spin-the-wheel game where you and your fellow adventurers wager your (Cryptocurrency) for a chance to claim the entire dragon's hoard! Your contribution determines your odds of winning. The more you Fund Adventuring Parties, the higher your chances of taking the treasure.</span></p>
                    <p><span>The winner, determined by the spin of the wheel, takes the entire pot (minus a small fee for DragonEyes), representing the dragon's treasure.</span></p>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>How does it work?</b></p>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>How do I Participate?</b></p>
                    <ul>
                        <li aria-level="1"><span>Head over to FAP with MetaMask or another Web3 wallet. Ensure you have cryptocurrency to play. Click "Enter Now" to view your available funds, select the amount you want to bet, and hit "Confirm Entry." Follow the prompts in your wallet app to complete the transaction. Be sure to finish all transactions before the round timer reaches zero, as any transactions completed after the timer expires will not be processed.</span></li>
                    </ul>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>What are my chances of winning?</b></p>
                    <ul>
                        <li aria-level="1"><span>Y</span><span>our chance of winning depends on the proportion of your contribution to the total prize pool when the round closes. For instance, if you contribute 0.3 ETH to a prize pool of 1 ETH, you&rsquo;ll have a 30% chance of winning.</span></li>
                    </ul>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>Is there a minimum entry amount?</b></p>
                    <ul>
                        <li aria-level="1"><span>Yes. Each contribution according to currency must be worth at least&nbsp;</span></li>
                        <ul>
                            <li aria-level="2"><span>ETH = 0.001 ETH</span></li>
                            <li aria-level="2"><span>ICP = 0.05 ICP</span></li>
                            <li aria-level="2"><span>BTC = 0.0001 BTC</span></li>
                            <li aria-level="2"><span>EYES = 1000 EYES</span></li>
                        </ul>
                    </ul>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>Are FAP rounds provably fair?</b></p>
                    <ul>
                        <li aria-level="1"><span>Absolutely! FAP adheres to the House of the Dragon ethos; provably fair game. It leverages the </span><a href="https://internetcomputer.org/docs/current/motoko/main/base/Random"><span>ICP onchain VRF&nbsp;</span></a></li>
                    </ul>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>What does the &ldquo;You Pay&rdquo; mean when I am claiming my winnings?</b></p>
                    <ul>
                        <li aria-level="1"><span>If there isn't enough ETH in a round to cover the fees (i.e., if only USDB was contributed to the round), you'll pay the fee in ETH while withdrawing.</span></li>
                    </ul>
                    <p><span>If there's enough ETH in a round to cover the fees, great! The fee will be subtracted directly from your winning stash at the end of the round.</span></p>
                    <p className='text-2xl text-center mb-4 text-red-500'><b>What is Dragon Eyes Games Fee?</b></p>
                    <ul>
                        <li aria-level="1"><span>We take a fee of 1%-3.5%</span></li>
                    </ul>
                    <br />
                </div>
            </div>
        </div>
    );
};

export default ModalHowToPlay;
