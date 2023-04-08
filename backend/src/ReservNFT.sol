// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IRestaurantManager} from "../interfaces/IRestaurantManager.sol";

error ReservNFT__InsufficientPayment();
error ReservNFT__InactiveDrop();
error ReservNFT__OutsideDropWindow();
error ReservNFT__ExceedReservationsLimit();
error ReservNFT__Unauthorized();
error ReservNFT__NonexistentToken();

/// @title ReservNFT
/// @notice A contract for creating restaurant reservation NFTs with different drops and mint prices.
contract ReservNFT is ERC721, ReentrancyGuard {
    uint256 private _tokenIds;

    address public owner;
    address private restaurantManagerAddress;
    // Mapping from token ID to reservation data
    mapping(uint256 => Reservation) public reservations;
    mapping(uint256 => string) private _tokenURIs;

    /// @notice Reservation data structure
    struct Reservation {
        uint256 dropId;
        uint256 restaurantId;
        uint256 reservationTimestamp; // Represents both date and time
    }

    event ReservationCreated(
        uint256 tokenId,
        uint256 dropId,
        uint256 restaurantId,
        uint256 reservationTimestamp
    );

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert ReservNFT__Unauthorized();
        }
        _;
    }

    constructor() ERC721("ReservNFT", "RRNFT") {
        owner = msg.sender;
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        if (!_exists(tokenId)) {
            revert ReservNFT__NonexistentToken();
        }
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function setRestaurantManagerAddress(
        address _restaurantManagerAddress
    ) public onlyOwner {
        restaurantManagerAddress = _restaurantManagerAddress;
    }

    /// @notice Creates a reservation NFT for the specified drop
    /// @param dropId The unique identifier of the drop
    /// @param reservationTimestamp The timestamp of the reservation
    /// @param tokenURI The token URI containing the metadata for the reservation NFT
    /// @return newItemId The unique identifier of the newly minted reservation NFT
    function createReservNFT(
        uint256 dropId,
        uint256 reservationTimestamp,
        string memory tokenURI
    ) public payable nonReentrant returns (uint256) {
        // Retrieve drop details from RestaurantManager contract
        IRestaurantManager restaurantManager = IRestaurantManager(
            restaurantManagerAddress
        );

        IRestaurantManager.Drop memory drop = restaurantManager.getDrop(dropId);

        bytes32 timeSlotId = keccak256(abi.encodePacked(reservationTimestamp));
        uint256 reservationCount = restaurantManager
            .getTimeSlotReservationCount(dropId, timeSlotId);

        if (reservationCount >= drop.reservationsPerWindow) {
            revert ReservNFT__ExceedReservationsLimit();
        }

        // Check if the payment is sufficient
        if (msg.value < drop.mintPrice) {
            revert ReservNFT__InsufficientPayment();
        }

        // Check if the drop is active
        if (!drop.isActive) {
            revert ReservNFT__InactiveDrop();
        }

        // Check if the reservation timestamp is within the drop window
        if (
            reservationTimestamp < drop.startDate ||
            reservationTimestamp > drop.endDate
        ) {
            revert ReservNFT__OutsideDropWindow();
        }

        restaurantManager.setTimeSlotReservationCount(
            dropId,
            timeSlotId,
            ++reservationCount
        );

        // Retrieve restaurant details
        IRestaurantManager.Restaurant memory restaurant = restaurantManager
            .getRestaurant(drop.restaurantId);
        string memory restaurantName = restaurant.name;

        _tokenIds = _tokenIds + 1;
        uint256 newItemId = _tokenIds;

        reservations[newItemId] = Reservation(
            dropId,
            drop.restaurantId,
            reservationTimestamp
        );

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit ReservationCreated(
            newItemId,
            dropId,
            drop.restaurantId,
            reservationTimestamp
        );

        // Handle mint price and refund any overpayment
        if (msg.value > drop.mintPrice) {
            uint256 refundAmount = msg.value - drop.mintPrice;
            payable(msg.sender).transfer(refundAmount);
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

    /// @notice Withdraws the contract balance to the owner
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }
}
