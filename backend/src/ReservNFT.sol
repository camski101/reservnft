// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

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
        uint256 indexed tokenId,
        uint256 indexed dropId,
        uint256 indexed restaurantId,
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

    // Generate metadata JSON for URI
    function generateMetadataJson(
        uint256 restaurantId,
        uint256 reservationTimestamp
    ) internal pure returns (string memory) {
        // Define the imageURI based on your desired image
        string
            memory imageURI = "https://cdn.onlinewebfonts.com/svg/img_481205.png";
        uint256 m_restaurantId = restaurantId;
        uint256 m_reservationTimestamp = reservationTimestamp;

        // Generate metadata JSON
        string memory metadataJson = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"Reservation NFT", "description":"Restaurant reservation NFT", "attributes":[{"trait_type":"restaurantId","value":',
                            Strings.toString(m_restaurantId),
                            '},{"trait_type":"reservationTimestamp","value":',
                            Strings.toString(m_reservationTimestamp),
                            '}], "image":"',
                            imageURI,
                            '"}'
                        )
                    )
                )
            )
        );

        return metadataJson;
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
    /// @return newItemId The unique identifier of the newly minted reservation NFT
    function createReservNFT(
        uint256 dropId,
        uint256 reservationTimestamp
    ) public payable nonReentrant returns (uint256) {
        // Retrieve drop details from RestaurantManager contract
        IRestaurantManager restaurantManager = IRestaurantManager(
            restaurantManagerAddress
        );

        uint256 m_reservationTimestamp = reservationTimestamp;

        IRestaurantManager.Drop memory drop = restaurantManager.getDrop(dropId);

        bytes32 timeSlotId = keccak256(
            abi.encodePacked(m_reservationTimestamp)
        );
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
            m_reservationTimestamp < drop.startDate ||
            m_reservationTimestamp > drop.endDate
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

        // Generate metadata JSON string
        string memory metadataJson = generateMetadataJson(
            drop.restaurantId,
            m_reservationTimestamp
        );

        _tokenIds = _tokenIds + 1;
        uint256 newItemId = _tokenIds;

        reservations[newItemId] = Reservation(
            dropId,
            drop.restaurantId,
            m_reservationTimestamp
        );

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataJson);

        emit ReservationCreated(
            newItemId,
            dropId,
            drop.restaurantId,
            m_reservationTimestamp
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
