import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../context/NFTcontext';
import { Banner, CreatorCard, NFTCard } from '../components';
import images from '../assets';
import { makeId } from '../utils/makeId';

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchNFTs()
      .then((items) => {
        setNfts(items);
        console.log(nfts);
      });
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth > parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Events simplified. Tickets revolutionized. Welcome to the Tixs experience"
          childStyles="md:text-4xl sm:text-2xl xs+text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 cs:h-44 rounded-3xl"
        />

        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0> ">Nearby Events</h1>

          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}
                  `}
                />
              ))}
              {!hideButtons && (
              <>
                <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h12 top-45 cursor-pointer left-1">
                  <Image
                    src={images.left}
                    Layout="fill"
                    objectFit="contain"
                    alt="left_arrow"
                    className={theme === 'light' && 'filter invert'}
                  />
                </div>
                <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-17 minlg:h17 top-45 cursor-pointer right-1">
                  <Image
                    src={images.right}
                    layout="fill"
                    objectFit="contain"
                    alt="right_arrow"
                    className={theme === 'light' && 'filter invert'}
                  />
                </div>
              </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flexcol sm:items-start">
            <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 sm:mb-4">Hot Events</h1>
            <div>
              Search Bar
            </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-start">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
            {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.342).toFixed(2),
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: 'cool NFT on sale',
                }}
              />
            ))} */}

          </div>
        </div>
      </div>
    </div>

  );
};
export default Home;
