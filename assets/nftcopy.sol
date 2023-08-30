// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    // declared private variables _tokenIds and _tokenSold of type Counters.Counter
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    // this is what the owner of the contract gets when nft is listed
    uint256 listingPrice = 0.025 ether;
    //declaring owner var of type address, owner will get a commish on sales
    address payable owner; 
    //passing an int and getting a MarketItem, we are mapping an id to a MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;
    //struct similar to a JS object
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price; 
        bool sold;
    }

    // event triggered upon some action
    event MarketItemCreated (
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price, 
        bool sold
    );

    constructor() ERC721('NFT TICKETS', 'TIXS') {
        //the owner is the one deploying it
        // the msg is th actual transaction
        owner = payable(msg.sender);

    }

    // function to allow owner to update price
    function updateListingPrice(uint _ListingPrice) public payable {
        require(owner == msg.sender, "Only owner can update the listing price");

        listingPrice = _ListingPrice;
    }

    // function to that returns listing price, view means function doesnt do anything only returns something
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // list it to our marketplace
        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "price must be greater than 0");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        //creating mapping for MarketItem
        idToMarketItem[tokenId] = MarketItem(
            tokenId, 
            payable(msg.sender), 
            payable(address(this)), 
            price, 
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender,"only item owner can perform this operation" );
        require(msg.value == listingPrice, "Price must be equail to listing price");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);

    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint price =idToMarketItem[tokenId].price;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
        
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    // Returns only items a user has listed//
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount =0;
        uint currentIndex =0;

        for(uint i=0; i < totalItemCount; i++) {
            if(idToMarketItem[i+1].owner == msg.sender){
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i=0; i < itemCount ; i ++) {
            if(idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i + 1;

                MarketItem storage currentItem = idToMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items ;
    }
}