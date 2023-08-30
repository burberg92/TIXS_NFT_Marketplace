import React, { useContext } from 'react';
import Image from 'next/image';

import images from '../assets';
import { NFTContext } from '../context/NFTcontext';

const CreatorCard = ({ creatorImage, creatorName }) => {
  const { nftCurrency } = useContext(NFTContext); // no using currency since it wont apply in tickets

  return (
    <div className="min-w-190 minlg:min-w-240 dark:bg-nft-black-3 bg-white border dark:border-nft-black-3 border-nft-gray-1  flex flex-col  ">
      <div className=" flex justify-center">
        <div className="relative rounded  ">
          <Image
            src={creatorImage}
            Layout="fill"
            objectFit="cover"
            height={340}
            alt="creatorName"
            className="rounded"
          />
          <div>
            <h4 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">{creatorName}</h4>
            <span>Number of Events</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatorCard;
