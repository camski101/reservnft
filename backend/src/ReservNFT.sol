// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title ReservNFT
/// @notice A contract for creating restaurant reservation NFTs with different drops and mint prices.
contract ReservNFT is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to reservation data
    mapping(uint256 => Reservation) public reservations;

    // Mapping from drop ID to Drop data
    mapping(uint256 => Drop) public drops;

    /// @notice Reservation data structure
    struct Reservation {
        uint256 tokenId;
        uint256 dropId;
        uint256 restaurantId;
        string restaurantName;
        uint256 reservationDate;
        uint256 reservationTime;
    }

    /// @notice Drop data structure
    struct Drop {
        uint256 dropId;
        uint256 restaurantId;
        uint256 mintPrice;
        bool isActive;
    }

    event ReservationCreated(
        uint256 tokenId,
        uint256 dropId,
        uint256 restaurantId,
        string restaurantName,
        uint256 reservationDate,
        uint256 reservationTime
    );
    event DropCreated(uint256 dropId, uint256 restaurantId, uint256 mintPrice);
    event DropStatusUpdated(uint256 dropId, bool isActive);

    constructor() ERC721("ReservNFT", "RRNFT") {}

    /// @notice Creates a new drop with the given parameters
    /// @param dropId The unique identifier of the drop
    /// @param restaurantId The unique identifier of the restaurant
    /// @param mintPrice The price to mint a reservation NFT for this drop
    function createDrop(
        uint256 dropId,
        uint256 restaurantId,
        uint256 mintPrice
    ) public {
        require(
            !drops[dropId].isActive,
            "Drop ID already exists and is active"
        );

        drops[dropId] = Drop(dropId, restaurantId, mintPrice, true);
        emit DropCreated(dropId, restaurantId, mintPrice);
    }

    /// @notice Updates the status of a drop
    /// @param dropId The unique identifier of the drop
    /// @param isActive The new status of the drop
    function updateDropStatus(uint256 dropId, bool isActive) public {
        require(
            drops[dropId].isActive != isActive,
            "Drop status is already set to the specified value"
        );
        drops[dropId].isActive = isActive;
        emit DropStatusUpdated(dropId, isActive);
    }

    /// @notice Creates a reservation NFT for the specified drop
    /// @param dropId The unique identifier of the drop
    /// @param restaurantName The name of the restaurant
    /// @param reservationDate The date of the reservation
    /// @param reservationTime The time of the reservation
    /// @param tokenURI The token URI containing the metadata for the reservation NFT
    /// @return newItemId The unique identifier of the newly minted reservation NFT
    function createReservNFT(
        uint256 dropId,
        string memory restaurantName,
        uint256 reservationDate,
        uint256 reservationTime,
        string memory tokenURI
    ) public payable nonReentrant returns (uint256) {
        require(drops[dropId].isActive, "Drop is not active");
        require(
            msg.value >= drops[dropId].mintPrice,
            "Not enough payment for minting"
        );

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        reservations[newItemId] = Reservation(
            newItemId,
            dropId,
            drops[dropId].restaurantId,
            restaurantName,
            reservationDate,
            reservationTime
        );
        emit ReservationCreated(
            newItemId,
            dropId,
            drops[dropId].restaurantId,
            restaurantName,
            reservationDate,
            reservationTime
        );

        if (msg.value > drops[dropId].mintPrice) {
            // Refund any overpayment
            payable(msg.sender).transfer(msg.value - drops[dropId].mintPrice);
        }

        return newItemId;
    }

    /// @notice Retrieves the details of a reservation
    /// @param tokenId The unique identifier of the reservation NFT
    /// @return A Reservation struct containing the reservation details
    function getReservationDetails(
        uint256 tokenId
    ) public view returns (Reservation memory) {
        return reservations[tokenId];
    }

    /// @notice Retrieves the details of a drop
    /// @param dropId The unique identifier of the drop
    /// @return A Drop struct containing the drop details
    function getDropDetails(uint256 dropId) public view returns (Drop memory) {
        return drops[dropId];
    }
}
