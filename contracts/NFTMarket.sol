// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    // For each Individual market item
    Counters.Counter private _itemIds;
    // For sold item
    Counters.Counter private _itemsSold;
    // Owner of market i.e. contract address 
    address payable owner;
    // Listing Fee
    uint256 listingPrice = 0.0045 ether;
    
    constructor() {
        owner = payable(msg.sender);
    }
    // Metadata of Individual Item
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    // itemId that returns MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;
    // Event to generate on the creation of new MarketItem
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    // Returns the listing price of the contract
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    // 1.1.Creating MarketItem and places an it for sale on the marketplace 
    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        // Generate new marketItem
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        // Changing ownership of NFT to MarketPlace Contract so, MKP Contract intract with it.
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        // Emit the event on creation of new Market Item Creation
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }
    // 1.2.Creates the sale of a marketplace item + Transfers ownership of the item, as well as funds between parties
    function createMarketSale( address nftContract, uint256 itemId ) public payable nonReentrant {
        // Getting Price and TokenId of item
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        // To make sure price must be equal to given price
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        // Transfer amount of token to seller
        idToMarketItem[itemId].seller.transfer(msg.value);
        // Transfer ownership of token to msg.sender(i.e. purchaser )
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        // Update Owner and Sold Details
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        // Transfer listing price to owner of MarketPlace
        payable(owner).transfer(listingPrice);
    }

    // 2.Function for Frontend i.e. Return all unsold, my purchase & my created Items
    // 2.1.Returns all unsold market items 
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        // Declear MarketItem(i.e. struct) type array of length unsold Item number 
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(0)) {
            uint currentId = i + 1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        }
        return items;
    }
    // 2.2.Returns only items that a user has purchased 
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint userItemCount = 0;
        uint currentIndex = 0;
        // Getting total number of user's Token
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                userItemCount += 1;
            }
        }
        // Declear MarketItem(i.e. struct) type array of length user's Item number
        MarketItem[] memory items = new MarketItem[](userItemCount);
        // Stores user TokenId's in item
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId; // Current Token Id
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    // 2.3.Returns only items a user has created 
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint userItemCount = 0;
        uint currentIndex = 0;
        // Getting total number of user's Token
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                userItemCount += 1;
            }
        }
        // Declear MarketItem(i.e. struct) type array of length user's  Item number
        MarketItem[] memory items = new MarketItem[](userItemCount);
        // Stores user TokenId's in item
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

}